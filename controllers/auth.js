const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({email: req.body.email})

  if (candidate) {
    //if user is exist we will check password
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult) {
      //in this case we generate token
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60})

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Not right password'
      })
    }
  } else {
    //User is not exist - error
    res.status(404).json({
      message: 'User with this email is not exist'
    })
  }
}


module.exports.register = async function (req, res) {
  //we check if user is exist in DB and with help of mongoose find it, if email and password are the same with req.body
  const candidate = await User.findOne({email: req.body.email})

  if (candidate) {
    //user is exist, must to show an error
    res.status(409).json({
      message: 'Email is occupated.'
    })
  } else {
    //create user
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    })
    try {
      await user.save()
      res.status(201).json(user)
    } catch (e) {
      //working with error
      errorHandler(res, e)
    }
  }
}
