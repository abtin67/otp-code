import Otp from "@/models/Otp"
import ConnectDB from "@/utils/connectDB"

export default async function handler(req , res){
   

    const {phone , code} = req.body 

    const isValidCode = await Otp.findOne({phone:phone , code:code})
    
    if(!isValidCode){
        return res.status(401).json({message:"otp code is not valide"})
    }

    const isExpired = new Date().getTime() > isValidCode.expTime
    if(isExpired){
        return res.status(410).json({message:"otp code expired"})
    }

    return res.status(202).json({message:"otp code accepted"})
    
}