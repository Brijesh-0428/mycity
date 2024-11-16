const nodemailer = require("nodemailer");
var mysql = require("mysql");
var express= require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
const path=require("path");

const multer = require('multer');
const { request, validateHeaderName } = require("http");
const { constants } = require("buffer");
const { error } = require("console");
const storage=multer.diskStorage({
    destination:path.join(__dirname,'./public/'),
    filename: function(req,file,callback){
        callback(null,Date.now()+'_'+ path.extname(file.originalname))
    }
})
var con = mysql.createConnection({

host:"localhost",
user:"root",
password:"",
database:"mycity",

})



var app = express();
app.use("/public", express.static("public"));
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
// const path = require("path");
// const{ error } =require("console");

// const adminCredentials = {
//     username: "admin@gmail.com",
//     password: "admin123",
//   };
//   app.post("/api/adminlogin", (request, response) => {
//     const { username, password } = request.body;
  
//     if (username === adminCredentials.username && password === adminCredentials.password) {
//       request.send({ message: "Login successful" });
//     } else {
//       request.send({ message: "Invalid credentials" });
//     }
//   });
///***********registration**********///
app.post("/api/regisration",(request,response)=>{
var name = request.body.names;
console.log(name)
var mobilenumber = request.body.phone;
console.log(mobilenumber)
var email = request.body.emails;
console.log(email)
var gender = request.body.genders;
console.log(gender)
var address = request.body.address1;
console.log(address)
var birthdate = request.body.born;
console.log(birthdate)
var password = request.body.pass;
console.log(password)

const ins ="insert into tbl_register  (c_name,c_mobile,c_email,c_gender,c_address,c_birthdate,c_password) values (?,?,?,?,?,?,?)";

con.query(ins,[name,mobilenumber,email,gender,address,birthdate,password])
response.send();


})
//**********UPDATE POST**********//
app.post("/api/update_post", (request, response) => {
    console.log("Update");
    let uploads = multer({ storage: storage }).fields([{ name: 'p_img', maxCount: 1 }, { name: 'u_img', maxCount: 1 }]);
    uploads(request, response, function (err) {
        if (err) {
            console.log(err);
            return response.status(500).send("File upload error");
        }

        var p_id = request.body.yyy;
        console.log(p_id);
        var p_name = request.body.names;
        console.log(p_name);
        var p_location = request.body.location;
        console.log(p_location);
        var p_issue = request.body.issues;
        console.log(p_issue);
        var p_category = request.body.category;
        console.log(p_category);

        // Check if p_img is uploaded
        var p_img = request.files['p_img'] ? request.files['p_img'][0].filename : null;
        // Check if u_img is uploaded
        var u_img = request.files['u_img'] ? request.files['u_img'][0].filename : null;

        const upd = "UPDATE tbl_post SET  p_name=?, p_location=?, p_issue=?, p_category=?, p_img=?, u_img=? WHERE p_id=?";
        con.query(upd, [p_name, p_location, p_issue, p_category, p_img, u_img, p_id], function (error, results, fields) {
            if (error) {
                console.log(error);
                return response.status(500).send("Database error");
            }
            console.log("Update successful");
            response.send("");
        });
    });
});



//accept
// app.post("/api/accept",(request,response)=>{
//     console.log("Update")

//     let uploads = multer({ storage:storage}).single('p_img');
//     uploads(request,response,function(err){
//         if(!request.file){
//             console.log("file not found")
//         }else{

//     var p_id = request.body.yyy;
//      console.log(p_id)
//     var p_name= request.body.names;
//     console.log(p_name)
//     var p_location= request.body.location;
//     console.log(p_location)
//     var p_issue= request.body.issues;
//     console.log(p_issue)
//     var p_category= request.body.category;
//     console.log(p_category) 
//     var p_img= request.file.filename;
//      console.log(p_img)

//      const upd ="UPDATE tbl_post SET  p_name=?, p_location=?, p_issue=?, p_category=?, p_img=?  where p_id=?";
//      con.query(upd,[p_name,p_location,p_issue,p_category,p_img,p_id],);
//      response.send("");
   
//         }
//     })   
// })
//update citizen

app.post("/api/update_citizen", (request, response) => {
    console.log("Update")
    var c_id = request.body.cid;
    console.log(c_id)
    var c_name = request.body.cit;
    console.log(c_name)
    var c_mobile = request.body.mo;
    console.log(c_mobile)
    var c_email = request.body.mail;
    console.log(c_email)
    var c_gender = request.body.gen;
    console.log(c_gender)
    
    //const upd = "UPDATE tbl_register SET c_name=?, c_mobile=?, c_email=?, c_gender=? WHERE c_id=?";
    const upd = "UPDATE tbl_register SET c_name = ?, c_mobile = ?, c_email = ?, c_gender =? WHERE c_id = ?";
    con.query(upd, [c_name, c_mobile, c_email, c_gender, c_id],);
        response.send("");
    
});
//update category

app.post("/api/update_category", (request,response)=>{
    console.log("update")
    var pc_ID = request.body.pcid;
    console.log(pc_ID)
    var pc_name = request.body.pc;
    console.log(pc_name)
    var pc_type = request.body.pc_type;
    console.log(pc_type)

    const upd = "UPDATE tbl_pcategory SET pc_name = ?, pc_type = ? WHERE pc_ID = ?";
    con.query(upd, [pc_name, pc_type,pc_ID],);
        response.send("");


})

