const User = require('../models/user')
const Message = require('../models/message')

const async = require('async')
const {body,validationResult} = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// Handle create message GET
exports.create_msg = (req, res, next) => {
    if(req.user){
        res.render('create-message', {
            user: req.user
        })
    } else {
        res.redirect('/')
    }

}

// Handle create message POST
exports.create_msg_post = [
    body('title', 'A message title is required').trim().isLength({min: 1}).escape(),
    body('note', 'A message body is required').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req)

        const timestamp = new Date()
        function formatDate (timestamp) {

            // Create a date object from the timestamp
            let date = new Date(timestamp);
        
            // Create a list of names for the months
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',	'November', 'December'];
        
            // return a formatted date
            return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        
        }

        const msg = new Message(
            {
                title: req.body.title,
                body: req.body.note,
                username: req.user.username,
                timestamp: formatDate(timestamp)
            }
        )

        if(!errors.isEmpty()){
            res.render('create-message', {user: req.user})
        } else {
            msg.save(err => {
                if(err){
                    return next(err)
                }
    
                res.redirect('/')
            })
        }

        // const msg = new Message({
        //     title: req.body.title,
        //     body: req.body.note,
        //     username: req.user.username,
        //     timestamp: formatDate(timestamp)
        // }).save(err => {
        //     if(err){
        //         return next(err)
        //     }

        //     res.redirect('/')
        // })
    }
]