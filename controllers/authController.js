const User = require('../models/user')
const Message = require('../models/message')

const async = require('async')
const {body,validationResult} = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')


// Handle sign up page GET
exports.sign_up = (req, res, next) => {
    res.render('sign-up', {
        user: req.user,
        authType: 'Sign up'
    })
}

// Handle sign up page POST
exports.sign_up_post = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err){
            return next(err)
        }

        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            status: 'member'
        }).save(err => {
            if(err){
                return next(err)
            }

            res.redirect('/')
        })
    })
}

// Handle log in page GET
exports.log_in = (req, res, next) => {
    res.render('log-in', {
        user: req.user,
        authType: 'Log in'
    })
}

// Handle login POST
exports.log_in_post = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    })(req, res, next)
    // ^^ the (req, res, next) appended to passport.authenticate function is due to passport.authenticate function itself returns a function that must be invoked. I don't really understand it  ¯\_(ツ)_/¯, but without (req, res, next) added at end, the request timeouts. More info at https://stackoverflow.com/questions/43834707/passport-authenticate-doesnt-redirect & https://stackoverflow.com/questions/50364757/how-to-use-passport-middleware-in-a-controller
}

// Handle logout page GET
exports.log_out = (req, res, next) => {
    req.logout()
    res.redirect('/')
}