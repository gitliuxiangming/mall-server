const Router=require('express').Router;
const router=Router();
const UserModel = require('../models/userModle.js');
const OrderModel = require('../models/order.js');


//获取生成订单的商品列表
router.get('/getOrderProductList',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		user.getOrderProductList()
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
			message:'后台:生成订单错误'
		})
	})
	
})

//创建订单
router.post('/',(req,res)=>{
	UserModel.findById(req.userInfo._id)
	.then(user=>{
		let order = {};
		user.getOrderProductList()
		.then(result=>{
			order.payment = result.totalCartPrice;
			//构建订单的商品
			let productList = [];
			result.cartList.forEach(item=>{
				productList.push({
					productId:item.product._id,
					count:item.count,
					totalPrice:item.totalPrice,
					price:item.product.price,
					filepath:item.product.filepath,
					name:item.product.name
				})
			})
			order.productList = productList;

			//构建订单的的地址信息
			let shipping = user.shipping.id(req.body.shippingId)
			order.shipping = {
				shippingId:shipping._id,
				name:shipping.name,
				province:shipping.province,
				city:shipping.city,
				address:shipping.address,
				phone:shipping.phone,
				zip:shipping.zip
			}

			//构建订单号
			order.orderNo =Date.now().toString() + parseInt(Math.random()*10000)
			
			//赋值用户ID
			order.user = user._id

			new OrderModel(order)
			.save()
			.then((newOrder)=>{	
				res.json({
					code:0,
					data:newOrder
				})
			})
		})
		
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'后台:生成订单错误'
		})
	})
})




module.exports = router;






