const mongoose = require('mongoose');
const pagination = require('../util/pagination.js');
const ProductSchema = new mongoose.Schema({
  		category:{
        type:String
      },
      description:{
        type:String
      },
      filePath:{
        type:String
      },
      name:{
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
      }
	},{timestamps:true});

ProductSchema.statics.getPaginationCategories = function(page,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: page,//需要显示的页码
        model:this, //操作的数据模型
        query:query, //查询条件
        projection:'id name order pid', //投影，
        sort:{order:-1}, //排序
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }
let productModel = mongoose.model('Product',ProductSchema);
module.exports=productModel;