const mongoose = require('mongoose');
const pagination = require('../util/pagination.js');
const CategorySchema = new mongoose.Schema({
  		name:{
  			type:String,
  		},
  		order:{
        type:Number,
        default:0
    	},
    	pid:{
    		type:String
    	}
	},{timestamps:true});

CategorySchema.statics.getPaginationCategories = function(page,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: page,//需要显示的页码
        model:this, //操作的数据模型
        query:query, //查询条件
        projection:'id name order pid', //投影，
        sort:{_order:-1}, //排序
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }
let categoryModel = mongoose.model('Category',CategorySchema);
module.exports=categoryModel;