//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("IM_Group",{
    GroupName: {
        type: db.STRING(50),
        allowNull: false,
        comment: "群名称"
    },
    PortraitUri: {
        type: db.STRING(100),
        allowNull: true,
        comment: "头像"
    },
    Description: {
        type: db.STRING(200),
        allowNull: true,
        comment: "描述"
    },
    Owner_Id: {
        type: db.STRING(50),
        allowNull: false,
        references: {
            model: "IM_Users",
            key: "Id"
        },
        comment: "用户Id"
    },
    Manager_Id: {
        type: db.STRING(500),
        comment: "群管理员"
    }
},{
    indexes: [{
        name: "group_userId",
        method: "BTREE",
        fields: ["Owner_Id"]
    }],
    comment: "群组"
});