if(process.env.NODE_ENV!=='production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path=require('path');
const seedDB=require('./seed');
const methodOverride=require('method-override');
const personRoutes=require('./routes/personRoutes');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(personRoutes);

mongoose.connect(process.env.API2)
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => {
        console.log(err);
    });

app.get("/", (req, res) => {
  res.render('home');
});

//seedDB();

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server running on port 3000 🔥");
});