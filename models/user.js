var mongoose = require('mongoose');  

var userSchema = mongoose.Schema({  
    email: String,
    id: String,
    name: String 
});
userSchema.index({ id: 1 }, { unique: true });
module.exports = mongoose.model('User', userSchema);  