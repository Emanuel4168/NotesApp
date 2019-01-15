const router = require('express').Router()

const passport = require('passport')
const User = require('../models/User')
const {isAuthenticated} = require('../helpers/auth')

router.get('/users/signin', (req,res) =>{
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', (req,res) =>{
    res.render('users/signup')
})

router.post('/users/signup', async(req,res) =>{
    const {name,email,password,confirmPassword} = req.body
    const errors = []
    if(name.length <= 0){
        errors.push({text: 'We need to know your name'})
    }
    if(email.length <= 0){
        errors.push({text: 'We need to know your name'})
    }
    if(password !== confirmPassword){
        errors.push({text: 'Passwords not match'})
    }
    if(password.length < 4 ){
        errors.push({text: 'Password must have at least 4 characters'})
    }
    if(errors.length > 0){
        res.render('users/signup', {errors,name,email,password,confirmPassword})
    } else{
        const emailExist = await User.findOne({email: email})
        if(emailExist){
            req.flash('error_msg' , 'It seems like you are a member already')
            res.redirect('/users/signup')
        }
        const newUser = new User({name,email,password})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg','Thanks for join us!')
        res.redirect('/users/signin')
    }
})

router.get('/users/logout/' , (req,res) =>{
    req.logOut();
    res.redirect('/')
})



module.exports = router