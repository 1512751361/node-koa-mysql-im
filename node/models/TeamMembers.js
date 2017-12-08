//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("IM_TeamMembers",{
    T_Id: {
        type: db.STRING(50),
        allowNull: false,
        references: {
            model: "IM_Team",
            key: "Id"
        },
        comment: "组Id"
    },
    U_Id: {
        type: db.STRING(50),
        allowNull: false,
        references: {
            model: "IM_Users",
            key: "Id"
        },
        comment: "用户Id"
    }
},{
    indexes: [{
        name: "teamMembers_teamId",
        method: "BTREE",
        fields: ["T_Id"]
    },{
        name: "teamMembers_userId",
        method: "BTREE",
        fields: ["U_Id"]
    }],
    comment: "群成员"
});