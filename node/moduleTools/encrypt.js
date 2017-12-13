//加密算法
"use strict";
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

// Hmac算法加密
function hmacSha1(content){
    var token1='miyue';//加密的密钥；
    var buf = crypto.randomBytes(16);
    token1 = buf.toString('hex');//密钥加密；
    console.log("生成的token(用于加密的密钥):"+token1);
    var SecrectKey=token1;//秘钥；
    var Signture = crypto.createHmac('sha1', SecrectKey);//定义加密方式
    Signture.update(content);
    var miwen=Signture.digest().toString('base64');//生成的密文后将再次作为明文再通过pbkdf2算法迭代加密；
    console.log("加密的结果f："+miwen);
    return miwen;
}
// 添加固定加密盐
function cryptPwd(password,salt) {
    var salt = salt||"";
    // 密码“加盐”
    var saltPassword = password + ':' + salt;
    console.log('原始密码：%s', password);
    console.log('加盐后的密码：%s', saltPassword);
    // 加盐密码的md5值
    var md5 = crypto.createHash('md5');
    var result = md5.update(saltPassword).digest('hex');
    console.log('加盐密码的md5值：%s', result);
    return result;
}
function getRandomSalt(){
    return Math.random().toString().slice(2, 5);
}

module.exports = {
    getPassword: function(password){
        return cryptPwd(password,"lhs");
    },
    getToken: function(token){
        return cryptPwd(token,getRandomSalt());
    }
}