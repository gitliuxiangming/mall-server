
const Router = require('express').Router;
const path = require('path');
const fs = require('fs');
const multer = require('multer');

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
	res.send('http://127.0.0.1:3000/public/product-image/'+req.file.filename)
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
router.post("/uploaDetaildImage",upload.single('file'),(req,res)=>{
	res.send('http://127.0.0.1:3000/public/product-image/'+req.file.filename)
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









module.exports = router;