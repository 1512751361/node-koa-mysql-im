// 服务器模块模板
"use strict";
//导入nunjucks模块
const nunjucks = require("nunjucks");
//创建env
function createEnv(path,opts){
    let
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path||"../views",{
                noCache: noCache,
                watch: watch
            }),{
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            }
        );
    if(opts.filters){
        for(var f in opts.filters){
            env.addFilter(f,opts.filters[f]);
        }
    }
    return env;
}
function templating(path,opts){
    //创建nunjucks的env对象
    var env = createEnv(path,opts);
    return async(ctx,next)=>{
        //给ctx绑定render函数
        ctx.render = function(view,model){
            ctx.response.body = env.render(view,Object.assign({},ctx.state||{},model||{}));
            //设置Content-Type
            ctx.response.type = "text/html";
        }
        //继续处理请求
        await next();
    }
}
//接口暴露
module.exports = templating;