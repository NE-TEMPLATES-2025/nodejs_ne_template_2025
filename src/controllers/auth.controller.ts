import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import { InitiateAccountVerificationDto, InitiateResetPasswordDto, LoginDto, ResetPasswordDto, VerifyAccountDto } from "../dtos";
import * as bcrypt from 'bcryptjs'
import { createToken, createTransporter } from "../utils";
import { apiResponse } from "../response/ApiResponse";



    const login =async(req:Request, res: Response) =>{
        const request= req.body as LoginDto

        try {
            
            const user= await prisma.user.findUnique({
                where:{
                    email: request.email
                }
            })
            if(!user) throw new Error(`Invalid credentials`);
            const matches= await bcrypt.compare(request.password,user.password);
            if(!matches) throw new Error(`Invalid credentials`)

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

     try {
        
        const request= req.body as InitiateAccountVerificationDto;
        const user= await prisma.user.findUnique({
            where:{
                email: request.email
            }
        })
        if(!user) throw new Error("User not found, please try with a registered email")

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.user.update({
            where:{
                email: user.email
            },
            data:{
                verificationCode,
                verificationStatus:"PENDING",
                verificationExpires: new Date( Date.now() + 600000)
            }
        })
        // Then send the email

        const transporter= createTransporter();
        
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:user.email,
            subject: "Account Verification Request",
            text: "Account Verification Request",
            html:`
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>Veify you Account</h2>
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>Please use the following code to verify your account</p>
                <h3 style="color: #2d89ef;">${verificationCode}</h3>
                <p>This code will expire in 10 minutes.</p>
                <br />
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <p>— Your Company Name</p>
            </div>
            `
        },(err,info)=>{
            if(err){
                console.log(err)
            }
            console.log("Email sent successfully to "+ user.email);
            
        })

        res.status(201).json(apiResponse({
            message:"Account verification initated successfully",
            status:201}))

        
     } catch (error) {
        console.log("error ",error);
        throw new Error(`Error while initiating account verification: ${error}`)
        
     }
    }


    const verifyAccount=async (req:Request, res: Response)=>{
        const request= req.body as VerifyAccountDto;
        try {
            
            const user= await prisma.user.findFirst({
                where:{
                    verificationCode: request.verificationCode
                }
            })

            if(!user) throw new Error("Invalid or expired code ")
            const isCodeExpired= user.verificationExpires && user.verificationExpires.getTime() < Date.now();

            if(isCodeExpired) throw new Error("Your code has expired, please try generating a new one");


            await prisma.user.update({
                where:{
                    email: user.email
                },
                data:{
                    verificationStatus:"VERIFIED"
                }
            })
           
            
            
            const transporter= createTransporter();
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to:user.email,
                subject: "Account Verified Successfully",
                text: "Account Verification Successfull",
                html:`
                
                <div style="fontFamily:Arial, sans-serif;">
                
                <p>Account Verification Successful</p>
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>You have successfully verified your account, please continue using the app</p>
                </dv>

                `
            },(err,info)=>{
                if(err){
                    console.log(err)
                }
                console.log("Email sent successfully to "+ user.email);
                
            })
    
    
            res.status(201).json(apiResponse({
                message:"Account verification completed successfully",
                status:201}))
    
            
        } catch (error) {
            console.log("error: ",error)
            throw new Error(`Error: ${error}`)
        }
    }

    const initiateResetPassword=async (req:Request, res: Response)=>{

        const request= req.body as InitiateResetPasswordDto;
        try {
        const user= await prisma.user.findUnique({
            where:{
                email: request.email
            }
        })
        if(!user) throw new Error("User not found, please try with a registered email")

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.user.update({
            where:{
                email: user.email
            },
            data:{
                passwordResetCode: resetCode,
                passwordResetStatus:"PENDING",
                passwordResetExpires:new Date( Date.now() + 600000)
            }
        })

        const transporter= createTransporter();
        
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:user.email,
            subject: "Password Reset Request",
            text: "Password Reset Request",
            html:`
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>Reset your password</h2>
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>Please use the following code to reset your password</p>
                <h3 style="color: #2d89ef;">${resetCode}</h3>
                <p>This code will expire in 10 minutes.</p>
                <br />
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <p>— Your Company Name</p>
            </div>
            `,
            
        },(err,info)=>{
            if(err){
                console.log(err)
            }
            console.log("Email sent successfully to "+ user.email);
            
        })


        res.status(201).json(apiResponse({
            message:"password reset initated successfully",
            status:201}))

        } catch (error) {
            console.log("error: ",error)
            throw new Error(`Error: ${error}`)   
        }
    }

    const resetPassword =async(req:Request, res: Response)=>{
        const request= req.body as ResetPasswordDto
      try {
        const user= await prisma.user.findUnique({
            where:{
                email: request.email
            }
        })
        if(!user) throw new Error("User not found, please try with a registered email")

        
        const isCodeExpired= user.passwordResetExpires && user.passwordResetExpires.getTime() < Date.now();

        if(isCodeExpired) throw new Error("Your code has expired, please try generating a new one");

        const salt= await bcrypt.genSalt(10);
        const newHashedPassword= await bcrypt.hash(request.newPassword,salt);
        await prisma.user.update({
            where:{
                email:user.email
            },
            data:{
                password: newHashedPassword,
                passwordResetStatus:"IDLE"
            }
        })

    



        const transporter= createTransporter();
        
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:user.email,
            subject: "Password Reset Successfull",
            text: "Password Reset Successfull",
            html:`
            
              <div style="fontFamily:Arial, sans-serif;">
                
                <p>Password reset Successful</p>
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>You have successfully reset your password, please continue using the app</p>
                </dv>
            `,
            
        },(err,info)=>{
            if(err){
                console.log(err)
            }
            console.log("Email sent successfully to "+ user.email);
            
        })


        res.status(201).json(apiResponse({
            message:"password reset completed successfully",
            status:201}))

        
      } catch (error) {
        console.log("error: ",error)
        throw new Error(`Error: ${error}`)   
      }  
    }
    

export default {
    login,
    initiateAccountVerification,
    verifyAccount,
    initiateResetPassword,
    resetPassword
}