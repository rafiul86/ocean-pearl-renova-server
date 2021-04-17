const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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
  const serviceCollection = client.db("homedb").collection("service");
  const orderDetails = client.db("homedb").collection("product");
  const reviewData = client.db("homedb").collection("review");

  app.patch('/update/:id' , (req,res)=>{
    orderDetails.updateOne({_id : ObjectId(req.params.id)},{$set :{status : req.body.status}})
    .then(res=>{
      console.log(res)
    })
  })

  app.delete('/removeService/:id',(req,res)=>{
    serviceCollection.deleteOne({_id : ObjectId(req.params.id)})
  })
  app.get('/showReview', (req,res)=>{
    reviewData.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.post('/setReview' ,(req,res)=>{
    reviewData.insertOne(req.body)
    .then(res=>{
      console.log(res.insertedCount>0)
    })
  })

  app.post('/showAdmin' , (req,res)=>{
    adminCollection.find({email : req.body.email})
    .toArray((err,documents)=>{
      res.send(documents.length > 0)
    })
  })

  app.post('/showOrderHistory' , (req,res)=>{
    const email = req.body.email ;
    adminCollection.find({email : email})
    .toArray((err,admin)=>{
      const filter = {}
      if(admin.length ===0 ){
        filter.email = email
      }
      orderDetails.find(filter)
      .toArray((err , documents)=>{
        res.send(documents)
      })
    })
  })
app.post('/orderData',(req,res)=>{
  orderDetails.insertOne(req.body)
  .then(res =>{
    console.log(res.insertedCount>0)
  })
})

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
  
})
})
app.post('/addService' , (req,res)=>{
  const name = req.body.name ;
  const price = req.body.price ;
  const file = req.files.file
  file.mv(`${__dirname}/admin/${file.name}`,err=>{
    if(err){
      console.log(err)
      return res.status(500).send({msg : 'file upload failed'})
    }
    return res.send({name : file.name , path : `/${file.name}`})
  })


serviceCollection.insertOne({name, price, img : file.name})
.then(res => {
  
})
})
app.get('/showAdmin',(req,res)=>{
  adminCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})
app.get('/showService',(req,res)=>{
  serviceCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})
app.get('/showOneService/:id',(req,res)=>{
  serviceCollection.find({_id : ObjectId(req.params.id)})
  .toArray((err, documents)=>{
    res.send(documents[0])
  })
})
  console.log('connected to database')
});


app.get('/', (req,res)=>{
    res.send('Are you forgot your past hardship ?')
})


app.listen(process.env.PORT || port)