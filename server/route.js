import express from "express";
import { createUserAPI } from "./controller.js";

const router = express.Router();

router.post("/createUserAPI", createUserAPI);

export default router;
