var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require('passport'),
    LocalStrategy           = require('passport-local'),
    expressSession          = require('express-session'),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),

    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

// requiring routes
var campgroundRoutes= require("./routes/campgrounds"),
    commentRoutes   = require("./routes/comments"),
    authRoutes   = require("./routes/index");
 
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

// Disable Mongoose deprecated methods
mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Initialize database
// seedDB();

// PASSPORT Config
app.use(expressSession({
    secret: "ethanchen",   // used for encoding the session
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

// encoding and decoding the session 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Save user info in res.local, so we can access user info when rendering (res) the header
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Include campground routes and comment routes
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("App started!");
});