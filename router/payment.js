 const Router = require('express').Router;


const UserModel = require('../models/userModle.js');

const OrderModel = require('../models/order.js');


 const router = new Router();


 router.get('/pay',(req,res)=>{
 	
 		res.json({
 			code:0,
 			data:{
 				orderNo:req.query.orderNo,
 				qurl:"http://127.0.0.1:3000/product-image/1536547967373.png"
 			}
 			
 		})

 	
 });
 router.get('/status',(req,res)=>{
 	OrderModel
 		.findOne({orderNo:req.query.orderNo,},'status')
 		.then(order=>{
 			res.json({
 				code:0,
 				data:order.status == 30
 			})
 		})
 })
 
 
 
 module.exports = router;