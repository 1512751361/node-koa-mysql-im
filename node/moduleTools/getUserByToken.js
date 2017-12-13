const model = require("../bin/model");
const APIError = require("../bin/rest").APIError;

//用户表
let User = model.User,
    UserLoginInfo = model.UserLoginInfo;
// 根据Token获取用户
module.exports = async(token)=>{
    if(!token||!token.trim()){
        throw new APIError("invalid_token","Token can't be empty!");
    }
    var uli = await UserLoginInfo.findOne({
        where: {
            AccessToken: token
        }
    });
    if(!uli){
        throw new APIError("invalid_token","Token does not exist!");
    }
    var user = await User.findOne({
        where: {
            Id: uli.U_Id
        }
    });
    if(!user){
        throw new APIError("invalid_user","User does not exist!");
    }
    return {
        user: user,
        uli: uli
    }
}