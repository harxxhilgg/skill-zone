import { User } from "../models/User.js";
import mailsender from "../utils/mailSender.js";
import { respond } from "../utils/response.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const resetPasswordToken = async (req,res) => {
   try{
        const email = req.body.email;
        const user = await User.findOne({email:email});
        if(!user) {
            return respond(res,"Your email is not registered",401,false);
        }
        const token = crypto.randomBytes(20).toString("hex");
        const updateDetails = await User.findOneAndUpdate(
            {email:email},{
            token:token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },
        {new:true});
        const url = `http://localhost:3000/update-password/${token}`
        await mailsender(email,"password reset Link",`Password Reset Link: ${url}`);

        respond(res,"Email sent successfully, please check your email and change your password",200,true);
   } 
   catch(error) {
    console.log(error)
    respond(res,"Something went worng while reset the password link, Please try again",500,false)
   }
}

export const resetPasswordUpdate = async (req,res) => {
    try {
        const {password,confirmPassword,token} = req.body;
        if(password !== confirmPassword) {
            return respond(res,"Passwrod not matcing",401,false)
        }

        const userDetails = await User.findOne({token:token});
        if(!userDetails) {
            return respond(res,"Token is Invalid",401,false);
        }
        if(userDetails.resetPasswordExpires < Date.now()) {
            return respond(res,"Token is expired",401,false);
        }
        const hashPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashPassword},
            {new:true}
            );
        
        respond(res,"Password reset successfully",200,true);
    }
    catch(error){
        console.log(error)
        respond(res,"Something went wrong while changing the password",500,false)
    }
};

