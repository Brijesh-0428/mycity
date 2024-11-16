const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:"mycity01012024@gmail.com",
        pass:"sywnhxhhcezzlmvj"
    }
});

const mailOptions ={
    from:"mycity01012024@gmail.com",
    to:"rahulvmakwana83@gmail.com",
    subject:" Nodemailer test",
    text:"Hello this is ........"
};
transporter.sendMail(mailOptions, function(error,info){
    if (error){
        console.log(error);

    }else{
        console.log("Email sent:"+info.response);
    }
});