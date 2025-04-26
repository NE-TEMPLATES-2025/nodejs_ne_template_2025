import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import prisma from "../../prisma/prisma-client";
import { LoginDto } from "../dtos";
import * as bcrypt from 'bcryptjs'

import { createToken } from "../utils";
import { apiResponse } from "../response/ApiResponse";




    const login =async(req:Request, res: Response)=>{
        const request= req.body as LoginDto

        try {
            
            const user= await prisma.user.findUnique({
                where:{
                    email: request.email
                }
            })
            if(!user) throw new Error(`Invalid credentials, One or more field are incorrect`);

            const matches= await bcrypt.compare(request.password,user.password);
            if(!matches) throw new Error(`Invalid credentials, One or more field are incorrect`)

          const token= await createToken(user.id);
          res.status(200).json(
            apiResponse({message:"User Successfully logged in",status:200,data:{user,token}})
          )


        } catch (error) {
            console.log("error ",error)
            throw new Error(`Error while logging in ${error}`)
        }

    }

    const initiateAccountVerification =async(req:Request, res: Response)=>{

    }
    const verifyAccount=async (req:Request, res: Response)=>{
        
    }

    const initiateResetPassword=async (req:Request, res: Response)=>{

    }
    const resetPassword =async(req:Request, res: Response)=>{
        
    }
    

export default {
    login,
    initiateAccountVerification,
    verifyAccount,
    initiateResetPassword,
    resetPassword
}