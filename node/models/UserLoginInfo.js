//用户登录信息表

//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("IM_UserLoginInfo",{
    U_Id: {
        type: db.STRING(50),
        unique: true,
        allowNull: false,
        field: "U_Id",
        references: {
            model: "IM_Users",
            key: "Id",
            name: "U_Id"
        },
        comment: "用户Id"
    },
    LoginCount: {
        type: db.BIGINT(),
        comment: "登录总次数"
    },
    RongCloudToken: {
        type: db.STRING(200),
        comment: "融云通讯Token"
    },
    LastLoginIP: {
        type: db.STRING(200),
        comment: "最后一次登录IP"
    },
    AccessToken: {
        type: db.STRING(200),
        comment: "请求使用的Token"
    },
    RefreshToken: {
        type: db.STRING(200),
        comment: "更新Token使用的Token"
    },
    PhoneType: {
        type: db.STRING(50),
        comment: "APP的手机操作系统类型"
    },
    ClientId: {
        type: db.STRING(100),
        comment: "APP的手机客户端标识码"
    },
    Version: {
        type: db.STRING(50),
        comment: "APP的版本号"
    }
},{
    indexes: [{
        name: "userLoginInfo_userId",
        method: "BTREE",
        fields: ["U_Id"]
    }],
    comment: "用户登录信息"
});