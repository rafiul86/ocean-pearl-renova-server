const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = 5000


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.get('/', (req,res)=>{
    res.send('Are you forgot your past hardship ?')
})


app.listen(process.env.PORT || port)