"use strict";
//数据库模块
const model = require("../bin/model");
const APIError = require("../bin/rest").APIError;
//用户表
let User = model.User;

module.exports = {
    "GET /api/users/login": async(ctx,next)=>{
        var
            t = {},
            user;
        t.account = "lhs";
        t.password = "123456";
        if(!t.account||!t.account.trim()){
            throw new APIError("invalid_input","Missing account");
        }
        if(!t.password||!t.password.trim()){
            throw new APIError("invalid_input","Missing password");
        }
        console.log(t);
        user = await User.find({
            where: {
                account: t.account,
                password: t.password
            }
        });
        console.log(user);
        ctx.rest(user);
    }
}