import { Schema, models, model } from "mongoose";

const OtpSchema = new Schema({
    phone:{
        type :String,
        required :true
    },
    code:{
        type:String,
        required:true
    },
    expTime:{
        type:Number,
        required :true
    }
})
const Otp = models.Otp || model('Otp',OtpSchema)
export default Otp;