/////////////////////////


app.get("/api/testlist", (request, response) => {
    var p_id= request.query.p_id;
    console.log(p_id)
    
    const query = "SELECT * FROM tbl_post  where p_id=?";
    con.query(query,[p_id],(err,result)=>{
  
        response.send(result)
    })
    });

app.get("/api/fatch_review",(request, response)=>{
    var p_id = request.query.p_id;
    console.log(p_id)

    const query ="SELECT * from tbl_review JOIN tbl_register ON tbl_review.c_id =tbl_register.c_id WHERE p_id=?";
    con.query(query,[p_id],(err, result)=>{
        console.log(result)
        response.send(result)

    })
})
  
//////////////ADMIN lOGIN////////////////////

app.post("/api/adminlogin",(request,response)=>{

    var a_email = request.body.aemail;
    console.log(a_email)
    var a_password = request.body.apass;
    console.log(a_password)

    const sel ="select * from  tbl_admin where a_email=? and a_password=?";
    con.query(sel,[a_email,a_password],(err, result)=>{
        if(result.length > 0){
            response.send(result);
        }else{
            response.send({message: "wrong ID or Password"});
        }
    });
})


app.post("/api/login",(request,response)=>{
    var email = request.body.useremail;
    console.log(email)
    var password = request.body.pass;
    console.log(password)

    const sel ="select * from   tbl_register where c_email=? and c_password=? ";
    con.query(sel,[email,password],(err, result)=>{

        if(result.length > 0){
            response.send(result);
        }else{
            response.send({message: "wrong ID or Password"});
        }
    });
  
})

app.post("/api/feedback",(request,response)=>{
    var id=request.body.ids;
    console.log(id)
    var f_name = request.body.f_name;
    console.log(f_name)
    var f_type = request.body.f_type;
    console.log(f_type)
    var f_description = request.body.description;
    console.log(f_description)

    

  
const ins ="insert into tbl_feedback  (f_name,f_type,f_description,c_id) values (?,?,?,?)";
con.query(ins,[f_name,f_type,f_description,id])
response.send();
// console.log(result);


})
app.post("/api/Post",(request,response)=>{
     let upload = multer({storage:storage}).single('image');
     upload(request, response,function(err){
        
        if(!request.file){

            console.log("File Not Found")
        }else{
            var p_name = request.body.names;
            console.log(p_name)
            var p_location = request.body.location;
            console.log(p_location)
            var p_issue = request.body.issue;
            console.log(p_issue)
            var p_category = request.body.p_category;
            console.log(p_category)
            // var p_response = request.body.response;
            // console.log(p_response)
            var p_date = request.body.dates;
            console.log(p_date)
            
            var p_img= request.file.filename;
            console.log(p_img)
            
            
            const ins ="insert into tbl_post  (p_name,p_location,p_issue,p_category,p_date,p_img) values (?,?,?,?,?,?)";
            con.query(ins,[p_name,p_location,p_issue,p_category,p_date,p_img])
            response.send();
        }
     })

   
})
app.post("/api/pass",(request,response)=>{
    var id=request.body.aid;
    console.log(id)
    var oldpassword=request.body.oldpassword;
    console.log(oldpassword)
    var newpassword =request.body.newpassword;
    console.log(newpassword)
    

const sel = "select * from tbl_admin WHERE a_id=? and a_password=?";
con.query(sel,[id,oldpassword],(err,result)=>{
    if (result.length > 0){
        console.log(result)
        const upd ="update tbl_admin SET a_password=? WHERE a_id=? and a_password=?"
        con.query(upd,[newpassword,id,oldpassword],(err,result)=>{
            if(result){
                response.send(result);
            }
        })
    }
    else{
        response.send({msg:" Password Doesn't match"});
    }
})
    
   
    //  response.send(result)
    
});

app.post("/api/cpass",(request,response)=>{
    var id=request.body.cid;
    console.log(id)
    var oldpassword=request.body.oldpassword;
    console.log(oldpassword)
    var newpassword =request.body.newpassword;
    console.log(newpassword)


    const sel = "select * from tbl_register WHERE c_id=? and c_password=?";
    con.query(sel,[id,oldpassword],(err,result)=>{
        if(result.length >0){
            console.log(result)
            const upd="update tbl_register SET c_password=? WHERE c_id=? and c_password=?"
            con.query(upd,[newpassword,id,oldpassword],(err,result)=>{
                if(result){
                    response.send(result);
                }
            })
        }
        else{
            response.send({msg:"Password Doesn't match"});
        }
    })
})
//////////////////////////
app.post("/api/review",(request,response)=>{

    var id=request.body.cid;
    console.log(id)
    var p_id=request.body.p_id
    console.log(p_id)
    var addmessage=request.body.addmessage;
    console.log(addmessage)
    // var c_name=request.body.c_name;
    // console.log(c_name)
    

    const ins ="insert into tbl_review(p_id,c_id,r_review)values(?,?,?)";
    con.query(ins,[p_id,id,addmessage])
    response.send();

})


