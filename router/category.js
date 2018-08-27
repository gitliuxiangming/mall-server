
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
	 			code:11,
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
					res.json({
						code:0,
					})
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









module.exports = router;