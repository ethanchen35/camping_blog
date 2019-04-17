var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User        = require("../models/user");

router.get("/", function(req, res){
    res.render("landing")
})


// ================
// AUTH ROUTES
// ================

// Register route
router.get("/register", function(req, res) {
    res.render("register")
});

router.post("/register", function(req, res){
    // Save username in db
    var newUser = new User({username: req.body.username});    
    // Password is saved separately for hashing
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        // Log user in, using "local" strategy
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + req.body.username)
            res.redirect("/campgrounds");
        })
    })
});


// LOGIN route
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req, res){
    
})

// LOGOUT route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;