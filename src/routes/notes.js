const router = require('express').Router()

const Note = require('../models/Note')
const {isAuthenticated} = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req,res) =>{
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated ,async(req,res) =>{
    const { title, description } = req.body
    const errors = []
    if (!title) {
        errors.push({text: 'Please Write a Title.'})
    }
    if (!description) {
        errors.push({text: 'Please Write a Description'});
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    } else {
        const noteToAdd = new Note({title, description});
        noteToAdd.idUser = req.user.id
        await noteToAdd.save()
        req.flash('success_msg' , 'Note has been added')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated ,async(req,res) =>{
    const notes = await Note.find({idUser: req.user.id}).sort({date: 'desc'})
    res.render('notes/all-notes',{notes})
})

router.get('/notes/edit/:id', isAuthenticated ,async(req,res) =>{
    const noteToEdit= await Note.findById(req.params.id)
    res.render('notes/edit-note',noteToEdit)
})

router.put('/notes/edit-note/:id', isAuthenticated ,async(req,res) =>{
    const {title,description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title,description}) 
    req.flash('success_msg' , 'Note has been modified')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated ,async(req,res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg' , 'Note has been deleted')
    res.redirect('/notes')
})

module.exports = router