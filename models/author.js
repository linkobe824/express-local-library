const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
})

AuthorSchema.virtual('name').get(function () {
  let fullname = ''
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`
  }
  return fullname
})

AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`
})

AuthorSchema.virtual('date_of_birth_formatted').get(function () {
  if (this.date_of_birth)
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    )
})

AuthorSchema.virtual('date_of_death_formatted').get(function () {
  if (this.date_of_death)
    return DateTime.fromJSDate(this.date_of_death).toLocaleString(
      DateTime.DATE_MED
    )
})

AuthorSchema.virtual('lifespan').get(function () {
  let birth = '',
    death = ''
  if (this.date_of_birth_formatted) birth = this.date_of_birth_formatted
  if (this.date_of_death_formatted) death = this.date_of_death_formatted
  return `${birth} - ${death}`
})

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate() /// formato 'yyyy-mm-dd'
})

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate() /// formato 'yyyy-mm-dd'
})

module.exports = mongoose.model('Author', AuthorSchema)
