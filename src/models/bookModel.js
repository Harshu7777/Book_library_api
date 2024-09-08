const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    author:{
        type:String,
        require : true
    },
    description:{
        type : String
    },
    price:{
        type : Number,
        require : true
    },  
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
},{
    timestamps: true
})

const Book = mongoose.model('Book' , bookSchema);

module.exports = Book