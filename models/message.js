var mongoose = require('mongoose');  

var messageSchema = mongoose.Schema({  
    userId: String,
    id: String,
    snippet: String,
    date: Number
});

messageSchema.index({ id: 1 }, { unique: true });
module.exports = mongoose.model('Message', messageSchema);  