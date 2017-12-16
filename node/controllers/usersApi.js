"use strict";
//数据库模块
const model = require("../bin/model");
const lodash = require("lodash");
const encrypt = require("../moduleTools/encrypt");

const APIError = require("../bin/rest").APIError;
const rongCloud = require("../moduleTools/rongCloud");
const getUserByToken = require("../moduleTools/getUserByToken");
const sequelize = model.sequelize;

//用户表
let User = model.User,
    UserLoginInfo = model.UserLoginInfo,
    Group = model.Group,
    GroupMembers = model.GroupMembers,
    Team = model.Team,
    TeamMembers = model.TeamMembers;
//给UserLoginInfo添加外键
User.hasOne(UserLoginInfo,{foreignKey:"U_Id"});
UserLoginInfo.belongsTo(User,{foreignKey:"U_Id"});
//给Group添加外键
User.hasMany(Group,{foreignKey:"Owner_Id",as:"group"});
//给Team添加外键
User.hasMany(Team,{foreignKey:"U_Id",as:"friend"});
User.belongsToMany(Group,{through: "IM_GroupMembers"});
Group.belongsToMany(User,{through: "IM_GroupMembers"});
User.belongsToMany(Team,{through: "IM_TeamMembers"});
Team.belongsToMany(User,{through: "IM_TeamMembers"});

module.exports = {
    "POST /api/users/login": async(ctx,next)=>{
        try {
            var
                t = ctx.request.body,
                user,rongToken,userLI;
            if(!t.Account||!t.Account.trim()){
                throw new APIError("invalid_input","Missing account");
            }
            if(!t.Password||!t.Password.trim()){
                throw new APIError("invalid_input","Missing password");
            }
            t.Password = encrypt.getPassword(t.Password);
            user = (await User.find({
                where: t
            })).get();
            console.log(user);
            if(!user){
                throw new APIError("invalid_account_password","Account and password error");
            }
            var params = lodash.extend(t,{
                AccessToken: encrypt.getToken((t.APPId||"")+(t.PhoneType||"window")),
                RefreshToken: encrypt.getToken((t.APPId||"")+(t.PhoneType||"window"))
            });
            var uli = (await UserLoginInfo.find({
                where: {
                    U_Id: user.Id
                }
            })).get();
            if(!uli||!uli.RongCloudToken){
                rongToken = await rongCloud.getToken(user.Id,user.UserAlias||user.RealName,user.PortraitUri);
                if(!rongToken){
                    throw new APIError("invalid_rongToken","get rongtoken error");
                }
                params.RongCloudToken = rongToken.token;
            }
            console.log(params);
            if(uli){            
                await UserLoginInfo.update(params,{
                    where: {
                        Id: uli.Id
                    }
                });
                uli = (await UserLoginInfo.find({
                    where: {
                        U_Id: user.Id
                    }
                })).get()||uli;
            }else{
                uli = (await UserLoginInfo.create(params)).get();
            }
            console.log(uli);
            console.log(lodash(user||{},uli||{},{
                Id: null,
                Password: null
            }));
            ctx.rest({
                RongCloudToken: uli.RongCloudToken,
                AccessToken: params.AccessToken,
                RefreshToken: params.RefreshToken,
                user: lodash(user||{},uli||{},{
                    Id: null,
                    Password: null
                })
            });
        } catch (error) {
            throw new APIError(error.code||"invalid_login",error.message||"")
        }
    },
    "GET /api/users/getIMList": async(ctx,next)=>{
        var
            t = ctx.query,
            user,params;
        console.log(t);
        user = await getUserByToken(t.Token||"");
        if(!user&&!user.user){
            throw new APIError("100","token error");
        }
        params = {
            mine: {
                username: user.user.username(),
                id: user.user.Id||"",
                status: "",
                sign: user.user.Sign||"",
                avatar: user.user.PortraitUri||""
            },
            friend: [],
            group: []
        }
        console.log(params);
        var friend = await Team.findAll({
            attributes:['id',['TeamName','groupname'],'isdefault'],
            where: {
                U_Id: user.user.Id
            }
        });
        for(var i = 0;i<friend.length;i++){
            var element = friend[i];
            if(element){
                var list = await sequelize.query(`
                    SELECT 
                        im_users.id AS 'id',
                        CASE 
                            WHEN im_users.RealName IS NOT NULL THEN im_users.RealName 
                            WHEN im_users.UserAlias IS NOT NULL THEN im_users.UserAlias 
                            WHEN im_users.Account IS NOT NULL THEN im_users.Account 
                        END AS 'username',
                        im_users.PortraitUri AS 'avatar',
                        im_users.Sign AS 'sign',
                        im_users.Status AS 'status' 
                    FROM im_users,im_teammembers 
                    WHERE 
                        im_users.Id = im_teammembers.U_Id 
                        AND im_teammembers.T_Id = '${element.get().id}' 
                `);
                params.friend.push(lodash.extend(element.get(),{
                    list: list[0]
                }));
            }
        }
        params.group = await Group.findAll({
            attributes:['id','groupname',['PortraitUri','avatar'],'description',['Owner_Id','ownerId'],['Manager_Id','managerId']],
            where: {
                Owner_Id: user.user.Id
            }
        });
        ctx.rest({
            status: 0,
            message: "获取好友信息成功!",
            data: params
        });

    }
}
// "mine":{
//     "username":"",//用户昵称（优先级：真实姓名，别名，账号）
//     "id":"",//用户id
//     "status":"",//用户在线状态
//     "sign":"",//签名
//     "avatar":""//头像
//     },
//     "friend":[{
//     "groupname":"",//用户分组名称
//      "id":"",//分组id
//      "online":"",//好友在线数量
//      "isdefault":"",//是否默认分组
//      "list":[{
//             "username":"",//好友名称用户昵称（优先级：真实姓名，别名，账号）
//             "id":"",//好友id        
//             "avatar":"",//好友头像
//             "sign":""//好友签名
//      }]
//     }],
//     "group":[{
//           "groupname":"",//群名称
//      "id":"",//群id
//      "avatar":"",//群头像
//      "description":""//群描述
//     }]