
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

router.post("/",(req,res)=>{
	let body = req.body;
	new ProductModel({
		name:body.name,
		category:body.category,
		description:body.description,
		filePath:body.filePath,
		value:body.value,
		price:body.price,
		stoke:body.stoke,
	})
	.save()
	.then((newCate)=>{
		if(newCate){
			res.json({
				code:0,
				message:'新增商品成功'
			})
		}
	})
	.catch((e)=>{
 		res.json({
 			code:1,
 			message:"后台：添加分类失败"
 		})
	})
})

//获取分类
router.get("/",(req,res)=>{
	let page = req.query.page || 1;
	if(page){
		ProductModel
		.getPaginationCategories(page,{})
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


//得到order值并更新
router.put("/updateOrder",(req,res)=>{	
	let body=req.body
	ProductModel.update({_id:body.id},{order:body.order})
	.then((result)=>{
		if(result){
			ProductModel
			.getPaginationCategories(body.page,{})
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
			message:'后台：更新数据库出错'
		})
	})
})


//status
router.put("/updateStatus",(req,res)=>{	
	let body=req.body
	ProductModel.update({_id:body.id},{status:body.status})
	.then((result)=>{
		if(result){
			res.json({
					code:0,
					message:'跟新成功'
				});	
		}else{
			ProductModel
			.getPaginationCategories(body.page,{})
			.then((data)=>{
				res.json({
					code:1,
					data:{
						current:data.current,
						total:data.total,
						pageSize:data.pageSize,
						list:data.list
					},
					message:'更新失败'
				});	
			})
		}
	})
	.catch((e)=>{
		res.json({
			code:1,
			message:'后台：更新数据库出错'
		})
	})
})

//edit detail
router.get("/detail",(req,res)=>{	
	let id=req.query.id;
	ProductModel.findById(id,"-__v -order -status -createdAt -updatedAt")
	.populate({path:'category',select:'_id pid'})
	.then((product)=>{
		res.json({
			code:0,
			data:product
		});	
	})
	.catch((e)=>{
		res.json({
			code:1,
			message:'后台：更新数据库出错'
		})
	})
})



module.exports = router;