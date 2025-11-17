import mongoose, {Schema, Types} from "mongoose";
import { stringify } from "postcss";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";           // helps to encrypt password


const userSchema = new Schema(
    {

        username: {

            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {

            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {

            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,   // cloudinary url
            required: true,

        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "video"
            }
        ],

        password: {                     //Challange
            type: String,
            required: [true, 'password is required']
        },
        refreshToken: {
            type: String
        }



    },
    {timestamps: true}
)



userSchema.pre("save", async function (next) {                     // we use next in middleware to move program ahead
                                                                  // .pre is used to do some things like "save:to do an operation before saving"
    if(!this.isModifies("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()   
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToke = function(){              // generates an token which client uses and helps to authenticate
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {

            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToke = function(){
     jwt.sign(
        {
            _id: this._id,
          
        },
        process.env.ACCESS_TOKEN_SECRET,
        {

            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);