app.post("/api/review_fatch",(request,response)=>{
    var r_id=request.body.r_id;
console.log(r_id)
    const sel ="select * from tbl_review JOIN tbl_register ON tbl_review.c_id = tbl_register.c_id JOIN tbl_post ON tbl_review.p_id = tbl_post.p_id WHERE r_id=?";
    con.query(sel,[r_id],(err,result)=>{
        console.log(result);
        response.send(result)
    })
})

app.post("/api/deletereviews",(request,response)=>{
    console.log("Delete")
    var r_id = request.body.r_id;
    console.log(r_id)
    const query="DELETE from tbl_review WHERE r_id=?";
    con.query(query,[r_id]);
    response.send("");

})
app.get("/api/productcat",(request,response)=>{
 

    const sel = "select * from  tbl_pcategory  ";
    con.query(sel,(err,result)=>{
       
        response.send(result)
    })
})
app.post("/api/read_fatch",(request,response)=>{
    var p_id=request.body.p_id;
    console.log(p_id)
    // var p_issue=request.body.p_issue;
    // console.log(p_issue)
   const sel = "select * from tbl_post WHERE p_id=?";
    con.query(sel,[p_id],(err,result)=>{
        console.log(result)
        response.send(result)
    })})

////////////////////////////**************////////////////





    ////profile fatch//

app.post("/api/profile_fatch",(request,response)=>{
    var a_id=request.body.a_id;
    console.log(a_id);
    const sel ="select * from tbl_admin WHERE a_id=?";
    con.query(query,[a_id],(err,result) =>{
        console.log(result)
        response.send(result)
    })
})

//POST DETAILS FATCH
app.post("/api/detail_fatch",(request,response)=>{
    var p_id=request.body.p_id;
    console.log(p_id)
   const sel = "select * from tbl_post WHERE p_id=?";
    con.query(sel,[p_id],(err,result)=>{
        console.log(result)
        response.send(result)
    })
})
//feedback details fatch//
app.post("/api/feedback_fatch",(request,response)=>{
    var f_id=request.body.f_id;
    
    const sel ="select * from tbl_feedback JOIN tbl_register ON tbl_feedback.c_id = tbl_register.c_id  WHERE f_id=?";
    con.query(sel,[f_id],(err,result)=>{
    
        response.send(result)
    })
})
//CITIZEN DETAILS FATCH
app.post("/api/cit_fatch",(request,response)=>{
    var c_id=request.body.c_id;
    console.log(c_id)
    const sel ="select * from tbl_register WHERE c_id=?";
    con.query(sel,[c_id],(err,result)=>{
        console.log(result)
        response.send(result)
    })
})
//category fatch

app.post("/api/category_fatch",(request,response)=>{
    var pc_ID=request.body.pc_id;
    console.log(pc_ID)
    const sel ="select * from tbl_pcategory WHERE pc_ID=?";
    con.query(sel,[pc_ID],(err,result)=>{
        console.log(result)
        response.send(result)
})
})
// app.get("/api/detail_fatch",(request,response)=>{

//     const sel ="select * from tbl_post";
//     con.query(sel,(err,result)=>{
//         response.send(result)
//     })
// })
    // var  location = request.body.location;
    // console.log(location)
    // var issue = request.body.issue;
    // console.log(issue)
    
    // var date = request.body.date;
    // console.log(date)
    // var image= request.body.image;
    // console.log(image)

//     const ins= "insert into tbl_pcategory(pc_name,pc_type)values(?,?)";
//     con.query(ins,[name,type])
//     response.send();
// })


app.post("/api/Addemergency",(request,response)=>{

    let upload = multer({ storage:storage}).single('image');
    upload(request,response,function(err){
        if(!request.file){

            console.log("File Not Found")

        }else{
            var type = 1;
            var p_name = request.body.names;
            console.log(p_name)
            var p_location = request.body.location;
            console.log(p_location)
            var p_issue = request.body.description;
            console.log(p_issue)
            var p_category= request.body.category;
            console.log(p_category)
            var p_date= request.body.dates;
            console.log(p_date)
            var p_img= request.file.filename;
            console.log(p_img)

            const ins ="insert into tbl_post(p_name,p_location,p_issue,p_category,p_date,p_img,type) values (?,?,?,?,?,?,?)";
            con.query(ins,[p_name,p_location,p_issue,p_category,p_date,p_img,type])
            response.send();
        }
    })
})

app.post("/api/deletecat",(request,response)=> {
    console.log("Delete")
        var p_id = request.body.p_id;
        console.log(p_id)
        const query ="DELETE from tbl_post WHERE p_id=? ";
        con.query(query,[p_id]);
        response.send("");
    });
