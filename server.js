const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const favicon = require('serve-favicon');



// Assets
app.use(express.static('public'))
app.use(favicon(path.join(__dirname,'public','favicon.ico')))



app.get('/', (req, res) => {
    res.render('home')
})

// Set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))