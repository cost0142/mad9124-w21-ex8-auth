import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const saltRounds = 14
const schema = new mongoose.Schema({
  firstName: { type: String, trim: true, maxlength: 64, required: true },
  lastName: { type: String, trim: true, maxlength: 64 },
  email: {
    type: String,
    trim: true,
    maxlength: 512,
    required: true,
    unique: true,
  },
  password: { type: String, trim: true, maxlength: 70, required: true },
})
schema.methods.generateAuthToken = function () {
  const payload = { user: { _id: this._id } }
  return jwt.sign(payload, 'superSecretKey')
  // NEVER USE THIS KEY IN A REAL APP!!!!!!! ^ BAD!
  // THE KEY NEVER GOES IN YOUR SOURCE CODE!
}
schema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}
schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email })
  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const hashedPassword = user ? user.password : badHash
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)
  return passwordDidMatch ? user : null
}
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})
const Model = mongoose.model('User', schema)
export default Model