app.post("/api/deletefeed",(request,response)=>{
    console.log("Delete")
    var f_id = request.body.f_id;
    console.log(f_id)
    const query="DELETE from tbl_feedback WHERE f_id=?";
    con.query(query,[f_id]);
    response.send("");
});
app.post("/api/deletepcat",(request,response)=>{
    console.log("Delete")
    var pc_ID = request.body.pc_id;
    console.log(pc_ID)
    const query="DELETE from tbl_pcategory WHERE pc_ID=?";
    con.query(query,[pc_ID]);
    response.send("");
});
app.post("/api/delteuser",(request,response)=>{
    console.log("Delete")
    var c_id = request.body.c_id;
    const query="DELETE from tbl_register WHERE c_id=?";
    con.query(query,[c_id]);
    response.send("");
});
app.post("/api/category",(request,response)=>{
    var name= request.body.names;
    console.log(name)
    const ins ="insert into tbl_pcategory (pc_name) values (?)";
    con.query(ins,[name])
    response.send();
})
///////////////////////////////////////////////////////////////////
app.post("/api/intsemail",(request,response)=>{
   
    var email=request.body.email;
    console.log(email)
    
// const ins = "insert into tbl_admin (a_email) values (?)";
const sel = "select * from tbl_admin where a_email=?";
con.query(sel,[email],(err,result)=>{
    if(result.length>0){

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user:"mycity01012024@gmail.com",
                pass:"sywnhxhhcezzlmvj"
            }
        });
        var pass=request.body.a_password;
        var name=request.body.a_name;
        if (result.length>0){
            response.send(result)
            var pass=result[0]. a_password;
            var name=result[0]. a_name;
            // console.log(error);
        }
        
            // attachments:{
        //     pass:{a_password}
        // }
       
        // const mailOptions ={
        //     from:"mycity01012024@gmail.com",
        //     to:"rahulvmakwana83@gmail.com",
        //     subject:" WELCOME",
        //     text:"Welcome to My City MY Risposibility..."
        // };

        const mailOptions = {
    from: "mycity01012024@gmail.com",
    to: "rahulvmakwana83@gmail.com",
    subject: "Welcome to My City",
    text: "Hello Mr/Miss " + name + ",\n\nWelcome to My City! We're excited to have you as a member of our community.\n\nYour login details are as follows:\n\n**Username:** " + name + "\n**Password:** " + pass + "\n\nPlease keep your login credentials secure and do not share them with anyone.\n\nIf you have any questions or need assistance, feel free to contact us.\n\nBest regards,\nRahul Makwana"
};

        
        
        transporter.sendMail(mailOptions, function(error,info){
            if (error){
                console.log(error);
        
            }else{
                console.log("Email sent:"+info.response);
            }
        });
    }
    else{
        response.send({msg: "not match email"});
    }
        
})
    
   
    //  response.send(result)
    
});
////////***************************************///////////////// 
// app.get("/api/femail",(request,response)=>{
//     var a_id = request.query.aid
//     console.log(a_id)

//     const ddd = "select * from tbl_admin where a_id=?";

//     con.query(ddd,[a_id],(err,result)=>{
//        console.log(result);
//         response.send(result)
//     })
// })

app.post("/api/insert_email",(request,response)=>{

    var email = request.body.emails;
    console.log(email)
    const sel = "select * from tbl_register where c_email=?";
    con.query(sel,[email],(err,result)=>{
        if(result.length>0){
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth:{
                    user:"mycity01012024@gmail.com",
                    pass:"sywnhxhhcezzlmvj"
                }
            });
            var pass = request.body.c_password;
            var name = request.body.c_name;
            if (result.length>0){
                response.send(result)
                var pass = result[0].c_password;
                var name = result[0].c_name;

            }
            const mailOptions={
                from : "mycity01012024@gmail.com",
                to:"rahulvmakwana83@gmail.com",
                subject: "Welcome to My city",
                text:"Hello Mr/Miss Citizen "+name+ "This is your Password :-"+pass+"" 
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }else{
                    console.log("Email sent:"+info.response);
                }
            });
        }
        else{
            response.send({msg: "Not Match Email"});
        }
    })
});
app.get("/api/manageuser",(request,response)=>{

    const sel = "select * from tbl_register"
    con.query(sel,(err, result)=>{

        response.send(result)
    })
})


// app.get("/api/managefeedback",(request,response)=>{

//     const sel = "select * from tbl_feedback"
//     con.query(sel,(err,result)=>{

//         response.send(result)
//     })
// })

app.get("/api/managereview",(request,response)=>{


    const sel ="select * from tbl_review JOIN tbl_register ON tbl_review.c_id = tbl_register.c_id JOIN tbl_post ON tbl_review.p_id = tbl_post.p_id";
    // const sele = "select * from tbl_review JOIN tbl_post ON tbl_review.p_id = tbl_post.p_id ";
    con.query(sel,(err,result)=>{
        
        response.send(result)
    })
})
app.get("/api/managefeedback",(request,response)=>{
    var f_id=request.body.f_id;
     
    const sel ="select * from tbl_feedback JOIN tbl_register ON tbl_feedback.c_id = tbl_register.c_id";
    con.query(sel,[f_id],(err,result)=>{
  
        response.send(result)
    })
})
app.get("/api/managecategory",(request,response)=>{

    const sel = "select * from tbl_pcategory"
    con.query(sel,(err,result)=>{

        response.send(result)
    })
})
// app.get("/api/emergencylist",(request,response)=>{
 

//     const sel = "select * from  tbl_post where type=1";
//     con.query(sel,(err,result)=>{
       
//         response.send(result)
//     })
// })
app.get("/api/emergencylist",(request,response)=>{

    const sel = "select * from tbl_post where type=0"
    con.query(sel,(err,result)=>{
        response.send(result)
    })
})

/////////////////////////////////////



