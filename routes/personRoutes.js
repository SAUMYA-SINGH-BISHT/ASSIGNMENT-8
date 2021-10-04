if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const Person=require('../models/person');
const sgMail=require('@sendgrid/mail');

const message={
    to:'',
    from:'saumya0234.cse19@chitkara.edu.in',
    subject:'',
    text:'',
    html:'',
}

sgMail.setApiKey(process.env.API);   
   
   router.get("/persons", async(req, res) => {
     const people=await Person.find({});
     res.render('index',{people});
   });
   
   
   router.get("/persons/new",(req,res)=>{
    res.render('new');
   })
   
   router.post("/persons", async(req, res) => {
     message.to=req.body.email;
     message.subject="Welcome to MVT Pvt ltd";
     message.text=`Dear ${req.body.name}, Welcome to Mvt pvt ltd. You just checked in at ${req.body.inTime} on ${req.body.dateAndDay}. Hope you will enjoy your day here.`;
     message.html=`<h1>Dear ${req.body.name}, Welcome to Mvt pvt ltd. You just entered in the building at ${req.body.inTime} on ${req.body.dateAndDay}. Hope you will enjoy your day here.</h1>`;
     
    try{
     sgMail.send(message)
     .then(()=>{
      console.log('mail sent successfully');
     })
     .catch((err)=>{
      console.log(err);
     });
    }
    catch(e){
     res.render('error',{e});
    }
   
     const {name,email,contact,inTime,dateAndDay,address}=req.body;
     await Person.create({name,email,contact,inTime,dateAndDay,address});
     res.redirect('/persons');
   });
   
   router.get("/persons/:id", async(req, res) => {
     const {id}=req.params;
     const personFound= await Person.findById(id);
     res.render('show',{personFound});
   });
   
   router.get("/persons/:id/edit", async(req, res) => {
     const {id}=req.params;
     const personFound=await Person.findById(id);
     res.render('edit',{personFound});
   });
   
   router.patch("/persons/:id",async(req,res)=>{
    if(req.body.outTime){
     message.subject="Thank you for visiting MVT Pvt ltd";
     message.text=`Dear ${req.body.name}, You just checked out at ${req.body.outTime} on ${req.body.dateAndDay}. Hope you enjoyed your day there.`;
     message.html=`<h1>Dear ${req.body.name}, You just checked out at ${req.body.outTime} on ${req.body.dateAndDay}. Hope you enjoyed your day there.</h1>`;
     sgMail.send(message)
     .then(()=>{
      console.log('mail2 sent successfully');
     })
     .catch((err)=>{
      console.log(err);
     });
    }
    const {id}=req.params;
    const updatedPerson=req.body;
    await Person.findByIdAndUpdate(id,updatedPerson);
    res.redirect('/persons');
   });
   
   router.delete('/persons/:id',async(req,res)=>{
    const {id}=req.params;
    await Person.findByIdAndDelete(id);
    res.redirect('/persons');
   })

   module.exports=router;
   