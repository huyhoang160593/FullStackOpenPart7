const mongoose = require('mongoose')

// mongoose.set('useFindAndModify', false)

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
})

commentSchema.set('toJSON',{
  transform: (document,returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Comment',commentSchema)