import Otp from "@/models/Otp";
import ConnectDB from "@/utils/connectDB";

export default async function handler(req , res){

    const {phone}= req.body;
    const code = Math.floor(Math.random()*90000)+1000
    const expTime = new Date().getTime() + (30 * 1000)
    `@otp-code-ei18-git-main-abtin67s-projects.vercel.app #${code}`;
    

    try{
        const apiRes = await fetch('http://ippanel.com/api/select',{
            method:"POST",
            body:JSON.stringify({
                 op:"pattern",
                 user:"u09038308519",
			    	pass:"Faraz@2153352620036798",
					fromNum:"3000505",
					toNum:phone,
					patternCode:"bcs651d2vcjs86e",
					inputData:[
							{code}
						]

            })
        })
        if(apiRes.status == 200){

            await ConnectDB()
            res.status(200).json({message:'code send successfully'})
            await Otp.create({phone , code , expTime})
        }else{
            res.status(apiRes.status).json({message:apiRes.statusText})
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
    
}
//http://ippanel.com/api/select
//  op:"pattern",
// 					user:"u09038308519",
// 					pass:"Faraz@2153352620036798",
// 					fromNum:"3000505",
// 					toNum:phone,
// 					patternCode:"bcs651d2vcjs86e",
// 					inputData:[
// 							{code}
// 						]
