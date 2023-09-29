import express from "express";
import { postSendOTP } from "./controller.js";

const router = express.Router();

router.post("/sendotp", postSendOTP);

export default router;
