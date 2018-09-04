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

module.exports = router;







