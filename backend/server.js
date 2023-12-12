const express = require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const userRoutes=require('./routes/usereroutes')
const documentRoutes=require('./routes/documentroutes')
const editorRoutes=require('./routes/editorroutes')
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app=express()
dotEnv.config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("MongoDB connected Succesfully");
})
.catch((error)=>{
    console.log(`${error}`)
})
app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/document', documentRoutes);
app.use('/editor', editorRoutes)
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});