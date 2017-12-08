//用户信息表

//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("IM_Users",{
    Account: {
        type: db.STRING(50),
        allowNull: false,
        unique: true,
        comment: "用户名"
    },
    Password: {
        type: db.STRING(100),
        allowNull: false,
        comment: "用户密码"
    },
    UserAlias: {
        type: db.STRING(50),
        allowNull: true,
        comment: "用户别名"
    },
    RealName: {
        type: db.STRING(50),
        allowNull: true,
        comment: "用户真实姓名"
    },
    Birthday: {
        type: db.DATEONLY(),
        allowNull: true,
        comment: "生日"
    },
    Gender: {
        type: db.BIGINT(),
        allowNull: true,
        comment: "性别"
    },
    PortraitUri: {
        type: db.STRING(100),
        allowNull: true,
        comment: "头像"
    },
    Sign: {
        type: db.STRING(200),
        allowNull: true,
        comment: "签名"
    },
    CellPhone: {
        type: db.BIGINT(11),
        allowNull: true,
        comment: "手机号码"
    },
    Email: {
        type: db.STRING(100),
        allowNull: true,
        comment: "邮箱"
    },
    QQ: {
        type: db.STRING(50),
        allowNull: true,
        comment: "QQ"
    },
    Status: {
        type: db.BIGINT(),
        allowNull: true,
        comment: "状态"
    }
},{
    comment: "用户基本信息"
});