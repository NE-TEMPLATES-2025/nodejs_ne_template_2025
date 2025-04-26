import { RegisterDto } from "../dtos";
import prisma from "../../prisma/prisma-client";
import * as bcrypt from 'bcryptjs'
export class UserService {

    async register(registerDto: RegisterDto){

        try {
            const existingUser= await prisma.user.findUnique({
                where:{
                    email: registerDto.email
                }
            })

            if(existingUser) throw new Error("User with the same email already exists, please trying using another one")
            
            const salt= await bcrypt.genSalt(10);
            const hashedPassword =await  bcrypt.hash(registerDto.password,salt);

            const user = await prisma.user.create({
                data:{
                    ...registerDto,
                    role: "USER"
                }
            })

           return user
            
        } catch (error) {
            console.log("error: ",error);
            throw new Error("Error while registering: "+error)
            
        }
    }

    async findUserByEmail(email: string){

    }
    async findUserByVerificationCode(){

    }
    async deleteUserAccount(userId: string){

    }
}