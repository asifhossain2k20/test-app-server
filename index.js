const express=require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port = process.env.PORT || 5000;
const dotenv = require("dotenv")
dotenv.config()

//middlewire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.skhdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const selectOptionData=require('./data/select.json')

async function run(){
    try{
        const userCollection=client.db('testApp').collection('selectedFeildItems');
        
        app.get('/all-select-option',(req,res)=>{
            res.send(selectOptionData);
        })
        app.get('/selectedItems',async (req,res)=>{
            const query={};
            const cursor=userCollection.find({})
            const users=await cursor.toArray();
            res.send(users)
        })
        app.post('/selectedItems',async(req,res)=>{
            const info=req.body;
            console.log(info)
            const result= await userCollection.insertOne(info)
            res.send(result)
        })
        app.get('/selectedItems/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            const query={_id:ObjectId(id)};
            const result=await userCollection.findOne(query)
            res.send(result);
        })

        app.put('/selectedItems/:id',async(req,res)=>{
            const id=req.params.id;
            const user=req.body;
            const filter={_id:ObjectId(id)}
            const option={upsert:true}
            const updateUser={
                $set:{
                    name:user.name,
                    selectedItem:user.selectedItem,
                    checkMark:user.checkMark
                }
            }
            const updatedResult= await userCollection.updateOne(filter,updateUser,option)
            res.send(updatedResult);
            console.log(id, user);
        })
    }
    finally{
    }
}
run().catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send('Hello Server is Ready')
})

app.listen(port,()=>{
    console.log(`Port is Running ${port}`);
})