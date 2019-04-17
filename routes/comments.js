var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware = require("../middleware");

// ================
// COMMENTS ROUTES
// ================

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, returnedCampground){
        if(err){
            res.redirect("/campgrounds/" + req.params.id)
        }else{
            res.render("comments/new", {campground:returnedCampground});    
        }
    })
    
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground by id
    Campground.findById(req.params.id, function(err, returnedCampground){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
        // create new comment
        Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            }else{
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                // save comment
                comment.save()
                // connect new comment to campground
                returnedCampground.comments.push(comment);
                returnedCampground.save();
                // redirect
                req.flash("success", "Successfully added comment!");
                res.redirect("/campgrounds/" + returnedCampground._id)
            }
        })
        }
    })
})

// EDIT - edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, returnedComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment:returnedComment});
        }
    })
})

// UPDATE - update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DELETE - delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router;