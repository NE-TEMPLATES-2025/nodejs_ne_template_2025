import {  IsEmail, IsNotEmpty, IsString, Matches, Min} from 'class-validator'

export class CreateEmployeeDto{


  @IsString()
  @Min(3,{message:"Firstname must be atleast 3 characters"})
  @IsNotEmpty({message:"Firstname is required"})
  firstName: string;

  @IsString()
  @Min(3,{message:"Lastname must be atleast 3 characters"})
  @IsNotEmpty({message:"Lastname is required"})
  lastName: string;

  @IsString()
  @IsNotEmpty({message:"Email is required"})
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^1[0-9]{15}$/)
  nationalId: string;

  @IsString({message:"Department is required"})
  @IsNotEmpty({message:"Department is required"})
  department: string;

  @IsString({message:"Position is required"})
  @IsNotEmpty({message:"Position is required"})
  position: string;

  @IsString()
  @IsNotEmpty({message:"Manufacturer is required"})

  laptopManufacturer: string;

  @IsString()
  @IsNotEmpty({message:"Laptop model is required"})
  laptopModel: string;

  @IsString()
  @IsNotEmpty({message:"Serial number is required"})
  serialNumber: string;
}