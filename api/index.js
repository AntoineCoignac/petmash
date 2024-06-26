const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");
const imageRoute = require("./routes/image.route.js");

const port = process.env.PORT || 8080;
  
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: [
      /http:\/\/(127(\.\d){3}|localhost)/,
    ], credentials: true
  })
);
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

dotenv.config();
mongoose.set('strictQuery', true);

const connect = async ()=>{
  try{
      await mongoose.connect(process.env.MONGODEV);
      console.log("Connected to mongodb");
  } catch(error){
      console.log(error);
  }
};

app.get('/', function (req, res) {
    return res.send("Welcome to the Petmash API");
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/images", imageRoute);

app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!"

    return res.status(errorStatus).send(errorMessage);
})

app.listen(port, () => {
    connect();
    console.log(`Server listening on port ${port}`);
});
  
