const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        
        const conn = await mongoose.connect('mongodb+srv://hanik:wpu123@data.ii34z.mongodb.net/bookingDB?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify:false
        })

        console.log(`database connected : ${conn.connection.host}`)

    } catch (error) {
        console.error()
        process.exit(1)
    }
} 


module.exports = connectDB