import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res)=>{
   // steps to register a user 
   //step1 get details from frontend.
   //step2 validation - not empty
   //step3 check if user already exists: username, email
   //step4 check for images, check for avtar
   //step5 upload them to cloudinary, avatar 

   // create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation 
   // return response

  const {fullName,email, username, password} = req.body                // step1
  console.log("email: ",email);

//   if(fullName === ""){                                    // bigenner 
//     throw new ApiError(400,"fullname is required")
//   }

    if(                                                               // step2
        [fullName, email, username, password].some((field)=> field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({                              //step3
        $or : [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409," User with username already exist")
    }
                                                                      // step4
   const avatarLocalPath =  req.files?.avatar[0]?.path;
   const coverImageLocalPath =  req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
   }


   const avatar = await uploadOnCloudinary(avatarLocalPath)          // step5
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar file is required")
   }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowercase()
   })

   const createdUser =   await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500, "Somthing went wrong while registering user")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
   )



})




export {registerUser,}