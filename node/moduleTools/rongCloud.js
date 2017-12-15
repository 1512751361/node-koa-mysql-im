"use strict";
//融云配置文件
var config = {
    appSecret: "GOZBVmEU5eKb",
    AppKey: "25wehl3u29kbw"
}
//导入融云模块
const rongCloudSdk = require('rongcloud-sdk');
//初始化
rongCloudSdk.init(config.AppKey,config.appSecret);

module.exports = {
    getToken: function(userId,username,portraitUri){
        var res = null;
        var reqToken = async()=>{
            try {
                await new Promise((resolve,reject)=>{
                    rongCloudSdk.user.getToken(userId,username,portraitUri,function(err,resultText) {
                        if(err) {
                            console.error(err);
                            reject(err);
                        } else {
                            var result = JSON.parse(resultText);
                            if( result.code === 200 ) {
                                res = result;                       
                                resolve(result);
                            }else{
                                console.error(result);
                                reject(result);                                
                            }
                        }
                    });
                });
            } catch (error) {
                console.error(error);
            }
        }
        return (async()=>{
            await reqToken();
            return res;
        })()
    }
}
