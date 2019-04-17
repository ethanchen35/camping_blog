var middlewareObj = {};
var Campground = require("../models/campground")
var Comment = require("../models/comment")

middlewareObj.checkCampOwnership = function(req, res, next){
    // check if logged in
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, returnedCampground){
            if(err || !returnedCampground){
                req.flash("error", "Item not found.");
                res.redirect("back");
            }else{
                // check if user own the campground
                if(req.user._id.equals(returnedCampground.author.id)){
                    next();
                }else{
                    // if user doesn't own the background, redirect
                    req.flash("error", "You do not have the permission to do this");
                    res.redirect("back")
                }
            }
        })
    }else{
        // if not logged in, redirect
        req.flash("error", "You need to be logged in first");
        res.redirect("back")
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    // check if logged in
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, returnedComment){
            if(err || !returnedComment){
                req.flash("error", "Item not found.");
                res.redirect("back");
            }else{
                // check if user own the campground
                if(req.user._id.equals(returnedComment.author.id)){
                    next();
                }else{
                    // if user doesn't own the background, redirect
                    req.flash("error", "You do not have the permission to do this");
                    res.redirect("back")
                }
            }
        })
    }else{
        // if not logged in, redirect
        req.flash("error", "You need to be logged in first");
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in first");
    res.redirect("/login");
}

module.exports = middlewareObj