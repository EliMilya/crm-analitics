const express = require('express')
const authRoutes = require('./routes/auth')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const positionRoutes = require('./routes/position')
const orderRoutes = require('./routes/order')
const keys = require('./config/keys')
const passport = require('passport')
const app = express()

mongoose.connect(keys.mongoURI)
  .then(() => console.log('Mongo is working'))
  .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/analitycs', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/position', positionRoutes)
app.use('/api/order', orderRoutes)


module.exports = app
