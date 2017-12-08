"use strict";
//数据库模块
const model = require("../bin/model");
const APIError = require("../bin/rest").APIError;
const rongCloud = require("../moduleTools/rongCloud");
//用户表
let User = model.User,
    UserLoginInfo = model.UserLoginInfo;

module.exports = {
    "POST /api/users/login": async(ctx,next)=>{
        var
            t = ctx.request.body,
            user,rongToken,userLI;
        if(!t.Account||!t.Account.trim()){
            throw new APIError("invalid_input","Missing account");
        }
        if(!t.Password||!t.Password.trim()){
            throw new APIError("invalid_input","Missing password");
        }
        user = await User.find({
            where: t
        });
        console.log(user);
        if(!user){
            throw new APIError("invalid_account_password","Account and password error");
        }   
        rongToken = await rongCloud.getToken(user.Id,user.UserAlias||user.RealName,user.PortraitUri);
        if(!rongToken){
            throw new APIError("invalid_rongToken","get rongtoken error");
        }
        ctx.rest(rongToken);
    }
}