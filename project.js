var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var projectSchema =new Schema({
	

	name:{
		type:String,
		unique:true
	},
	
	technology:{
		
		type:Array	
	},
	
	start_date:
	{type:Date
	
	},
	
	deadline: {
		type:Date
		
		
	},
	
	status:
	{type:String
		
	}
	
});
	module.exports= mongoose.model('Project',projectSchema);
		