import nodemailer from "nodemailer";

export const sendEmail=async( {to=[],cc=[],html="",bcc=[],text="",subject="social app",attachments=[]}={})=>{
   

const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

  
  const info = await transporter.sendMail({
    from: `"Social Media App 👻" <${process.env.EMAIL}>`, // sender address
    to,cc,html,bcc,text,subject,attachments
  });

 

  console.log("Message sent: %s", info.messageId);
}