var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var TechnologySchema =new Schema({
	

	name:{
		type:String,
		unique:true
	},
	
	implementation:{
		
		type:String	
	},
	
	
	
});
	module.exports= mongoose.model('Technology',TechnologySchema);
		