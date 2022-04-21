// import Module
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

// Connect to Mongodb
const connectDB = require("./database/db");

connectDB();

// import router
const categoryRouter = require('./router/categoryRouter')
const bankRouter = require('./router/bankRouter')
const itemRouter = require('./router/itemRouter')
const featureRouter = require('./router/featureRouter')
const infoRouter = require('./router/infoRouter')
const customerRouter = require('./router/customerRouter')
const bookingRouter = require('./router/bookingRouter')
const userRouter = require('./router/userRouter')
const dashboardRouter = require('./router/dashboardRouter')
const homeRouter = require('./router/homeRouter')

// Setting cors Morgan
app.use(cors());
app.use(logger("dev"));
// set up JSON
app.use(express.json())
// set Up urlencodeed
app.use(express.urlencoded({extended:false}))

//Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

// set up public file
app.use(express.static(path.join(__dirname, "public")));

// url
app.use('/api/category', categoryRouter)
app.use('/api/bank',bankRouter)
app.use('/api/item', itemRouter)
app.use('/api/item/feature', featureRouter)
app.use('/api/item/info', infoRouter)
app.use('/api/customer',customerRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/user', userRouter)
app.use('/api/dashboard', dashboardRouter)

// url client
app.use('/api/client', homeRouter)

// port
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(port, () => {
  console.log(`Server Running at http://localhost: ${port}`);
});
