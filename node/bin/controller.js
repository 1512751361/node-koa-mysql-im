// 路由控制器
"use strict";
//导入fs文件
const fs = require("fs");

//添加路由请求
function addMapping(router,mapping){
    for(var url in mapping){
        console.log(url);
        if(url.startsWith("GET ")){
            var path = url.substring(4);
            router.get(path,mapping[url]);
        }else if(url.startsWith("POST ")){
            var path = url.substring(5);
            router.post(path,mapping[url]);
        }else if(url.startsWith("PUT ")){
            var path = url.substring(4);
            router.put(path,mapping[url]);
        }else if(url.startsWith("DELETE ")){
            var path = url.substring(7);
            router.del(path,mapping[url]);
        }else{
            var path = url.substring(url.indexOf(" ")+1);
            router.all(path,mapping[url]);
        }
    }
}
//添加控制器
function addControllers(router,dir){
    //读取路由控制器文件夹
    let files = fs.readdirSync(__dirname+"/"+dir);
    //获取路由文件名
    let js_files = files.filter((f)=>{
        return f.endsWith(".js");
    });
    for(var f of js_files){
        let mapping = require(__dirname+"/"+dir+"/"+f);
        addMapping(router,mapping);
    }
}
//接口暴露
module.exports = function(dir){
    let
        controllers_dir = dir || "../controllers",
        router = require("koa-router")();
    addControllers(router,controllers_dir);
    return router.routes();
}