// 路由控制器
"use strict";
//导入fs文件
const fs = require("fs");
const multer = require('koa-multer');//加载koa-multer模块
//文件上传  
//配置  
var storage = multer.diskStorage({  
    //文件保存路径  
    destination: function (req, file, cb) {  
      cb(null, 'upload')  
    },  
    //修改文件名称  
    filename: function (req, file, cb) {  
      var fileFormat = (file.originalname).split(".");  
      cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);  
    }  
  })  
  //加载配置  
  var upload = multer({ storage: storage });  
  //路由  
//   router.post('/upload', upload.single('file'), async (ctx, next) => {  
//     ctx.body = {  
//       filename: ctx.req.file.filename//返回文件名  
//     }  
//   })

//添加路由请求
function addMapping(router,mapping){
    for(var url in mapping){
        console.log(url);
        if(url.startsWith("GET ")){
            var path = url.substring(4);
            router.get(path,mapping[url]);
        }else if(url.startsWith("POST ")){
            var path = url.substring(5);
            router.post(path,upload.single('file'),mapping[url]);
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