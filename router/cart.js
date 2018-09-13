const Router=require('express').Router;
const router=Router();
const UserModel = require('../models/userModle.js');
const ProductModel = require('../models/product.js');
const hmac = require('../util/hmac.js')


//获取购物车数量
router.get('/getCartCount',(req,res)=>{
	if(req.userInfo._id){
		UserModel.findById(req.userInfo._id)
		.then(user=>{
			if(user.cart){
				let count = 0;
				user.cart.cartList.forEach(item=>{
					count += item.count
				})
				res.json({
					code:0,
					data:count
				})
			}else{
				res.json({
					code:0,
					data:0
				})
			}
			
		})
		.catch(e=>{
			res.json({
				code:1,
				message:'后台:错误'
			})
		})
	}else{
		res.json({
			code:1,
			message:'请登录'
		})
	}
	
})


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
	// console.log(body)
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		// console.log(user.cart)
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			// console.log(cartItem)
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
				// console.log(cart)
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


//选中购物车中全部商品
router.put("/selectAll",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			user.cart.cartList.forEach(item=>{
				item.checked=true;
			})
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

//取消购物车中全部商品
router.put("/unselectAll",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			user.cart.cartList.forEach(item=>{
				item.checked=false;
			})
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

//删除一条购物车信息 
router.put("/deleteOne",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let newCartList = user.cart.cartList.filter(item=>{
				return item.product != req.body.productId
			})
			user.cart.cartList = newCartList;
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

//删除所有选中的购物车信息 
router.put("/deleteSelected",(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let newCartList = user.cart.cartList.filter(item=>{
				return item.checked == false;
			})
			user.cart.cartList = newCartList;
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

//修改数量
router.put("/updateCount",(req,res)=>{
	let body = req.body;
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		//已有购物车
		if(user.cart){
			let cartItem = user.cart.cartList.find((item)=>{
				return item.product == body.productId
			})
			if(cartItem){
				cartItem.count = body.count;
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