app.get("/api/pc_fatch",(request,response)=>{
    var pc_ID= request.query.id;
    console.log(pc_ID)
    if(!pc_ID){
        const sel = "select * from tbl_post ";
        con.query(sel,(err,result)=>{
        response.send(result)
        })
    }else{
        console.log("api callls")
        const sele ="select * from tbl_post WHERE p_category=?";
        con.query(sele,[pc_ID],(err,result)=>{
            console.log(result)
            response.send(result)
        })
    }

  
})
///////////////***

// app.get("/api/emergencylist",(request,response)=>{
    
//     var pc_ID = request.query.pc_ID
//     console.log(pc_ID)

//     const sel = "select * from tbl_pcategory where pc_ID=?"
//     con.query(sel,(err,result)=>{
//         response.send(result)
//     })
// })


/////////////////

app.get("/api/cat_list",(request,response)=>{

    const sel ="select * from tbl_pcategory"
    con.query(sel,(err,result)=>{
        response.send(result)
    })
})




app.get("/api/profile",(request,response)=>{
    var a_id = request.query.aid
    console.log(a_id)

    const ddd = "select * from tbl_admin where a_id=?";

    con.query(ddd,[a_id],(err,result)=>{
       console.log(result);
        response.send(result)
    })
})
app.get("/api/cprofile",(request,response)=>{
    var c_id = request.query.cid
    console.log(c_id)

    const sel ="select * from tbl_register WHERE c_id=?";

    con.query(sel,[c_id],(err,result)=>{
        console.log(result)
        response.send(result)
    })
})
//////citizen response
app.get("/api/responseemergency",(request,response)=>{
 

    const sel = "select * from  tbl_post where type=1";
    con.query(sel,(err,result)=>{
       
        response.send(result)
    })
})
////////
// app.get("/api/manageemergency",(request,response)=>{

//     const sel = "select * from tbl_post where type=1"
//     con.query(sel,(err,result)=>{
//         response.send(result)
//     })
// })
app.get("/api/manageemergency",(request,response)=>{

    const sel = "select * from tbl_post"
    con.query(sel,(err,result)=>{

        response.send(result)
    })
})
//user
app.get("/api/Useremergency",(request,response)=>{

    const sel = "select * from tbl_post where type=0"
    con.query(sel,(err,result)=>{
        response.send(result)
    })
})
//reject

app.post("/api/reject",(request,response)=>{
    var p_id = request.body.p_id;
     console.log(p_id)

    const upd = "UPDATE tbl_post SET  admin_status=3  where p_id=?";
    //values =[p_id];
    //con.query(upd,[p_name,p_location,p_issue,p_category,p_img,p_id],);
    con.query(upd,[p_id]);
        response.send();
    })

// accept

app.post("/api/accept",(request,response)=>{
    var p_id = request.body.p_id;
     console.log(p_id)

    const upd = "UPDATE tbl_post SET  admin_status=2  where p_id=?";
    values =[p_id];
    //con.query(upd,[p_name,p_location,p_issue,p_category,p_img,p_id],);
    con.query(upd,[p_id]);
        response.send();
    })
 app.get("/api/dashboard",(request,response)=>{

    // const sel = "SELECT COUNT(c_name) FROM tbl_register;";
    // const sele ="SELECT COUNT(p_name) FROM tbl_post;";
  
        const query = "SELECT (SELECT COUNT(c_name) FROM tbl_register) AS registerCount, (SELECT COUNT(p_name) FROM tbl_post) AS postCount, (SELECT COUNT(f_name) FROM tbl_feedback)AS feedbackcount;";
        
        con.query(query, (err, result) => {
            if (err) {
                console.error(err);
                response.status(500).send("Internal Server Error");
            } else {
                console.log(result);
                response.send(result);
            }
        });
    });


    app.get("/api/chatbot", (request, response) => {
    const cb_message = request.query.cb_message; // Corrected variable name

    const sel = "SELECT * FROM tbl_chat WHERE cb_message LIKE ?";
    con.query(sel, [cb_message], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            response.status(500).json({ error: 'Internal server error' });
        } else {
            // if (result.length > 0) {
                response.json(result[0]); // Sending the first result
                console.log(result[0]);
            // } 
            // else {
            //     response.json({ cd_replay: null }); // Sending null if no result found
            //     console.log('No result found');
            // }
        }
    });
});
app.get("/api/chatbotlocation",(request,response)=>{
    const cb_message = request.query.cb_message;

console.log(cb_message)
    const sel = "SELECT *from tbl_post WHERE p_location =?";
    con.query(sel,[cb_message],(err, result)=>{
        if(err){
            console.error('Error executing SQL query:',err);
            response.status(500).json({error: 'Internal server error'});
        }else{
            // response.json(result);
            response.send(result);
       

        }
    })
})
// app.post("/api/chatbotlogin", (request, response) => {
//     const cb_message = request.body.cb_message; 
//     console.log(cb_message);
//     const [email, password] = cb_message.split(' ,'); 
  
//     const sel = "SELECT * FROM tbl_register WHERE c_email = ?";
//     con.query(sel, [email], (error, result) => {
//         if (error) {
//             console.error("Error executing SQL query:", error);
//             response.status(500).json({ error: 'Internal server error' }); 
//         } else {
//             if (result.length === 0) {
//                 response.status(404).json({ message: "User not found" });
//             } else {
//                 const user = result[0];
//                 if (user.password === password) {
//                     response.status(200).json({ message: "Login success" });
//                 } else {
//                     response.status(401).json({ message: "Incorrect password" });
//                 }
//             }
//         }
//     });
// });
// app.post("/api/chatbotlogin", (request, response) => {
//     const cb_message = request.body.cb_message; 
//     console.log(cb_message);

   
//     const parts = cb_message.split(" and ");
//     console.log(parts); 

