const model = require("./bin/model");
//model.sync();
let
    User = model.User;
console.log("test");
(async()=>{
    var user = await User.create({
        account: "lhs",
        username: "火六",
        password: "123456",
        avatar: "http://tp2.sinaimg.cn/2211874245/180/40050524279/0"
    });
    console.log("created:"+JSON.stringify(user));
})();
(async()=>{
    var user = await User.findAll();
    console.log(JSON.stringify(user));
})();