
const Router = require('express').Router;
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ProductModel = require('../models/product.js');




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

router.get('/home/list',(req,res)=>{
	let page = req.query.page;
	let query={status:0};
	if(req.query.categoryId){
		query.category = req.query.categoryId;
	}else{
		query.name = {$regex:new RegExp(req.query.keyword,'i')}
	}

	let projection='';
	let sort={order:-1};
	if(req.query.orderBy == 'price_asc'){
		sort = {price:-1}
	}
	else if(req.query.orderBy == 'price_desc'){
		sort = {price:1}
	}

	ProductModel.getPaginationProducts(page,query,projection,sort)
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
			message:'服务器获取数据失败'
		})
	})
})
//获取商品详细信息
router.get('/home/detail',(req,res)=>{
	ProductModel
	.findOne({status:0,_id:req.query.productId},"-__v -createdAt -updateAt -category")
	.then((product)=>{
		res.json({
			code:0,
			data:product
		})
	})
	.catch((e)=>{
		console.log(e)
		res.json({
			code:1,
			message:'后台：服务器错误'
		})
	})

})

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
		.getPaginationProducts(page,{})
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
			.getPaginationProducts(body.page,{})
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
			.getPaginationProducts(body.page,{})
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

router.put("/",(req,res)=>{
	let body = req.body;
	let update={
		name:body.name,
		category:body.category,
		description:body.description,
		filePath:body.filePath,
		value:body.value,
		price:body.price,
		stoke:body.stoke,
	}
	ProductModel.update({_id:body.id},update)
	.then((newCate)=>{
		if(newCate){
			res.json({
				code:0,
				message:'编辑商品成功'
			})
		}
	})
	.catch((e)=>{
 		res.json({
 			code:1,
 			message:"后台：更新分类失败"
 		})
	})
})


router.get('/search',(req,res)=>{
	let page = req.query.page || 1;
	let keyword = req.query.keyword;
	ProductModel
	.getPaginationProducts(page,{name:{$regex:new RegExp(keyword,'i')}})
	.then((result)=>{
		// console.log(result)
		res.json({ 
			code:0,
			data:{
				current:result.current,
				total:result.total,
				list:result.list,
				pageSize:result.pageSize,
				keyword:keyword
			}
		});	 
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'查找分类失败,数据库操作失败'
		})
	});
})


module.exports = router;