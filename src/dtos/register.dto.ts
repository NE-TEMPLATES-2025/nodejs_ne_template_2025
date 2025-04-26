

import { IsString, IsEmail, Matches, IsNotEmpty, Min } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Min(3,{message:"Firstname must have atleast 3 characters"})
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Min(3,{message:"Firstname must have atleast 3 characters"})
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message: 'Password must have at least 8 characters, one symbol, one number, and one uppercase letter.',
    })
    password: string;


    @IsString()
    @Matches(/^\+250\d{9}$/, {
        message: 'Mobile number must start with "+250" and have 9 digits after that.',
    })
    phoneNumber: string;
}