//     const emailPart = parts[0].trim();
//     const passwordPart = parts[1].trim();

//     const email = emailPart.split(":")[1].trim();

//     const password = passwordPart.split(" ")[3].trim();

//     const sel = "SELECT * FROM tbl_register WHERE c_email = ?";
//     con.query(sel, [email], (error, result) => {
//         if (error) {
//             console.error("Error executing SQL query:", error);
//             response.status(500).json({ error: 'Internal server error' }); 
//         } else {
//             if (result.length === 0) {
//                 response.status(404).json({ message: "User not found" });
//             } else {
//                 const user = result[0];
//                 if (user.password === password) {
//                     response.status(200).json({ message: "Login success" });
//                 } else {
//                     response.status(401).json({ message: "Incorrect password" });
//                 }
//             }
//         }
//     });
// });
app.post("/api/chatbotlogin", (request, response) => {
    const cb_message = request.body.cb_message; 
    console.log(cb_message);

    // Splitting the cb_message string by spaces
    var parts = cb_message.split(' ');

    // Finding the index of 'email' and 'password' in the parts array
    var emailIndex = parts.indexOf('is') + 1;
    var passwordIndex = parts.indexOf('password') + 1;

    // Extracting email and password
    var email = parts[emailIndex];
    var password = parts[passwordIndex];
    
    console.log(email);
    console.log(password);
 

    const sel = "SELECT * FROM tbl_register WHERE c_email = ? AND c_password = ?";
    con.query(sel, [email, password], (error, result) => {
       if(result.length>0){
        response.send(result);
       }else{
        response.send({message: "wrong ID or Password"});
       }
});
})
// app.post("/api/chatbotlogin", (request, response) => {
//     const cb_message = request.body.cb_message; 
//     console.log(cb_message);

//     const parts = cb_message.split(" and ");
//     console.log("Parts:", parts); 

//     const emailPart = parts[0].trim();
//     const passwordPart = parts[1].trim();

//     console.log( emailPart);
//     console.log( passwordPart);

//     const email = emailPart.split(":")[1].trim();
//     console.log( email);

//     const password = passwordPart.split(" ")[3].trim();
//     console.log( password);

