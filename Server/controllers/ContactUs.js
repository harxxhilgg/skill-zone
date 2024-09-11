import mailsender from "../utils/mailSender.js";
import { respond } from "../utils/response.js";
import { contactUsEmail } from "../mail/templates/contactFormRes.js";

export const contactUsController = async (req,res) => {
    const {email,firstname,lastname,message,phoneNo,contrycode} = req.body;
    console.log(req.body)
    try{
        const emailRes = await mailsender(email,"Your data send successfully",contactUsEmail(email,firstname,lastname,message,phoneNo,contrycode)
        )
        console.log("Email Res",emailRes)
        return respond(res,"Email send successfully",200,true)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while",500,false)
    }
}