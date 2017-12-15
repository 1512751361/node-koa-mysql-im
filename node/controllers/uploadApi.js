"use strict";
//数据库模块
const model = require("../bin/model");
const fs = require("fs");

const APIError = require("../bin/rest").APIError;
const getUserByToken = require("../moduleTools/getUserByToken");
const sequelize = model.sequelize;

//用户表
let User = model.User,
    UserLoginInfo = model.UserLoginInfo;

module.exports = {
    "POST /api/upload/uploadFiles": async(ctx,next)=>{
        try {
            var
                t = ctx.request.body,
                user,userLI;
            user = await getUserByToken(t.Token||"");
            console.log(t);
            if(!user){
                throw new APIError("100","token error");
            }
            if(t.Type == 'image'){//图片
                //接收前台POST过来的base64
                var imgData = t.Base64;
                //过滤data:URL
                var base64Data = imgData.replace(/data:image\/\w+;base64,/g,"");
                var arr = base64Data.split(';');
                var date = new Date();
                var saveUrl = "upload/IM/images/"+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'/'+'IM_images_'+date.getTime()+parseInt((Math.random()*10000))+'_';
                console.log(saveUrl);
                var path = [];
                for(var i = 0;i<arr.length;i++){
                    var dataBuffer = new Buffer(arr[i],'base64');
                    await new Promise((resolve, reject) => {
                        fs.writeFile(saveUrl+i,dataBuffer, function (err, data) {
                            if (err) {
                                console.log(err);
                                reject(err);
                                throw new APIError('invalid_writeFile','writeFile error');
                            } else {
                                console.log(data);
                                path.push(saveUrl+i);
                                resolve(data);
                            }
                        });
                    });                    
                }
                console.log(path);
                ctx.rest({
                    status: 0,
                    message: "",
                    data: path
                })                
            }else if(t.Type == 'sound'){//语言

            }else if(t.Type == 'file'){//文件

            }else{
                throw new APIError('invalid_type','upload type error');
            }
        } catch (error) {
            throw new APIError(error.code||"invalid_requestParams",error.message||"")
        }
    }
}