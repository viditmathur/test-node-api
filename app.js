var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var Employee=require('./employee');
var Project=require('./project');
var Technology=require('./technology');
const checkAuth = require('./middleware/check-auth');
const paginate = require('express-paginate');




var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");


//cors issue
var cors = require('cors');

app.use(cors());

var mongoose=require('mongoose');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true

}));
var db='mongodb://Srishty_Rawat:srishty@hrms-shard-00-00-tgxfc.mongodb.net:27017,hrms-shard-00-01-tgxfc.mongodb.net:27017,hrms-shard-00-02-tgxfc.mongodb.net:27017/test?ssl=true&replicaSet=HRMS-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(db);

var port=8080;
app.listen(port,function()
           {
    console.log('server has been started');	
}
          )

app.get("/",(req,res,next)=>{
    console.log("welcome");
    res.send("this is just to check whether the services are working or not");

});

app.get('/count',(req,res,next)=>{
    Employee.find({})
        .count()
        .then(count=>{
        var pages=Math.ceil(count/req.headers.limit);
        res.status(201).json(pages)
    });
});

app.get('/count2',(req,res,next)=>{
    Project.find({})
        .count()
        .then(count=>{
        var pages=Math.ceil(count/req.headers.limit);
        res.status(201).json(pages)
    });
});

app.get('/Employee', (req,res,next)=>{
    var pagenum = parseInt(req.headers.pagenumber);
    var limit= parseInt(req.headers.limit);
    var skipValue = (pagenum-1)*limit;
    console.log(skipValue,limit);
    Employee.find({})
        .limit(limit)
        .skip(skipValue)
        .exec(function(err, employee){
        if(err){
            res.status(500).send("Error occured");
        }
        else{
            res.status(201).json(employee);
        }
    });
});


app.get('/Employee/:id', checkAuth, (req,res,next)=>
        {
    console.log('getting a specific employee');
    Employee.findOne({_id:req.params.id})
        .select('_id email skills userImage')
        .exec(function(err,employee){

        if(err){
            res.send("error occured");
        }
        else{
            console.log(employee);
            res.json(employee);
        }

    });

});

app.put('/Employee/:id', checkAuth, (req,res,next)=>{

    Employee.findOneAndUpdate({_id:req.params.id},{$set:{skills:req.body.skills}},{upsert:true},
                              function(err,newemployee)
                              {if(err)
                              {
                                  console.log("error occured");
                              }
                               else{
                                   console.log(newemployee);
                                   res.status(204);

                               }		

                              });


});

app.delete('/Employee/:id', checkAuth, (req,res,next)=>
           {
    Employee.deleteOne({_id:req.params.id},function(err,employee)
                       {
        if(err)
        {console.log("no data found");

        }
        else
        {res.send(employee)}

    });
});

app.get('/project', checkAuth, (req,res,next)=>{
    //    console.log('getting all projects');
    //    Project.find({})
    //        .exec(function(err,project){
    //
    //        if(err)
    //        {
    //            res.send("error occured");}
    //
    //        else
    //        {console.log(project);
    //         res.json(project);
    //        }
    //
    //    });
    var pagenum = parseInt(req.headers.pagenumber);
    var limit= parseInt(req.headers.limit);
    var skipValue = (pagenum-1)*limit;
    console.log(skipValue,limit);
    Project.find({})
        .limit(limit)
        .skip(skipValue)
        .exec(function(err, project){
        if(err){
            res.status(500).send("Error occured");
        }
        else{
            res.status(201).json(project);
        }
    });

});



app.get('/Project/:id', checkAuth, (req,res,next)=>
        {
    console.log('getting a specific project');
    Project.findOne({_id:req.params.id})
        .exec(function(err,project){

        if(err)
        {
            res.send("error occured");}

        else
        {console.log(project);
         res.json(project);
        }

    });

});
app.post('/Project', checkAuth, (req,res,next)=>
         {
    var newproject=new Project();
    newproject.name=req.body.name;
    newproject.technology=req.body.technology;
    newproject.status=req.body.status;
    newproject.start_date=req.body.start_date;
    newproject.deadline=req.body.deadline;

    newproject.save(function(err,project)

                    { if(err)
                    {
                        res.send('error saving project');

                    }
                     else{

                         console.log(project);
                         res.send('project added');
                     }			

                    });



});



app.delete('/Project/:id', checkAuth, (req,res,next)=>
           {
    Project.deleteOne({_id:req.params.id},function(err,project)
                      {
        if(err)
        {console.log("no data found");

        }
        else
        {res.send(project)}

    });






});


app.get('/Technology', checkAuth, (req,res,next)=>
        {
    console.log('getting all technology');
    Technology.find({})
        .exec(function(err,technology){

        if(err){
            res.send("error occured");
        }

        else{
            console.log(technology);
            res.json(technology);
        }

    });

});


app.post('/Technology', checkAuth, (req,res,next)=>
         {
    var newTechnology=new Technology();
    newTechnology.name=req.body.name;
    newTechnology.implementation=req.body.implementation;


    newTechnology.save(function(err,technology)



                       { if(err)
                       {
                           res.send('error saving technology');

                       }
                        else{

                            console.log(technology);
                            res.send('technology added');


                        }
                       });



});
app.get('/Technology', checkAuth, (req,res,next)=>
        {
    console.log('getting all technology');
    Technology.find({})
        .exec(function(err,technology){

        if(err)
        {
            res.send("error occured");}

        else
        {console.log(technology);
         res.json(technology);
        }

    });

});

//routes for signup and login

app.post("/Employee", (req, res, next) => {

    Employee.find({ email: req.body.email })

        .exec()

        .then(user => {

        if (user.length >= 1) {

            return res.status(409).json({

                message: "Mail exists"

            });

        } 

        else {

            bcrypt.hash(req.body.password, 10, (err, hash) => {

                if (err) {

                    return res.status(500).json({

                        error: err

                    });

                } else {

                    const user = new Employee({

                        email: req.body.email,

                        password: hash,

                        admin: req.body.admin

                    });

                    user

                        .save()

                        .then(result => {

                        console.log(result);

                        res.status(201).json({

                            message: "User created"

                        });

                    })

                        .catch(err => {

                        console.log(err);

                        res.status(500).json({

                            error: err

                        });

                    });

                }

            });

        }

    });

});



app.post("/login", (req, res, next) => {

    Employee.find({ email: req.body.email })

        .exec()

        .then(user => {

        if (user.length < 1) {

            return res.status(401).json({

                message: "Auth failed"

            });

        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {

            if (err) {

                return res.status(401).json({

                    message: "Auth failed"

                });

            }

            if (result) {

                const token = jwt.sign({
                    email: user[0].email
                },
                                       process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: "Auth successful",
                    token: token,
                    admin: user[0].admin,
                    userId: user[0]._id
                });
            }
            res.status(401).json({
                message: "Auth failed !!!7"
            });
        });
    })

        .catch(err => {

        console.log(err);

        res.status(500).json({

            error: err

        });

    });

});