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

router.post('/',(req,res)=>{
	let body = req.body;
	// console.log(body)
	UserModel.findOne({_id:req.userInfo._id})
	.then((user)=>{
		// console.log(user);
		if (user.cart) {
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId;
			})
			if (cartItem) {
				cartItem.count = cartItem.count + parseInt(body.count)
			} else {
				user.cart.cartList.push({
					product:body.productId,
					count:body.count
				})
			}
		} else {
			user.cart = {
				cartList:[{
					product:body.productId,
					count:body.count
				}]
			}
		}
		user.save()
		.then(newUser=>{
			res.json({
				code:0,
				massage:'添加购物车成功'
			})
		})
		.catch(e=>{
			res.json({
				code:1,
				massage:'添加购物车失败'
			});
		})
	})
})

//获取购物车信息
router.get('/',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		user.getCart()
		.then(cart=>{
			res.json({
				code:0,
				data:cart
			})
		})
		
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'后台:错误'
		})
	})
})

//选中购物车中一项
router.put("/selectOne",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.checked = true
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});

//取消购物车中一项
router.put("/unselectOne",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.checked = false
			}else{
				res.json({
					code:1,
					message:'购物车记录不存在'
				})			
			}

		}
		//没有购物车
		else{
			res.json({
				code:1,
				message:'还没有购物车'
			})
		}
		user.save()
		.then(newUser=>{
			user.getCart()
			.then(cart=>{
				res.json({
					code:0,
					data:cart
				})			
			})
		})
	})
});


module.exports = router;






