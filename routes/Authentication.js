import express from "express";
import bodyParser from "body-parser";

// import controllers for Authentication
import * as authControllers from "../controllers/Authentications.js";

// define router
const authRouter = express.Router();

authRouter.post("/register", authControllers.register);
authRouter.post("/login", authControllers.login);

export default authRouter;