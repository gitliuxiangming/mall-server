const mongoose = require('mongoose');

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
let categoryModel = mongoose.model('Category',CategorySchema);
module.exports=categoryModel;