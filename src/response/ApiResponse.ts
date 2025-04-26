import { ApiResponse } from "../interfaces";

export const apiResponse = ({message,status,data}: ApiResponse)=>{

    return {
        message,
        status,
        data
    }
}