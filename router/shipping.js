const Router=require('express').Router;
const router=Router();
const UserModel = require('../models/userModle.js');
const ProductModel = require('../models/product.js');
const hmac = require('../util/hmac.js')

//普通用户登录权限控制
router.use((req,res,next)=>{
	if(req.userInfo._id){
		next()
	}else{
		res.send({
			code:10,
		});
	}
})


//添加地址
router.post('/',(req,res)=>{
	// res.send("add ok");
	let body = req.body;
	UserModel
	.findById(req.userInfo._id)
	.then((user)=>{ 
		if (user.shipping) {
			user.shipping.push(body)
		} else {
			user.shipping = [body]
		}
		user.save()
		.then(newUser=>{
			res.json({
				code:0,
				data:user.shipping
			})
		})
		.catch((err)=>{//新增失败,渲染错误页面
	 		res.json({
				code:1,
				message:err
			})
		})
	})
	.catch((err)=>{//新增失败,渲染错误页面
 		res.json({
			code:1,
			message:'新增地址失败,数据库操作失败'
		})
	})
});

//获取登录用户的地址列表
router.get('/list',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then((user)=>{
		res.json({
			code:0,
			data:user.shipping
		})
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'获取用户地址列表失败'
		})
	})
})

//删除地址
router.put('/delete',(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then((user)=>{
		user.shipping.id(body.shippingId).remove();
		user.save()
		.then(data=>{
			res.json({
				code:0,
				data:user.shipping
			})
		})
	})
})

//编辑地址
router.get('/',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then((user)=>{
		res.json({
			code:0,
			data:user.shipping.id(req.query.shippingId)
		})
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'获取用户地址列表失败'
		})
	})
})

//编辑后的后台更改
router.put('/',(req,res)=>{
	// res.send("add ok");
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then((user)=>{ 
		let shipping = user.shipping.id(body.shippingId)
		shipping.name = body.name;
		shipping.province = body.province;
		shipping.city = body.city;
		shipping.address = body.address;
		shipping.phone = body.phone;
		shipping.zip = body.zip;

		user.save()
		.then(newUser=>{
			res.json({
				code:0,
				data:user.shipping
			})
		})
	})
	.catch((err)=>{//新增失败,渲染错误页面
 		res.json({
			code:1,
			message:'新增地址失败,数据库操作失败'
		})
	})
});



module.exports = router;






