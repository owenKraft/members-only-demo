const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Message = require('../models/message')

const authController = require('../controllers/authController')
const msgController = require('../controllers/msgController')

// GET home page
router.get('/', (req,res) => 
    Message.find()
    .exec((err,list_msgs) => {
        if(err){return next(err)}

        res.render('index',{user: req.user, msg_list: list_msgs})
    })
)

// GET sign up page
router.get('/sign-up', authController.sign_up)

// POST sign up page
router.post('/sign-up', authController.sign_up_post)

// GET log in page
router.get('/log-in', authController.log_in)

// POST log in page
router.post('/log-in', authController.log_in_post)

// GET log out page
router.get('/log-out', authController.log_out)

// GET create message page
router.get('/create-message', msgController.create_msg)

// POST create message page
router.post('/create-message', msgController.create_msg_post)

module.exports = router