
const Router = require('express').Router;
const CategoryModel = require('../models/categoryModel.js');
const pagination = require('../util/pagination.js');

const router = Router();

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

//处理添加请求
router.post("/",(req,res)=>{
	let body = req.body;
	CategoryModel
	.findOne({name:body.name,pid:body.pid})
	.then((cate)=>{
		if(cate){
	 		res.json({
	 			code:1,
	 			message:"添加分类失败,分类已存在"
	 		})
		}else{
			new CategoryModel({
				name:body.name,
				pid:body.pid
			})
			.save()
			.then((newCate)=>{
				if(newCate){
					if(body.pid == 0){
						CategoryModel.find({pid:0},"_id name pid order")
						.then((categories)=>{
							res.json({
								code:0,
								data:categories
							})
						})
					}else{
						res.json({
							code:0
						})
					}
				}
			})
			.catch((e)=>{
		 		res.json({
		 			code:1,
		 			message:"添加分类失败,服务器端错误"
		 		})
			})
		}
	})
})
//获取分类
router.get("/",(req,res)=>{

	let pid = req.query.pid;
	let page = req.query.page;
	if(page){
		CategoryModel
		.getPaginationCategories(page,{pid:pid},'id name order pid')
		.then((data)=>{
			res.json({
				code:0,
				data:{
					current:data.current,
					total:data.total,
					pageSize:data.pageSize,
					list:data.list
				}
			});	
		})
	}else{
		CategoryModel.find({pid:pid})
		.then((categories)=>{
			res.json({
				code:0,
				data:categories
			})
		})
		.catch((e)=>{
			res.json({
				code:1,
				message:'服务器离家出走了'
			})
		})
	}
	
})

//得到input框的value值并更新
router.put("/updateName",(req,res)=>{	
	let body=req.body
	CategoryModel.findOne({name:body.name,pid:body.pid})
	.then((categories)=>{
		if(categories){
			res.json({
				code:1,
				message:'重名'
			})
		}else{
			CategoryModel.update({_id:body.id},{name:body.name})
			.then((result)=>{
				if(result){
					CategoryModel
					.getPaginationCategories(body.page,{pid:body.pid},'id name order pid')
					.then((data)=>{
						res.json({
							code:0,
							data:{
								current:data.current,
								total:data.total,
								pageSize:data.pageSize,
								list:data.list
							}
						});	
					})
				}
			})
			.catch((e)=>{
				res.json({
					code:1,
					message:'更新数据库出错'
				})
			})
		}
	})
	.catch((e)=>{
		res.json({
			code:1,
			message:'数据库中没找到'
		})
	})	
})

//得到order值并更新
router.put("/updateOrder",(req,res)=>{	
	let body=req.body
	CategoryModel.update({_id:body.id},{order:body.order})
	.then((result)=>{
		if(result){
			CategoryModel
			.getPaginationCategories(body.page,{pid:body.pid},'id name order pid')
			.then((data)=>{
				res.json({
					code:0,
					data:{
						current:data.current,
						total:data.total,
						pageSize:data.pageSize,
						list:data.list
					}
				});	
			})
		}
	})
	.catch((e)=>{
		res.json({
			code:1,
			message:'更新数据库出错'
		})
	})
})







module.exports = router;