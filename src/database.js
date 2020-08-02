//Connect to MongoDB
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://radulito19:<password>@cluster0.6fy7c.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err))