//     const sel = "SELECT * FROM tbl_register WHERE c_email = ? c_password=?";
//     con.query(sel, [email,password], (error, result) => {
//         if (error) {
//             console.error("Error executing SQL query:", error);
//             response.status(500).json({ error: 'Internal server error' }); 
//         } else {
//             if (result.length === 0) {
//                 response.status(404).json({ message: "User not found" });
//             } else {
//                 const user = result[0];
//                 if (user.password === password) {
//                     response.status(200).json({ message: "Login success" });
//                 } else {
//                     response.status(401).json({ message: "Incorrect password" });
//                 }
//             }
//         }
//     });
// });




  
app.post("/api/unanswered", (request, response) => {
    const question = request.body.question;

    const ins = "INSERT INTO tbl_chat (cb_message) VALUES (?)"; 

    con.query(ins, [question], (error, result) => {
        if (error) {
            console.error('Error saving unanswered question:', error);
            response.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log('Unanswered question saved:', question);
        response.status(200).json({ message: 'Unanswered question saved successfully' });
    });
});

app.post("/api/delete_question",(request,response)=>{
    console.log("Delete")
    var cb_id = request.body.cbid;
    console.log(cb_id)
    const query="DELETE from tbl_chat WHERE cb_id=?";
    con.query(query,[cb_id]);
    response.send("");
});
app.post("/api/delete_q",(request,response)=>{
    console.log("Delete")
    var cb_id = request.body.cbid;
    console.log(cb_id)
    const query="DELETE from tbl_chat WHERE cb_id=?";
    con.query(query,[cb_id]);
    response.send("");
});
app.post("/api/question_fatch",(request, response)=>{
    var cb_id = request.body.cbid;
    console.log(cb_id)
    const sel ="select * from tbl_chat WHERE cb_id=?";
    con.query(sel,[cb_id],(err,result)=>{
        console.log(result)
        response.send(result)
    })
})
app.post("/api/q_fatch",(request, response)=>{
    var cb_id = request.body.cbid;
    console.log(cb_id)
    const sel ="select * from tbl_chat WHERE cb_id=?";
    con.query(sel,[cb_id],(err,result)=>{
        console.log(result)
        response.send(result)
    })
})


// app.get("/api/managequestion",(request,response)=>{
    
//     const sel = "select * from tbl_chat"
//     con.query(sel,(err,result)=>{
//         response.send(result)
//     })
// })
app.get("/api/managequestion", (request, response) => {
    const sel = "SELECT * FROM tbl_chat WHERE cd_reply IS NULL OR cd_reply = ''";
    con.query(sel, (err, result) => {
        if (err) {
            console.error('Error fetching unanswered questions:', err);
            response.status(500).json({ error: 'Internal server error' });
            return;
        }
        response.send(result);
    });
});
app.get("/api/viewchat", (request, response) => {
    const sel = "SELECT * FROM tbl_chat ";
    con.query(sel, (err, result) => {
        if (err) {
            console.error('Error fetching unanswered questions:', err);
            response.status(500).json({ error: 'Internal server error' });
            return;
        }
        response.send(result);
    });
});

app.post("/api/update_answer",(request,response)=>{
    console.log("Update")
    var cb_id = request.body.cbid;
    console.log(cb_id)
    var cb_message = request.body.pc;
    console.log(cb_message)
    var cb_reply = request.body.pc2;
    console.log(cb_reply)

    const upd = "UPDATE tbl_chat SET cb_message = ?, cd_reply= ? WHERE cb_id = ?";
    con.query(upd,[cb_message,cb_reply,cb_id],);
    response.send("");

})
app.post("/api/update_question",(request,response)=>{
    console.log("Update")
    var cb_id = request.body.cbid;
    console.log(cb_id)
    var cb_message = request.body.pc;
    console.log(cb_message)
    var cb_reply = request.body.pc2;
    console.log(cb_reply)

    const upd = "UPDATE tbl_chat SET cb_message = ?, cd_reply= ? WHERE cb_id = ?";
    con.query(upd,[cb_message,cb_reply,cb_id],);
    response.send("");

})



app.get("/api/count",(request,response)=>{
    const query ="SELECT (SELECT COUNT(c_name)FROM tbl_register)AS registerCount, (SELECT COUNT(p_name) FROM tbl_post)AS postCount, (SELECT COUNT(f_name) FROM tbl_feedback)AS feedbackcount,(SELECT COUNT(pc_name)FROM tbl_pcategory)AS categorycount;";
    con.query(query,(error,result)=>{
        if  (error){
            console.error(error);
            response.status(500).send("Internal Server Error");
        }else{
            console.log(result);
            response.send(result);
        }

    });
});
// app.post("/api/update_answer", (request, response) => {
//     const cb_id = request.body.cb_id;
//     const cb_message = request.body.cb_message;
//     const cd_reply = request.body.cb_reply;

//     const upd = "UPDATE tbl_chat SET cb_message = ?, cd_reply = ? WHERE cb_id = ?";
//     con.query(upd, [cb_message, cd_reply, cb_id], (error, result) => {
//         if (error) {
//             console.error('Error updating question:', error);
//             response.status(500).json({ error: 'Internal server error' });
//         } else {
//             console.log('Question updated successfully');
//             response.status(200).json({ message: 'Question updated successfully' });
//         }
//     });
// });


// Endpoint to fetch unique locations
// app.get("/api/chatbotlocations", (request, response) => {
//   const sel = "SELECT DISTINCT p_location FROM tbl_post";
//   con.query(sel, (err, result) => {
//     if (err) {
//       console.error('Error executing SQL query:', err);
//       response.status(500).json({ error: 'Internal server error' });
//     } else {
//       const locations = result.map(row => row.p_location);
//       response.json(locations);
//     }
//   });
// });


    // app.post("/api/chat",(request,response)=>{
    //     var humanMessage= request.body.humanMessage;
    //     console.log(humanMessage)
    //     var botmessage= request.body.botmessage;
    //     console.log(botmessage)

    //     const sel = "select * from tbl_chat WHERE cb_message=?";
    //     con.query(sel,[humanMessage],(err,result)=>{
    //         // if(result.length >0){
    //         //     console.log(result)

    //         // }
    //         console.log(result);
    //     })
    // })
    
    // con.sele(sele,(err,result))
   

    // app.post('/api/chat', (req, res) => {
    //     const { message } = req.body;
    //     // Logic to process message and generate response
    //     const response = `You said: ${message}`;
    //     res.json({ message: response });
    // });
    
    app.post("/api/in_email",(request,response)=>{

        var email = request.body.emails;
        console.log(email)
        const sel = "select * from tbl_register where c_email=?";
        con.query(sel,[email],(error,result)=>{
            if(result.length>0){
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth:{
                        user:"mycity01012024@gmail.com",
                        pass:"sywnhxhhcezzlmvj"
                    }
                });
                var pass = request.body.c_password;
                var name = request.body.c_name;
                if(result.length>0){
                    response.send(result)
                    var pass = result[0].c_password;
                    var name = result[0].c_name;
                }
                const mailOptions = {
                    from: "mycity01012024@gmail.com",
                    to: "rahulvmakwana83@gmail.com",
                    subject: "Welcome to My City",
                    text: "Hello Mr/Miss " + name + ",\n\nWelcome to My City! We're excited to have you as a member of our community.\n\nYour login details are as follows:\n\nUsername: " + name + "\nPassword: " + pass + "\n\nPlease keep your login credentials secure and do not share them with anyone.\n\nIf you have any questions or need assistance, feel free to contact us.\n\nBest regards,\n[Rahul Makwana]"
                };
                
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);

                    }else{
                        console.log("Email sent:"+info.response);
                    }
                });
            }
            else{
                response.send({msg: "Not match Email"});
            }

        })
    })

    ////////////admin//////////
    
//////Event Post/////

