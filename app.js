const express=require('express');
const { default: mongoose } = require('mongoose');
const app=express();
const Port=5000;
const path=require('path')
const User=require('./models/user')

const hbs=require('hbs');




mongoose.connect('mongodb://127.0.0.1:27017/crudapp')
.then(()=>{
    console.log('mongodb connected')
})
.catch(()=>{
    console.log('failed to connect')
})


app.use(express.urlencoded({extended:false})) 
const staticpath=path.join(__dirname,'public')
app.set('view engine','hbs')


app.use(express.static(staticpath))
app.get('/',async(req,res)=>{
    const userData= await User.find();
    // console.log(userData)
    if (userData) {
        res.render('index',{userdata:userData})
        
    }
    else{
        res.render('add',{message:"User Not Added"})
    }
    
})


app.get('/add',(req,res)=>{
    res.render('add')
})

app.post('/add',async(req,res)=>{
    try {
        const newuser=new User({
            name:req.body.name,   
            phone:req.body.phone,   
            age:req.body.age,
            email:req.body.email,   
            address:req.body.address,   
            
        })
       const userdata= await newuser.save();
      
       if (userdata) {
        
        res.redirect('/')
       }
    } catch (error) {
        console.log(error.message)
    }
})

app.get('/edit/:_id', async (req, res) => {
    try {
        const id = req.params._id;

        

        const userData = await User.findOne({ _id: id });

        if (userData) {
            res.render('edit', { userdata: userData });
        } else {
            res.render('edit', { userdata: null, error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user for edit:', error.message);
        res.render('edit', { userdata: null, error: 'Failed to fetch user for edit' });
    }
});

app.post('/edit/:_id',async(req,res)=>{
   try {
    const id=req.params._id;
    const userdata=await User.findOne({_id:id})

    userdata.name=req.body.name
    userdata.age=req.body.age
    userdata.phone=req.body.phone
    userdata.email=req.body.email
    userdata.address=req.body.address
    
    await userdata.save();
    res.redirect('/')
   } catch (error) {
    console.log(error.message);

   }
    
})
app.get('/delete/:_id',async(req,res)=>{
    const id=req.params._id;
    await User.deleteOne({_id:id})
    res.redirect('/')
})


app.listen(Port,()=>{
    console.log(`Server started at http://localhost:${Port}`);
})