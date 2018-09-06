const Router=require('express').Router;
const router=Router();
const UserModel = require('../models/userModle.js');
const hmac = require('../util/hmac.js')


//权限控制
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.send({
			code:10,
		});
	}
})


router.get('/logout',(req,res)=>{
	let result = {
		code:0,
		massage:''
	}
	req.session.destroy();
	res.json(result);
})


router.post("/login",(req,res)=>{
	let body = req.body;
	//定义返回数据
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	UserModel
	.findOne({username:body.username,password:hmac(body.password),isAdmin:false})
	.then((user)=>{
		if(user){//登录成功
			 req.session.userInfo = {
			 	_id:user._id,
			 	username:user.username,
			 	isAdmin:user.isAdmin,
			 }
			 result.data = {
			 	username:user.username
			 }
			 res.json(result);
		}else{
			result.code = 1;
			result.message = '用户名和密码错误';
			res.json(result);
		}
	})
})

/*
router.get("/init",(req,res)=>{
	//定义返回数据
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
		let data=[];
		for(let i=0 ;i<100;i++){
			data.push({
			  key:i,
			  username: 'text'+i,
			  isAdmin: false,
			  phone:'135'+i,
			  email:'text'+i+'@qq.com'
			})
		}
	UserModel.create(data)
		.then((err,newUser)=>{
			res.send('ok')
		})


})
*/

module.exports = router;







