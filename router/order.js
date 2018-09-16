const Router=require('express').Router;
const router=Router();
const UserModel = require('../models/userModle.js');
const OrderModel = require('../models/order.js');

//权限控制
// router.use((req,res,next)=>{
// 	if(req.userInfo.isAdmin){
// 		next()
// 	}else{
// 		res.send({
// 			code:10,
// 		});
// 	}
// })


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

//获取订单信息
router.get('/list',(req,res)=>{
	let page = req.query.page;
	let query = {
		user:req.userInfo._id
	}
	OrderModel.getPaginationOders(page,query)
	.then((result)=>{
		res.json({
			code:0,
			data:{
				current:result.current,
				total:result.total,
				list:result.list,
				pageSize:result.pageSize
			}
		})
	})
	.catch((e)=>{
		res.json({
			code:1,
			message:'获取订单列表失败'
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
					filePath:item.product.filePath,
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
				//删除购物车中已经提交订单的商品
				UserModel.findById(req.userInfo._id)
				.then(user=>{
					let newCartList = user.cart.cartList.filter(item=>{
						return item.checked == false;
					})
					user.cart.cartList = newCartList;
					user.save()
					.then(newUser=>{
						res.json({
							code:0,
							data:newOrder
						})
					})
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

 //获取购物订单
 router.get('/getlist',(req,res)=>{
 	let page = req.query.page;
 	let query = {
 		user:req.userInfo._id
 	}

 	OrderModel
 	.getPaginationProduct(page,query)
	.then(data=>{
		
		res.json({
			code :0,
			
			data:{
				list:data.list,
				current:data.current,
				total:data.total,
				pageSize:data.pageSize,
				status:data.status
			}
		})
	})
 });

 //获取订单详情页
 router.get('/detail',(req,res)=>{
 
 	OrderModel
 	.findOne({orderNo:req.query.orderNo,user:req.userInfo._id})
	.then(data=>{
		res.json({
			code :0,
			
			data:data
		})
	})
 });
 //取消订单
 router.put('/cancel',(req,res)=>{
 		OrderModel
 		.findOneAndUpdate(
 			{orderNo:req.body.orderNo,user:req.userInfo._id},
 			{status:"20",statusDesc:"取消"},
 			{new :true}
 			)
		.then(data=>{
		
			res.json({
				code :0,
				
				data:data
			})
		})
		.catch(e=>{
			res.json({
				code :0,
				
				message:"取消订单失败"
			})
		})
	})



module.exports = router;






