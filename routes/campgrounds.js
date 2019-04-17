var express = require("express");
var router  = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware")

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, returnedCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds:returnedCampgrounds, currentUser:req.user})
        }
    })
})

// CREATE - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
            id: req.user._id,    
            username: req.user.username
        }
    
    Campground.create({
        name: name, 
        image: image,
        description: desc,
        author: author,
    }, function(err){
      if(err){
          console.log(err)
      }  
    })
    // redirect to campgrounds
    res.redirect("/campgrounds")
    
})


// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})

// SHOW - show details of campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, returnedCampground){
        if(err || !returnedCampground){
            req.flash("error", "Item not found.");
            res.redirect("back")
        }else{
            // console.log(returnedCampground)
            res.render("campgrounds/show", {campground:returnedCampground});
        }
    })
    
})

// EDIT - Edit campground
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, returnedCampground){
        if(err){
            req.flash("error", "Item not found.");
            res.redirect("back");
        }else{
            res.render("campgrounds/edit", {campground:returnedCampground});
        }
    })
})

// UPDATE - Update campground
router.put("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DELETE - delete campground
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;