const model = require('./bin/model');
//model.sync();
let
    User = model.User,
    UserLoginInfo = model.UserLoginInfo,
    Group = model.Group,
    GroupMembers = model.GroupMembers,
    Team = model.Team,
    TeamMember = model.TeamMembers;
User.hasOne(UserLoginInfo,{foreignKey:"U_Id"});
UserLoginInfo.belongsTo(User,{foreignKey:"U_Id"});
// User.hasMany(Group);
// User.hasMany(Team);
// User.belongsToMany(Group,{through: "IM_GroupMembers"});
// Group.belongsToMany(User,{through: "IM_GroupMembers"});
// User.belongsToMany(Team,{through: "IM_TeamMembers"});
// Team.belongsToMany(User,{through: "IM_TeamMembers"});
console.log("test");
(async()=>{
    await User.create({
        Account: "lhs",
        Password: "123456",
        UserAlias: "火六"
    }).then(function(user){
        var userLoginInfo = UserLoginInfo.build({U_Id:user.Id});
        console.log(userLoginInfo);
        user.setIM_UserLoginInfo(userLoginInfo);
    }).catch(function(err) {
        // print the error details
        console.log(err);
    });
    await User.create({
        Account: "lhs2",
        Password: "123456",
        UserAlias: "火六2"
    }).then(function(user){
        var userLoginInfo = UserLoginInfo.build({U_Id:user.Id});
        user.setIM_UserLoginInfo(userLoginInfo);
    }).catch(function(err) {
        // print the error details
        console.log(err);
    });
    await User.create({
        Account: "lhs3",
        Password: "123456",
        UserAlias: "火六3"
    }).then(function(user){
        var userLoginInfo = UserLoginInfo.build({U_Id:user.Id});
        user.setIM_UserLoginInfo(userLoginInfo);
    }).catch(function(err) {
        // print the error details
        console.log(err);
    });
})();
(async()=>{
    var user = await User.findAll();
    console.log(JSON.stringify(user));
})();