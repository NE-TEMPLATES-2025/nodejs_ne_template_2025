import jwt from "jsonwebtoken"


export const createToken= async(id:string) =>{
    const token =  jwt.sign({id:id},process.env.JWT_SECRET_KEY as string)
    return token;

}