import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";   // middleware "mujhse milke jana"
const router = Router()

router.route("/register").post(          // injected middleware
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        
        },
        {
            name: "cover image",
            maxCount: 1
        }
    ]),

    registerUser)

export default router