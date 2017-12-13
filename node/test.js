const model = require('./bin/model');
const sequelize = model.sequelize;
const encrypt = require("./moduleTools/encrypt");
model.sync(function(){
    let
        User = model.User,
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
    console.log("test");
    (async()=>{
        if(true){
            await User.create({
                Account: "lhs",
                Password: encrypt.getPassword("123456"),
                UserAlias: "火六"
            }).then(function(user){
                var userLoginInfo = UserLoginInfo.build();
                //console.log(userLoginInfo);
                user.setIM_UserLoginInfo(userLoginInfo);
                Group.create({
                    GroupName: "我的群1",
                    Owner_Id: user.Id
                });
                Team.create({
                    TeamName: "我的好友",
                    U_Id: user.Id
                });
                Team.create({
                    TeamName: "测试分组",
                    U_Id: user.Id
                });
            }).catch(function(err) {
                // print the error details
                console.log(err);
            });
            await User.create({
                Account: "lhs2",
                Password: encrypt.getPassword("123456"),
                UserAlias: "火六2"
            }).then(function(user){
                var userLoginInfo = UserLoginInfo.build({U_Id:user.Id});
                user.setIM_UserLoginInfo(userLoginInfo);
                Group.create({
                    GroupName: "我的群2",
                    Owner_Id: user.Id
                });
                Team.create({
                    TeamName: "我的好友",
                    U_Id: user.Id
                });
            }).catch(function(err) {
                // print the error details
                console.log(err);
            });
            await User.create({
                Account: "lhs3",
                Password: encrypt.getPassword("123456"),
                UserAlias: "火六3"
            }).then(function(user){
                var userLoginInfo = UserLoginInfo.build({U_Id:user.Id});
                user.setIM_UserLoginInfo(userLoginInfo);
                Group.create({
                    GroupName: "我的群3",
                    Owner_Id: user.Id
                });
                Team.create({
                    TeamName: "我的好友",
                    U_Id: user.Id
                });
            }).catch(function(err) {
                // print the error details
                console.log(err);
            });
            //添加好友
            await sequelize.query(`SELECT IM_Team.Id as t1_Id,IM_Users.Id as u2_Id from IM_Team,IM_Users where IM_Team.U_Id = (SELECT Id from IM_Users where IM_Users.Account = 'lhs') and IM_Users.Account = 'lhs2'`).spread(function(results, metadata){
                //console.log(results);
                TeamMembers.create({
                    U_Id: results[0].u2_Id,
                    T_Id: results[0].t1_Id
                });
            });
            await sequelize.query(`SELECT IM_Team.Id as t2_Id,IM_Users.Id as u1_Id from IM_Team,IM_Users where IM_Team.U_Id = (SELECT Id from IM_Users where IM_Users.Account = 'lhs2') and IM_Users.Account = 'lhs'`).spread(function(results, metadata){
                //console.log(results);
                TeamMembers.create({
                    U_Id: results[0].u1_Id,
                    T_Id: results[0].t2_Id
                });
            });
            await sequelize.query(`SELECT IM_Team.Id as t1_Id,IM_Users.Id as u2_Id from IM_Team,IM_Users where IM_Team.U_Id = (SELECT Id from IM_Users where IM_Users.Account = 'lhs') and IM_Users.Account = 'lhs3'`).spread(function(results, metadata){
                //console.log(results);
                TeamMembers.create({
                    U_Id: results[1].u2_Id,
                    T_Id: results[1].t1_Id
                });
            });
            await sequelize.query(`SELECT IM_Team.Id as t2_Id,IM_Users.Id as u1_Id from IM_Team,IM_Users where IM_Team.U_Id = (SELECT Id from IM_Users where IM_Users.Account = 'lhs3') and IM_Users.Account = 'lhs'`).spread(function(results, metadata){
                //console.log(results);
                TeamMembers.create({
                    U_Id: results[0].u1_Id,
                    T_Id: results[0].t2_Id
                });
            });
        }    
    })();
    (async()=>{
        var user = await User.findAll();
        console.log(JSON.stringify(user));
    })();
});

