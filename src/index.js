const express = require('express')
const path = require('path')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

//inicializaciones
const app = express()
require('./database')

//settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs',exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('method'))
app.use(session({
    secret:'SecretApp',
    resave: true,
    saveUninitialized: true
}))

//gobal-variables

//routes
app.use(require('./routes/index'))
app.use(require('./routes/users'))
app.use(require('./routes/notes'))

//static files
app.use(express.static(path.join(__dirname,'public')))

//server init
app.listen(app.get('port'), () =>{
    console.log('server: ON, port: ',app.get('port'))
})