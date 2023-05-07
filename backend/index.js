const express=require('express');
const app=express();
app.use(express.json());
const http=require('http');
const  connection  = require('./db');

const {productRoute}=require('./Routes/product.routes')
const {cartRoutes}=require('./Routes/cart.routes')
const {userRouter}=require("./Routes/User.routes")
const {authenticate}=require("./middlewares/authenticate.middleware")

const {adminrouter}=require("./routes/admin.route")

const passport=require("./google_auth")


require("dotenv").config();
const cors=require("cors")


app.use(express.json());
app.use(cors())

const server=http.createServer(app);

app.use("/product",productRoute)

app.use("/users",userRouter)
//app.use(authenticate)
app.use("/cart",authenticate,cartRoutes)

app.use("/admin",adminrouter)


app.get("/", (req,res)=>{
    res.send("okkkkkkk")
})


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session:false }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect("http://127.0.0.1:5501/frontend/html/index.html");

  });

  app.get("/login",(req,res)=>{
    res.sendFile(__dirname+ "/index.html")
    })



server.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error.message)
    }
    console.log("connected to server")
})