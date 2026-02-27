import express from 'express';
import { register, login } from '../controllers/authController.js';
import { resetPassword } from '../controllers/resetPasswordController.js';
import { forgotPassword } from '../controllers/forgotPasswordController.js';


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;