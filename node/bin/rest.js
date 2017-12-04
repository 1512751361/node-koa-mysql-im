// api请求
"use strict";
module.exports = {
    APIError: function(code,message){
        this.code = code||"internal:unknown_error";
        this.message = message||"";
    },
    restify: (pathPrefix)=>{
        //REST API前缀,默认/api/
        pathPrefix = pathPrefix || "/api/";
        return async(ctx,next)=>{
            //是否是REST API前缀
            if(ctx.request.path.startsWith(pathPrefix)){
                //绑定reset()方法
                ctx.rest = (data)=>{
                    ctx.response.type = "application/json";
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (error) {
                    ctx.response.status = 400;
                    ctx.response.type = "application/json";
                    ctx.response.body = {
                        code: error.code||"internal:unknown_error",
                        message: error.message||""
                    }
                }
            }else{
                await next();
            }
        }
    }
}