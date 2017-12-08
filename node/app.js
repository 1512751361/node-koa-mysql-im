"use strict";
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
//解决跨域模块
var cors = require('koa-cors');

const controller = require("./bin/controller");
const templating = require("./bin/templating");
const rest = require("./bin/rest");


const isProduction = process.env.NODE_ENV === "production"||true;

const app = new Koa();

//数据库测试
const test = require("./test");

//解决跨域
app.use(cors());

//第一个middleware是记录URL已经页面执行时间
app.use(async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        exectTime;
    await next();
    exectTime = new Date().getTime() - start;
    ctx.response.set("X-Response-Time",`${exectTime}`);
});
//第二个middleware处理静态文件
if(!isProduction){
    let staticFiles = require("./static-files");
    app.use(staticFiles("/static/",__dirname+"/static"));
}
//第三个middleware解析POST请求
app.use(bodyParser());
//第四个middleware负责给ctx加上render()来使用nunjucks
app.use(templating(__dirname+"/views",{
    noCache: !isProduction,
    watch: !isProduction
}));
//第五个middleware负责api接口请求
app.use(rest.restify());
//最后一个middleware处理URL路由
app.use(controller());

//启动服务
app.listen(3000);
console.log("app started at port 3000...");