const dotenv = require('dotenv').config()
const express = require('express')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const compression = require('compression')
const helmet = require('helmet')

mongoose.connect(process.env.DB_HOST, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongo connection error'))

const indexRouter = require('./routes/index');

const User = require('./models/user')
const Message = require('./models/message')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if(err){
                return done(err)
            }

            if(!user){
                return done(null, false, {message: 'Incorrect username'})
            }

            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Incorrect password'})
                }
            })

            return done(null, user)
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err, user)
    })
})

app.use(helmet())
app.use(compression())
app.use(session({secret: 'cats', resave: false, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

app.use('/', indexRouter)

app.listen(3000, () => console.log('app listening on port 3000'))