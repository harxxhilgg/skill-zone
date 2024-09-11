import {User} from "../models/User.js"
import {Otp} from "../models/Otp.js"
import otpGenerator from "otp-generator";
import { respond } from "../utils/response.js";
import bcrypt from "bcrypt"
import { Profile } from "../models/Profile.js";
import {emailVerificationOtptemplate} from "../mail/templates/emailVerificationTemplate.js"
import jwt  from "jsonwebtoken";
import dotenv from "dotenv" 
import mailsender from "../utils/mailSender.js";
import {passwordUpdate} from "../mail/templates/passwordUpdate.js"

dotenv.config()

// Send OTP For Email Verification
export const sendOTP = async (req,res) => {

    try {
        const {email} = req.body;
        console.log(email)

        // Check if user is already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({email});
    
        // If user found with provided email
        if (checkUserPresent) {
            return respond(res,"User alredy exist",400,false)
        }

        //otp generator
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("Otp generated: ", otp)

        //check the otp is unique or not
        let result = await Otp.findOne({otp:otp});

        //generate the otp till the unique otp we get
        // while(result) {
        //     otp = otpGenerator(6,{
        //         upperCaseAlphabets: false,
        //         lowerCaseAlphabets: false,
        //         specialChars: false,
        //     })
        //     result = await otp.findOne({otp:otp});
        // }

        while (result) {
            otp = otpGenerator.generate(6, {
              upperCaseAlphabets: false,
            })
          }

        //for storing into database
        const otpPayload = {email,otp};

        const otpBody = await Otp.create(otpPayload);
        console.log(otpBody);

        const emailbody = emailVerificationOtptemplate(otp);
        mailsender(email,"your otp",emailbody)

        return respond(res,"Otp send successfully",200,true,otp)
    }
    catch(error) {
        console.log(error);
        console.log(error.message)
        return respond(res,"something went wrong while sending the otp",500,false)
    }   
}

export const signUp = async (req,res) => {
    try{

        // Destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
    
        // Check if All Details are there or not
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return respond(res,"All fields are required while signup",400,false)
        }
    
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            respond(res,"Passwords do not Match",400,false)
        }
    
        // Check if user already exists
        const existinguser = await User.findOne({email});
        if(existinguser) {
            respond(res,"User is already exist",400,false)
        }
    
        // Find the most recent OTP for the email
        const recentOtp = await Otp.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp)
        if(recentOtp.length === 0) {
            // OTP not found for the email
           return respond(res,"Otp not found",400,false)
        }else if(otp !== recentOtp[0].otp) {
            // Invalid OTP
           return respond(res,"Invalid Otp",400,false)
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password,10);
    
        // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
    
        //create the user
        const user = await User.create({
            firstName,lastName,email,contactNumber,password:hashedPassword,accountType,additionalDetails: profileDetails._id,image:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        respond(res,"User  is registerd Successfully",200,true)
    }
    catch(error) {
        console.log(error)
        console.log(error.message)
        respond(res,"User cannot be  registerd successfully, Please try again",500,false)
    }
}

export const login = async (req,res) => {
    try{
        // Get email and password from request body
        const {email,password} = req.body;

        // Check if email or password is missing
        if(!email || !password) {
            return respond(res,"All fields are required",403,false)
        }

        // Find user with provided email
        const user = await User.findOne({email}).populate("additionalDetails").exec();
        // If user not found with provided email
        if(!user) {
            return respond(res,"user is not registerd, Please signup first",404,false)
        }

        // Generate JWT token and Compare Password
        if(await bcrypt.compare(password,user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET, {
                expiresIn: "10h",
            });

            // Save token to user document in database
            user.token = token;
            user.password = undefined

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3*2*60*60*1000),
                httpOnly: true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else {
            return respond(res,"Password is incorrect", 401,false)
        }
    }
    catch(error){
        console.log(error);
        respond(res,"Login failure, Please try againn",500,false)
    }
};

export const changePassword = async (req,res) => {
    try{
        const userDetails = await User.findById(req.user.id)

        const {oldPassword,newPassword} = req.body

        const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password)

        if (!isPasswordMatch) {
            return respond(res,"The password is incorrect",401,false)
        }

        const encryptedPassword = await bcrypt.hash (newPassword,10)
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,{password:encryptedPassword},{new:true})

        try {
            const emailResponse = await mailsender(updatedUserDetails.email,"Password for your account has been updated",passwordUpdate(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
              ))
            //   console.log("Email sent successfully:",emailResponse.response)
        }
        catch(error) {
            console.log(error)
            return respond(res,"Error occured while sending the email",500,false)
        }

        return respond(res,"Password Updated Successfully",200,true)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while changing the password",500,false)
    }
}

