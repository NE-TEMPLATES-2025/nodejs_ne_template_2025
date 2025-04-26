import  express from 'express'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'
import authRouter from "./src/routes/auth.routes"
import userRouter from "./src/routes/user.routes"

dotenv.config();

const app :express.Application = express();
const port = process.env.PORT ? process.env.PORT : 5000


// Third-party middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE","OPTIONS"]
}))

// Route middleware



app.use("/api/v1/user",userRouter)
app.use("/api/v1/auth",authRouter)

// app.use("*",(req,res)=>{
//     console.log("Route not found")
//     throw new Error("Route not found")
// })



app.listen(port,()=>{
    console.log(`app running on port ${process.env.PORT}`);
    
})
