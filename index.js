const { json } = require('body-parser');
const { Router } = require('express');
var express=require('express'),
bodyparser=require('body-parser'),
expressSanitizer= require('express-sanitizer'),
bcrypt = require('bcrypt'),
passport = require('passport'),
sessions = require('express-session'),
cookieParser = require("cookie-parser"),
cors = require('cors');
mongoose=require('mongoose');
const { populate } = require('./models/Event');

app = express();
app.use(bodyparser.json());
app.use(expressSanitizer());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessions({
    secret :"thisismysecertkeyabcdfghj",
    cookie:{maxAge:300000},
    resave:false,
    saveUninitialized:false
}))
app.use(cors({origin:"*"}));
var session;
const Et = require('./models/Event');
const User = require('./models/User');





// MongoDB connection in local host for Event database
mongoose.connect('mongodb://localhost/EventV2',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=> console.log("Connected to DB!!"))
.catch(error => console.log(error.message));

app.get('/',async(req,res)=>{
    res.send("Hi from Events");
});
//==============================================================================


// Get all events
app.get('/events', async (req,res)=>{
    try{
        const list = await Et.find();
        res.json(list);
    }catch(err){
        res.json({message : err});
    }
});


// Get Event details by Event_id
app.get('/event/:bd',function(req,res){
    Et.findById(req.params.bd,function(err,found){
        if(err){
            console.log({message:err});
        }else{
            res.json(found);
           // fun(found.created);

        }
    });
});

// Get organizer of an Event
app.get('/event/getOrganizer/:bd',function(req,res){
    Et.findById(req.params.bd,function(err,found){
        if(err){
            console.log({message:err});
        }else{
            res.json(found.created);

        }
    });
});

// Get all events by School Name
app.get('/event/bySchool/:school',function(req,res){
    Et.find({school:req.params.school},function(err,schoolevent){
        if(err){
            console.log({message:err});
        }else{
            res.json(schoolevent);
        }
    });
});

// Create an Event
app.post('/AddEvent', async(req,res)=>{
    const event = new Et({
        eventname : req.body.eventname,
        description : req.body.description,
        link : req.body.link,
        date : req.body.date,
        school : req.body.school,
        queriescontact :{
            mail : req.body.mail,
            phone : req.body.phone
        },
        guestlecture : req.body.guestlecture,
        // This created need to be changed according to the logged in user id like (req.User._id)
        created :{
            id : req.body.id, 
            name: req.body.name
        }
    });
    try{
        const newevent = await event.save();
        res.json(newevent);
    }catch(err){
        res.json({message : err});
    }
});

//=====================================================================================================
// login
app.post('/login', (req, res) => {
    const mail = req.body.mail
    const password = req.body.password
    User.findOne({ mail })
        .then(user => {
            if (!user) return res.status(400).json({ msg: "User not exist" })
            bcrypt.compare(password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err
                if (data) {
                    session=req.session;
                    session.userid=user._id;
                    session.mail= user.mail;
                    session.name=user.name;
                    console.log(session);
                    return res.status(200).json({ msg: "Login success" })
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }

            })

        })
})

//check
app.get('/check',(req,res) => {
    session=req.session;
    if(session.userid){
        res.json("Welcome User session created");
    }else
    res.json("No seesion created");
});

// logout
app.get('/logout',(req,res) => {
    req.session.destroy();
    console.log("Seesion destroyed");
    res.redirect('/');
});

// Register
app.post('/register',async(req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new User({
        name:req.body.name,
        password:hashedPassword,
        mail:req.body.mail,
        phonenumber:req.body.phonenumber,
        registerid:req.body.registerid,
        school:req.body.school
    });
    try{
        const newuser = await user.save();
        res.json(newuser);
    }catch(err){
        res.json({message : err});
    }
});

// Get all Users
app.get('/users', async (req,res)=>{
    try{
        const list = await User.find();
        res.json(list);
    }catch(err){
        res.json({message : err});
    }
});

app.listen(2245,function(){
    console.log("Listening to the port 2345");
});

// Get events by faculty id
// create dean and admin table
// mail api for approval and disapproval
