"use strict";
//数据库模块
const model = require("../bin/model");
const fs = require("fs");
const path = require("path");

const APIError = require("../bin/rest").APIError;
const getUserByToken = require("../moduleTools/getUserByToken");
const sequelize = model.sequelize;

//用户表
let User = model.User,
    UserLoginInfo = model.UserLoginInfo;

//使用时第二个参数可以忽略  
function mkdir(dirpath, dirname) {
    //判断是否是第一次调用  
    if (typeof dirname === "undefined") {
        if (fs.existsSync(dirpath)) {
            return;
        } else {
            mkdir(dirpath, path.dirname(dirpath));
        }
    } else {
        //判断第二个参数是否正常，避免调用时传入错误参数  
        if (dirname !== path.dirname(dirpath)) {
            mkdir(dirpath);
            return;
        }
        if (fs.existsSync(dirname)) {
            console.log(dirname);
            fs.mkdirSync(dirpath)
        } else {
            mkdir(dirname, path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}
const Busboy = require('busboy');
// 写入目录
const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname)
            return true
        }
    }
    return false
}
// 上传到本地服务器
function uploadFile(ctx, options) {
    const _emmiter = new Busboy({ headers: ctx.req.headers })
    const fileType = options.fileType
    const filePath = path.join(options.path, fileType)
    const confirm = mkdirsSync(filePath)
    if (!confirm) {
        return
    }
    console.log('start uploading...')
    return new Promise((resolve, reject) => {
        _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const fileName = Rename(filename)
            const saveTo = path.join(path.join(filePath, fileName))
            file.pipe(fs.createWriteStream(saveTo))
            file.on('end', function () {
                resolve({
                    imgPath: `/${fileType}/${fileName}`,
                    imgKey: fileName
                })
            })
        })

        _emmiter.on('finish', function () {
            console.log('finished...')
        })

        _emmiter.on('error', function (err) {
            console.log('err...')
            reject(err)
        });
        ctx.req.pipe(_emmiter);
    })
}

module.exports = {
    "POST /api/upload/uploadFiles": async (ctx, next) => {
        console.log(ctx.request);
        console.log(ctx.request.file);
        uploadFile(ctx, {
            fileType: 'album',
            path: 'upload'
        });
        try {
            var
                t = ctx.request.body,
                user, userLI;
            console.log(t);
            user = await getUserByToken(t.Token || "");
            if (!user) {
                throw new APIError("100", "token error");
            }
            var serverUrl = (ctx.request.header.origin || ('http://' + ctx.request.header.host)) + '/';
            if (t.Type == 'image') {//图片
                //接收前台POST过来的base64
                var imgData = t.Base64;
                //过滤data:URL
                var base64Data = imgData.replace(/data:image\/\w+;base64,/g, "");
                var arr = base64Data.split(';');
                var date = new Date();
                var saveFilePath = "upload/IM/images/" + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
                var saveUrl = saveFilePath + '/' + 'IM_images_' + date.getTime() + parseInt((Math.random() * 10000)) + '_';
                console.log(saveUrl);
                await mkdir(saveFilePath);
                var path = [];
                for (var i = 0; i < arr.length; i++) {
                    var dataBuffer = new Buffer(arr[i], 'base64');
                    await new Promise((resolve, reject) => {
                        fs.writeFile(saveUrl + i, dataBuffer, function (err, data) {
                            if (err) {
                                console.log(err);
                                reject(err);
                                throw new APIError('invalid_writeFile', 'writeFile error');
                            } else {
                                console.log(serverUrl + data);
                                path.push(serverUrl + saveUrl + i);
                                resolve(serverUrl + data);
                            }
                        });
                    });
                }
                console.log(path);
                ctx.rest({
                    status: 0,
                    message: "",
                    data: path
                })
            } else if (t.Type == 'sound') {//语言

            } else if (t.Type == 'file') {//文件

            } else {
                throw new APIError('invalid_type', 'upload type error');
            }
        } catch (error) {
            throw new APIError(error.code || "invalid_requestParams", error.message || "")
        }
    }
}