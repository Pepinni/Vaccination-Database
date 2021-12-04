require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const express = require("express");
const ejs = require("ejs")
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const _ = require('lodash');
require('https').globalAgent.options.rejectUnauthorized = false;

///////   Dependency requirements above    ///////

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs')

app.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize()); 
app.use(passport.session());

mongoose.connect(String(process.env.PASS),{ useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);


/////////       Schema Creation       //////////
const userSchema = new mongoose.Schema({
    username :{type:String, unique :true},
    name : String,
    pic : String,
    email : String,
    presentState : String,
    year: Number,
    brand: String,
    firstDate : Date,
    secondDate : Date,
    referenceId : Number,
    place : String
});


userSchema.plugin(passportLocalMongoose,{
  usernameField : "username"
});
userSchema.plugin(findOrCreate);

const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy())

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
    callbackURL: "https://iit-mandi-vaccination-database.herokuapp.com/auth/google/secrets",
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
  let part21 = 0;
  let part20 = 0;
  let part19 = 0;
  let part18 = 0;
  let full21 = 0;
  let full20 = 0;
  let full19 = 0;
  let full18 = 0;
User.find({}, function(err,foundUsers){
  foundUsers.forEach(function(user){
    if(user.year === 21){
      if(user.presentState === "partial"){
        part21 = part21 + 1;
      }else if(user.presentState === "full"){
        full21 = full21 + 1;
      }
    }
    else if(user.year === 20){
      if(user.presentState === "partial"){
        part20 = part20 + 1;
      }else if(user.presentState === "full"){
        full20 = full20 + 1;
      }
    }
    else if(user.year === 19){
      if(user.presentState === "partial"){
        part19 = part19 + 1;
      }else if(user.presentState === "full"){
        full19 = full19 + 1;
      }
    }
    else if(user.year === 18){
      if(user.presentState === "partial"){
        part18 = part18 + 1;
      }else if(user.presentState === "full"){
        full18 += 1;//full18 + 1;
      }
    }
    
  });

  res.render('home', {part21:part21, full21:full21,part20:part20, full20:full20, part19:part19,full19:full19, part18:part18, full18:full18});
});
});

app.get('/favicon.ico', function(req,res){
  res.redirect('/');
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
    var name = req.user.name;
    for(var i = 0; i<name.length; i++){
      if(name[i] === " "){
          break;
      }
  };
  var studentName = _.upperFirst(name.substr(0,i));
    res.render('form' ,{presentState : req.user.presentState, studentName : studentName});
  }else{
    res.redirect('/');
  }
});


// ///////// API for charts  //////////////
app.get('/yearwise', function(req,res){
  let part21 = 0;
  let part20 = 0;
  let part19 = 0;
  let part18 = 0;
  let full21 = 0;
  let full20 = 0;
  let full19 = 0;
  let full18 = 0;

  User.find({}, function(err,foundUsers){
    foundUsers.forEach(function(user){
      if(user.year === 21){
        if(user.presentState === "partial"){
          part21 = part21 + 1;
        }else if(user.presentState === "full"){
          full21 = full21 + 1;
        }
      }
      else if(user.year === 20){
        if(user.presentState === "partial"){
          part20 = part20 + 1;
        }else if(user.presentState === "full"){
          full20 = full20 + 1;
        }
      }
      else if(user.year === 19){
        if(user.presentState === "partial"){
          part19 = part19 + 1;
        }else if(user.presentState === "full"){
          full19 = full19 + 1;
        }
      }
      else if(user.year === 18){
        if(user.presentState === "partial"){
          part18 = part18 + 1;
        }else if(user.presentState === "full"){
          full18 += 1;//full18 + 1;
        }
      }
      
    });
    res.json({part21:(part21/300)*100, full21:(full21/300)*100,part20:(part20/308)*100, full20:(full20/308)*100, part19:(part19/262)*100,full19:(full19/262)*100, part18:(part18/191)*100, full18:(full18/191)*100});
});

})

app.get('/btech', function(req,res){
  let part21 = 0;
  let part20 = 0;
  let part19 = 0;
  let part18 = 0;
  let full21 = 0;
  let full20 = 0;
  let full19 = 0;
  let full18 = 0;

  User.find({}, function(err,foundUsers){
    foundUsers.forEach(function(user){
      if(user.year === 21){
        if(user.presentState === "partial"){
          part21 = part21 + 1;
        }else if(user.presentState === "full"){
          full21 = full21 + 1;
        }
      }
      else if(user.year === 20){
        if(user.presentState === "partial"){
          part20 = part20 + 1;
        }else if(user.presentState === "full"){
          full20 = full20 + 1;
        }
      }
      else if(user.year === 19){
        if(user.presentState === "partial"){
          part19 = part19 + 1;
        }else if(user.presentState === "full"){
          full19 = full19 + 1;
        }
      }
      else if(user.year === 18){
        if(user.presentState === "partial"){
          part18 = part18 + 1;
        }else if(user.presentState === "full"){
          full18 = full18 + 1;
        }
      }
      
    });
    res.json({part21:part21, full21:full21 , part20:part20 , full20 : full20 , part19 : part19 , full19 : full19 , part18 : part18 , full18 : full18 });
});

})

app.get('/total', function(req,res){
  User.find({presentState : {$ne : null}}, function(err, foundUsers){
    if(err){
      console.log(err);
    }else{
      if(foundUsers){
        // var partiallyVaccinated;
        // var fullyVaccinated;
        // foundUsers.forEach(function(users){
        //   if(users.present)
        // });
        res.json({registered : foundUsers.length});
      }
    }
  });

})

app.get('/vaccine', function(req,res){
  User.find({brand : {$ne : null}}, function(err,foundUsers){
    if(err){
      console.log(err);
    }else{
      if(foundUsers){
        let covishield = 0;
        let covaxin = 0;
        let other = 0;
        foundUsers.forEach(function(user){
          if(user.brand === "Covishield"){
            covishield += 1;
          }else if(user.brand === "Covaxin"){
          covaxin += 1;
          }
          else{
          other += 1;
          }
        })
        res.json({covishield : covishield, covaxin : covaxin, other : other});

      }
    }
  });
});
///////       Post Methods        //////////


app.post('/submit', function(req,res){
  const presentState = req.body.presentState;
  const year = req.body.year;
  const brand = req.body.brand;
  const firstDate = req.body.firstDate;
  const secondDate = req.body.secondDate;
  const refId = req.body.refId;
  const place = req.body.place;
  console.log(req.body);
  
  User.findById(req.user._id, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        foundUser.presentState = presentState;
        foundUser.year = year;
        foundUser.brand = brand;
        foundUser.firstDate = firstDate;
        foundUser.secondDate = secondDate;
        foundUser.referenceId = refId;
        foundUser.place = place;
        foundUser.save();
        res.redirect('/form');
      }
    }
  })
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running on port 3000" );
});

