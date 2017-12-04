//用户信息表

//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("users",{
    account: {
        type: db.STRING(100),
        unique: true
    },
    username: db.STRING(100),
    password: db.STRING(100),
    avatar: db.STRING(200)
});