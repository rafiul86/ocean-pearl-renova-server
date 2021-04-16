const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
const { static } = require('express');
require('dotenv').config()
const port = 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3be27.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('admin'))
app.use(fileUpload())



client.connect(err => {
  const collection = client.db("homedb").collection("renovation");
  const adminCollection = client.db("homedb").collection("admin");

app.post('/setAdmin' , (req,res)=>{
  const name = req.body.name ;
  const email = req.body.email ;
  const file = req.files.file
  file.mv(`${__dirname}/admin/${file.name}`,err=>{
    if(err){
      console.log(err)
      return res.status(500).send({msg : 'file upload failed'})
    }
    return res.send({name : file.name , path : `/${file.name}`})
  })

adminCollection.insertOne({name, email, img : file.name})
.then(res => {
  console.log('saved to mongodb')
})
})
  
app.get('/showAdmin',(req,res)=>{
  adminCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})
  console.log('connected to database')
});


app.get('/', (req,res)=>{
    res.send('Are you forgot your past hardship ?')
})


app.listen(process.env.PORT || port)