import { Request, Response } from "express";
import { CreateEmployeeDto } from "../dtos";
import prisma from "../../prisma/prisma-client";
import { apiResponse } from "../response/ApiResponse";
import { validate } from "class-validator";
import { Prisma } from "../../generated/prisma";

const createEmployee= async(req:Request,res:Response) =>{

    const body= req.body as CreateEmployeeDto

    try {
        const errors= await validate(body);
        if(errors.length >0 ){
            res.status(400).json({
                message:"Validation failed",
                errors: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                  })),
            })
            return;
        }
        const existingEmployeeByEmail=await prisma.employee.findUnique({
            where:{
                email: body.email
            }
        })
        if(existingEmployeeByEmail) throw new Error(`Employee with email ${body.email}  already exists`)
        const existingEmployeeByNationalId=await prisma.employee.findUnique({
            where:{
                nationalId: body.nationalId
            }
        })
        if(existingEmployeeByNationalId) throw new Error(`Employee with national ${body.nationalId}  already exists`)

            const newEmployee= await prisma.employee.create({
                data: body
            })
            
    res.status(201).json(apiResponse({
        message:"Employee created successfully",
        status:201,
        data:newEmployee
    }))


    } catch (error) {
        console.error("Error: ",error)
        throw new Error(`Error while creating employee ${error}`)
    }
}

const getAllEmployees =async (req:Request,res:Response)=>{
    try {
        const employees= await prisma.employee.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc"
            },
            
        })
        res.status(200).json(apiResponse({
            message:"Employees Retrieved successfully",
            status:200,
            data:employees
        }))
    } catch (error) {
        throw new Error(`Error: ${error}`)
    }
}

const searchEmployees = async (req:Request,res:Response)=>{
    const queryStr= String(req.query.query || '');
    try {

        const employees=await prisma.employee.findMany({
            where:{
                OR: [
                    { email: { contains: queryStr, mode: 'insensitive' } },
                    { firstName: { contains: queryStr, mode: 'insensitive' } },
                    { lastName: { contains: queryStr, mode: 'insensitive' } },
                    { nationalId: { contains: queryStr, mode: 'insensitive' } },
                  ],
            },
            orderBy:{
                createdAt: "desc"
            },
            skip:0,
            take:5
        
        })

        res.status(200).json(apiResponse({
            message:"Search successfully",
            status:200,
            data:employees
        }))
    } catch (error) {
        console.error("Error",error)
    }
}


const employeeController={
    createEmployee,
    getAllEmployees,
    searchEmployees
}

export default employeeController