import mongoose from "mongoose";
import mailsender from "../utils/mailSender.js";
import { emailVerificationOtptemplate } from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new mongoose.Schema({
    email : {
        type: String,
        required: String,
    },
    otp: {
        type: String,
        required :true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60*5, // The document will be automatically deleted after 5 minutes of its creation time
    }, 
})

// Define a function to send emails
async function sendVerificationEmail(email,otp) {
    try{
        const mailResponse = await mailsender(email,"Verification Email fromm StudyNotion", emailVerificationOtptemplate(otp));
        console.log("Email Sent Successfully: ",mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails:", error);
        throw error;
    }
}

// Define a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function(next) {
    

    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	
	next();
})

export const Otp = mongoose.model("Otp", otpSchema);