require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const express = require("express");
const ejs = require("ejs")
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

///////   Dependency requirements above    ///////

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs')

app.use(session({
    secret : "Our little secret.",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);


/////////       Schema Creation       //////////
const userSchema = new mongoose.Schema({
    username :{type:String, unique :true},
    name : String,
    pic : String,
    email : String
});


userSchema.plugin(passportLocalMongoose,{
    usernameField : "username",
    nameField : "name"
});
userSchema.plugin(findOrCreate);

const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy());

////////  Creating sessions and serializing   //////////
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

////////Google OAuth 2.0 Strategy/////////
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ username: profile.id},
        {
            name : profile._json.name,
            pic : profile._json.picture,
            email: profile._json.email
        }, 
        function (err, user) {
        console.log(profile.displayName);
      return cb(err, user);
    });
  }
));

//////            Get Methods         //////////
app.get('/', function(req,res){
    res.render('home');
});


//////        Google Authentication       /////////
app.get('/auth/google', passport.authenticate('google', {
    scope : ['profile','email']
}));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/form');
  });

app.get('/form', function(req,res){
    if(req.isAuthenticated()){
        res.render('form');
    }else{
        res.redirect('/login');
    }
});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
})

///////       Post Methods        //////////
app.post('/register', function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.register({username : username, email : username}, password, function(err, user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})

app.post('/login', function(req,res){

    const user = new User({
        username : req.body.username,
        password : req.body.password,
        email : req.body.username,
        provider : "google"
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(request, result,res,function(){
                res.redirect('/secrets');
            })
        }
    })
})

const port = 3000
app.listen(port, function(){
    console.log("Server running on port " + String(port));
});