const mongoose = require('mongoose');
const pagination = require('../util/pagination.js');
const ProductSchema = new mongoose.Schema({
  		name:{
        type:String
      },
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
      },
      description:{
        type:String
      },
      filePath:{
        type:String
      },
      
      price:{
        type:Number
      },
      stoke:{
        type:Number
      },
      value:{
        type:String
      },
      order:{
        type:Number,
        default:0
      },
      status:{
        type:String,
        default:0//0代表在售，1代表下架
      }
	},{timestamps:true});

ProductSchema.statics.getPaginationCategories = function(page,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: page,//需要显示的页码
        model:this, //操作的数据模型
        query:query, //查询条件
        projection:'name _id price status order', //投影，
        sort:{order:-1}, //排序
        // populate:[{path:'category',select:'_id pid'}]
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }
let productModel = mongoose.model('Product',ProductSchema);
module.exports=productModel;