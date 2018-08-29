
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

//得到input框的value值
router.get("/getvalue",(req,res)=>{
	// console.log(req.query)
	let updateId = req.query.updateId;
	let updateName = req.query.updateName;
	
	CategoryModel.update({_id:updateId},{name:'一级分类6'})
	.then(()=>{
		CategoryModel.findOne({_id:updateId})
		.then((categories)=>{
			res.json({
				code:0,
				data:categories
			})
		})
		.catch((e)=>{
			res.json({
				code:1,
				message:'在数据库中没找到'
			})
		})
	})
	.catch((e)=>{
			res.json({
				code:1,
				message:'服务器离家出走了'
			})
		})
	
})









module.exports = router;