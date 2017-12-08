//导入db文件
const db = require("../bin/db");
module.exports = db.defineModel("IM_Team",{
    TeamName: {
        type: db.STRING(50),
        allowNull: false,
        comment: "组名称"
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
    IsDefault: {
        type: db.BOOLEAN(),
        defaultValue: false,
        comment: "是否默认分组"
    }
},{
    indexes: [{
        name: "team_userId",
        method: "BTREE",
        fields: ["U_Id"]
    }],
    comment: "组"
});