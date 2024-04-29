import { Router } from 'express';
import authRouter from './auth.route.js';
import forgetPasswordRouter from './forgetPassword.route.js';
import userRouter from "./user.route.js";
import lookupDataRouter from './lookupData.route.js'
const router = new Router();

router.use('/', authRouter);
router.use('/', forgetPasswordRouter);
router.use("/user", userRouter);
router.use('/', lookupDataRouter)

export default router;
