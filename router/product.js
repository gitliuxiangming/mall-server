
const Router = require('express').Router;
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ProductModel = require('../models/product.js')



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/product-image/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })


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
router.post("/uploadImage",upload.single('file'),(req,res)=>{
	const filepath='http://127.0.0.1:3000/product-image/'+req.file.filename;
	res.send(filepath)
	/*
	new ResourceModel({
		name:req.body.name,
		path:'/product-image/'+req.file.filename
	})
	.save()
	.then(resource=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'添加资源成功',
			url:'/resource'
		})			
	})
	*/

})
//富文本编辑器中的图片上传地址
router.post("/uploadDetailImage",upload.single('upload'),(req,res)=>{
	const filepath='http://127.0.0.1:3000/product-image/'+req.file.filename;
	res.json({
		"success": true,
 		"msg": "上传成功", 
 		"file_path": filepath
	})
	/*
	new ResourceModel({
		name:req.body.name,
		path:'/product-image/'+req.file.filename
	})
	.save()
	.then(resource=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'添加资源成功',
			url:'/resource'
		})			
	})
	*/

})


//处理添加请求
/*
router.post("/",(req,res)=>{
	let body = req.body;
	ProductModel
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
*/







module.exports = router;