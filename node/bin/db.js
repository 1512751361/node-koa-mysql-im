//数据库初始化
const Sequelize = require("sequelize");
const uuid = require("node-uuid");
const lodash = require("lodash");

//导入配置文件
const config = require("./config");


function generateId(){
    return uuid.v4();
}
//初始化
var sequelize = new Sequelize(config.database,config.username,config.password,{
    hsot: config.host,
    dialect: config.dialect || "mysql",
    port: config.port,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
const ID_TYPE = Sequelize.STRING(50);

function defineModel(name,attributes,options){
    var attrs = {};
    for(let key in attributes){
        let value = attributes[key];
        if(typeof(value)==="object"&&value["type"]){
            value.allowNull = !(value.allowNull!==undefined&&value.allowNull===false);
            attrs[key] = value;
        }else{
            attrs[key] = {
                type: value,
                allowNull: true
            }
        }
    }
    attrs.Id = {
        type: ID_TYPE,
        allowNull: false,
        primaryKey: true,
        unique: true
    };
    attrs.createdAt = {
        type: Sequelize.DATE,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.DATE,
        allowNull: false
    };
    // attrs.version = {
    //     type: Sequelize.BIGINT,
    //     allowNull: false
    // }
    var options = lodash.extend({
        freezeTableName: true,//model对应的表名将与model名相同
        tableName: name,
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci",
        hooks: {
            beforeValidate: function(obj){
                let now = Date.now();
                if(obj.isNewRecord){
                    if(!obj.Id){
                        obj.Id = generateId();
                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    //obj.version = 0;
                }else{
                    obj.updatedAt = now;
                    //obj.version++;
                }
            }
        }
    },options||{});
    //console.dir(options);
    return sequelize.define(name,attrs,options);
}

//类型数组
const TYPES = [
    "STRING",
    "INTEGER",
    "BIGINT",
    "TEXT",
    "DOUBLE",
    "DATEONLY",
    "BOOLEAN",
    "DATEONLY",
    "DATE"
];
var exp = {
    defineModel: defineModel,
    sync: (successCall,errorCall)=>{
        successCall = successCall||function(){console.log('init db ok.');};
        errorCall = errorCall||function(error){console.error(error);};
        if(process.env.NODE_ENV !== "production"){
            console.log(`${Date.now()}`);
            sequelize.sync({force:true}).then(successCall).catch(errorCall);
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
exp.sequelize = sequelize;

module.exports = exp;