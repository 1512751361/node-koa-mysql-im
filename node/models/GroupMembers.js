//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("IM_GroupMembers",{
    G_Id: {
        type: db.STRING(50),
        allowNull: false,
        references: {
            model: "IM_Group",
            key: "Id"
        },
        comment: "群组Id"
    },
    U_Id: {
        type: db.STRING(50),
        allowNull: false,
        references: {
            model: "IM_Users",
            key: "Id"
        },
        comment: "用户Id"
    },
    Roles: {
        type: db.BIGINT(),
        defaultValue: 0,
        comment: "群角色(默认值为0,1表示群管理员,2表示群主)"
    }
},{
    indexes: [{
        name: "groupMembers_groupId",
        method: "BTREE",
        fields: ["G_Id"]
    },{
        name: "groupMembers_userId",
        method: "BTREE",
        fields: ["U_Id"]
    }],
    comment: "群成员"
});