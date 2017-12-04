//导入配置文件
const defaultConfig = "./config/config-default.js";
const overrideConfig = "./config/config-overrie.js";
const testConfig = "./config/config-test.js";

const fs = require("fs");

var config = null;
if(process.env.NODE_ENV === "test"){
    console.log(`Load ${testConfig}...`);
    config = require(testConfig);
}else {
    console.log(`Load ${defaultConfig}...`);
    config = require(defaultConfig);
    try {
        if(rs.statSync(overrideConfig).isFile()){
            console.log(`Load ${overrideConfig}...`);
            config = Object.assign(config,requrie(overrideConfig));
        }
    } catch (error) {
        console.log(`Connot load ${overrideConfig}...`);
    }
}
module.exports = config;