// app.post("/api/events",(request,response)=>{
//     let upload = multer({storage:storage}).single('image');
//     upload(request,response,function(error){
//         if (!request.file){
//             console.log("File not found")
//         }else{
//             var e_name = request.body.ename;
//             console.log(e_name)
//             var e_date = request.body.edate;
//             console.log(e_date)
//             var e_location = request.body.elocation;
//             console.log(e_location)
//             var e_description= request.body.edescription;
//             console.log(e_description)
//             var e_organisers= request.body.eorganisers;
//             console.log(e_organisers)
//             var e_img= request.file.filename;
//             console.log(e_img)

//             const ins = "INSERT INTO `tbl_event`(`e_id`, `e_name`, `e_date`, `e_location`, `e_description`, `e_organisers`, `e_img`) VALUES (?,?,?,?,?,?,?)";
//             con.query(ins,[e_id,e_name,e_date,e_location,e_description,e_organisers,e_img])
//             response.send();
//         }
//     })
// })
app.post("/api/events", (request, response) => {
    let upload = multer({ storage: storage }).single('image');
    upload(request, response, function (error) {
        if (!request.file) {
            console.log("File not found")
        } else {
            var e_name = request.body.name;
            console.log(e_name)
            var e_date = request.body.date;
            console.log(e_date)
            var e_location = request.body.location;
            console.log(e_location)
            var e_description = request.body.description;
            console.log(e_description)
            var e_organisers = request.body.eorganisers;
            console.log(e_organisers)
            var e_img = request.file.filename;
            console.log(e_img)

            const ins = "INSERT INTO `tbl_event`(`e_name`, `e_date`, `e_location`, `e_description`, `e_organisers`, `e_img`) VALUES (?,?,?,?,?,?)";
            con.query(ins, [e_name, e_date, e_location, e_description, e_organisers, e_img], function (err, result) {
                if (err) {
                    console.error("Error inserting event into database:", err);
                    return response.status(500).send("Error inserting event into database.");
                }
                console.log("Event inserted successfully.");
                response.send();
            });
        }
    });
});
app.get("/api/manageevent",(request,response)=>{
    const sel = "select * from tbl_event"
    con.query(sel,(error,result)=>{
        response.send(result)
    })
})


app.post("/api/event_fatch",(request,response)=>{
    var e_id = request.body.e_id;
    console.log(e_id)
    const sel = "select * from tbl_event WHERE e_id=?";
    con.query(sel,[e_id],(error,result)=>{
        console.log(result)
        response.send(result)
    })
})



app.post("/api/event_update", (request, response) => {
    console.log("Update");
    let upload = multer({ storage: storage }).single('image');
    upload(request, response, function (error) {
        if (!request.file) {
            console.log("File not found")
        } else {
        var e_id = request.body.eid;
        console.log(e_id)
        var e_name = request.body.names;
        console.log(e_name)
        var e_date = request.body.date;
        console.log(e_date)
        var e_location = request.body.location;
        console.log(e_location)
        var e_description = request.body.issues;
        console.log(e_description)
        var e_organisers = request.body.org;
        console.log(e_organisers)
        var e_img = request.file.filename;
            console.log(e_img)
        // var e_img = request.file.filename;
        // var e_img = request.files['e_img'] ? request.files['e_img'][0].filename : null; 

        const upd = "UPDATE tbl_event SET e_name=?, e_location=?, e_description=?,e_organisers=?, e_img=? WHERE e_id=?";
        con.query(upd, [e_name, e_location, e_description,e_organisers, e_img, e_id], function (error, result, fields) {
            if (error) {
                console.log(error);
                return response.status(500).send("Database error");
            }
            console.log("Update Successful");
            response.send("");
        })
    }})
})
// app.get("/api/eventlist",(request,response)=>{
//     const sel = "select * from tbl_event"
//     con.query(sel,(error,result)=>{
//         response.send(result)
//     })
// })

app.get("/api/eventlist", (request, response) => {
    var e_id= request.query.e_id;
    console.log(e_id)
    
    const query = "SELECT * FROM tbl_event where e_id=? ";
    con.query(query,[e_id],(err,result)=>{
  
        response.send(result)
    })
    });
app.get("/api/eve_fatch",(request,response)=>{
    var e_name= request.query.id;
    console.log(e_name)
   
        const query = "select * from tbl_event WHERE e_id=? ";
        con.query(query,[e_name],(err,result)=>{
        response.send(result)
        })
    

  
})
// app.post("/api/deletepevent",(request,response)=>{
//     console.log("Delete")
//     var e_id = request.body.e_id;
//     console.log(e_id)
//     const query="DELETE from tbl_event WHERE e_id=?";
//     con.query(query,[e_id]);
//     response.send("");
// });
app.post("/api/deleteevent",(request,response)=>{
    console.log("Delete")
    var e_id = request.body.e_id;
    console.log(e_id)
    const query="DELETE from tbl_event WHERE e_id=?";
    con.query(query,[e_id]);
    response.send("");

})
// app.post("/api/eve_fatch",(request,response)=>{
    //     var e_id=request.body.e_id;
    //     console.log(e_id)
    //     // var p_issue=request.body.p_issue;
    //     // console.log(p_issue)
    //    const sel = "select * from tbl_event WHERE e_id=?";
    //     con.query(sel,[e_id],(err,result)=>{
    //         console.log(result)
    //         response.send(result)
    //     })})

 app.listen(4040);

con.connect(function(err){
    if(err){
        console.error("error conneting to db");
          return
    }
    console.log("connected");

}
)