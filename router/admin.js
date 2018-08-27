const Router = require('express').Router;

const UserModel = require('../models/userModle.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const hmac = require('../util/hmac.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = Router();

/*
router.get("/init",(req,res)=>{
	//插入数据到数据库
	new UserModel({
		username:'admin',
		password:hmac('admin'),
		isAdmin:true
	})
	.save((err,newUser)=>{
		if(!err){//插入成功
			res.send('ok')
		}else{
			res.send('err')				
		}
	})
});
*/



//用户登录
router.post("/login",(req,res)=>{
	let body = req.body;
	//定义返回数据
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	UserModel
	.findOne({username:body.username,password:hmac(body.password),isAdmin:true})
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


//权限控制
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send({
			code:10,
		});
	}
})

router.get('/count',(req,res)=>{
	res.json({
		code:0,
		data:{
			usernum:111,
			ordernum:222,
			productnum:333
		}

	})
})

//获取用户数据
router.get('/users',(req,res)=>{
	let options = {
		page: req.query.page,
		model: UserModel,
		query :{},
		show: '-password -__v -updateAt',
		sort: {_id:1}
	}
	pagination(options)
	.then((data)=>{
		res.json({
			code:0,
			data:{
				users:data.users,
				current:data.current,
				total:data.total,
				pageSize:data.pageSize,
				list:data.list
			}
		});	
	})
})





module.exports = router;