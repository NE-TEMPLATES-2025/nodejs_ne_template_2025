import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { RegisterDto } from "../dtos";
import { apiResponse } from "../response/ApiResponse";
import prisma from "../../prisma/prisma-client";
import * as bcrypt from 'bcryptjs'

 const  register =async (req:Request,res:Response)=>{

    const request = req.body as RegisterDto; 
    try {
        const existingUser= await prisma.user.findUnique({
            where:{
                email: request.email
            }
        })

        if(existingUser) throw new Error("User with the same email already exists, please trying using another one")
        
        const salt= await bcrypt.genSalt(10);
        const hashedPassword =await  bcrypt.hash(request.password,salt);

        request.password= hashedPassword;

        const user = await prisma.user.create({
            data:{
                ...request,
                role: "USER"
            }
        })

       res.status(201).json(
        apiResponse({message:"User Successfully registered",status:201,data: user})
       )
        
    } catch (error) {
        console.log("error: ",error);
        throw new Error("Error while registering: "+error)
        
    }
}

const findUserByVerificationCode = async(req:Request,res:Response) =>{

    try {
        const {verificationCode}= req.body 
        const user= await prisma.user.findFirst({
            where:{
                verificationCode
            }
        })

        if(!user) throw new Error("User not found");

        res.status(200).json(apiResponse({message:"User Retrieved Successfully",status:200,data:user}))
    } catch (error) {
        
    }

    
}


export default {
    register
}