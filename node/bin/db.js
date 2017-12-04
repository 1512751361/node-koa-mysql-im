//数据库初始化
const Sequelize = require("sequelize");
const uuid = require("node-uuid");

//导入配置文件
const config = require("./config");


function generateId(){
    return uuid.v4();
}
//初始化
var sequelize = new Sequelize(config.database,config.username,config.password,{
    hsot: config.host,
    dialect: config.dialect || "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
const ID_TYPE = Sequelize.STRING(50);

function defineModel(name,attributes){
    var attrs = {};
    for(let key in attributes){
        let value = attributes[key];
        if(typeof(value)==="object"&&value["type"]){
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        }else{
            attrs[key] = {
                type: value,
                allowNull: false
            }
        }
    }
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    }
    return sequelize.define(name,attrs,{
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function(obj){
                let now = Date.now();
                if(obj.isNewRecord){
                    if(!obj.id){
                        obj.id = generateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                }else{
                    obj.updatedAt = now;
                    obj.version++;
                }
            }
        }
    });
}

//类型数组
const TYPES = [
    "STRING",
    "INTEGER",
    "BIGINT",
    "TEXT",
    "DOUBLE",
    "DATEONLY",
    "BOOLEAN"
];
var exp = {
    defineModel: defineModel,
    sync: ()=>{
        if(process.env.NODE_ENV !== "production"){
            console.log(`${Date.now()}`);
            sequelize.sync({force:true});
        }else{
            throw new Error("Connot sync() when NODE_ENV is set to 'production'.");
        }
    }
}
for(let type of TYPES){
    exp[type] = Sequelize[type];
}
exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;