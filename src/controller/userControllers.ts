import { Request,Response } from "express";
import {PrismaClient, users} from "@prisma/client"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmailMiddleware } from "../middleware/nodemailer";
dotenv.config()
const prisma=new PrismaClient();

async function getAllUsers(req:Request,res:Response) {
    try{
        const allUsers = await prisma.users.findMany()
        res.json(allUsers)
    }catch(error){
        res.status(500).json({error:'Failed to load users'})
    }
    
}  
async function addUser(req:Request,res:Response) {
    
    const {Email,Password,Role}:users=req.body
    
    
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(Password, salt);
        const newUser=await prisma.users.create({
            data:{
                Email,
                Password: hashedPassword,  
                Role
            }
        })
        const token = jwt.sign(
            { userId: newUser.UserID, Email: newUser.Email, role: newUser.Role },
            process.env.JWT_SECRET as string, 
            { expiresIn: process.env.expiresIn }
        );
        await prisma.users.update({
            where: { UserID: newUser.UserID },
            data: { Token: token }
        });

        // Return the JWT token in the response
        res.json({ token });
    }catch(error:any){
        res.status(500).json({ "error": "Error creating user", "details": error.message }) 
}
}
async  function login (req: Request, res: Response) {
        const {Email,Password}=req.body
        
        
        try {
            const user = await prisma.users.findUnique({
                where: { Email }
            })
           

if (!user) {
    return res.status(401).json({ error: 'Email or password is incorrect' });
}

if (bcrypt.compareSync(Password, user.Password)) {
    // Password comparison successful
    const token = jwt.sign(
        { userId: user.UserID, Email: user.Email, role: user.Role },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.expiresIn }
    );

    res.json({ token });
} else {
    // Password comparison failed
    return res.status(401).json({ error: 'Email or password is incorrect' });
}
        }catch (error:any) {
            res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
        }
}
async function updatePassword(req: Request, res: Response) {
    const {userId}=req.params
    const {  oldPassword, newPassword } = req.body;
    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const user = await prisma.users.findUnique({
            where: { UserID: numericUserId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (bcrypt.compareSync(oldPassword, user.Password)) {
            const salt = bcrypt.genSaltSync(10);
            const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

            await prisma.users.update({
                where: { UserID: numericUserId },
                data: { Password: hashedNewPassword }
            });

            // Optional: Invalidate any existing sessions or tokens if necessary

            // Re-authenticate the user by generating a new token
            const token = jwt.sign(
                { userId: user.UserID, Email: user.Email, role: user.Role },
                process.env.JWT_SECRET as string,
                { expiresIn: process.env.expiresIn }
            );

            // Return the new JWT token in the response
            res.json({ token });
        } else {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }
    } catch (error: any) {
        res.status(500).json({ error: 'An error occurred while updating password', details: error.message });
    }
}
async function getUserByEmail(req: Request, res: Response) {
    const { Email } = req.params; // Assuming you're passing the email as a URL parameter

    try {
        const user = await prisma.users.findUnique({
            where: { Email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}
async function getUserById(req: Request, res: Response) {
    const { id } = req.params; // Assuming you're passing the ID as a URL parameter

    try {
        const user = await prisma.users.findUnique({
            where: { UserID: parseInt(id) } // Assuming UserID is a numeric ID
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }  
}
async function getAllEngineers(req: Request, res: Response) {
    try {
        // Assuming 'CLIENT' is the role for clients in your users model
        const clients = await prisma.users.findMany({
            where: {
                Role: 'ENGINEER' // Replace 'CLIENT' with the actual role name used in your database
            },
            select: {
                UserID: true, 
                Email: true,
            }
        });

        res.json(clients);
    } catch (error:any) {
        res.status(500).json({ error: 'Failed to load clients', details: error.message });
    }
}
async function resetPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { Email: email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

      
          // Generate a 6-digit reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpire = new Date(Date.now() + 3600000);
        await prisma.users.update({
            where: { Email: email },
            data: { ResetPasswordCode: resetCode,
                ResetPasswordExpire: resetCodeExpire, }
        });

        await sendPasswordResetEmailMiddleware(email, resetCode);

        res.json({ message: "Reset code sent successfully" });
    } catch (error:any) {
        console.error('Error sending reset code:', error);
        res.status(500).json({ error: 'Failed to send reset code', details: error.message });
    }
}
async function verifyResetCode(req: Request, res: Response) {
    const { email, resetCode } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { Email: email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const currentTime = new Date();
        
        
        
        if (user.ResetPasswordCode === resetCode && user.ResetPasswordExpire && currentTime < user.ResetPasswordExpire) {
            // The code is verified, proceed to password reset
            
            
            // Here, implement a secure method to transition to the password reset step,
            // such as generating a temporary secure token or directly proceeding to the next step in a stateful app.
            res.status(200).json({ message: "Reset code verified successfully." });
        } else {
            res.status(400).json({ message: "Invalid or expired reset code." });
        }
    } catch (error: any) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ error: 'Failed to verify reset code', details: error.message });
    }
}
async function setNewPassword(req: Request, res: Response) {
    // Assuming email is sent in the request body, but it could also come from a session or token
    const { email, newPassword } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { Email: email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

        // Update the user's password
        await prisma.users.update({
            where: { Email: email },
            data: {
                Password: hashedNewPassword,
                // Optionally clear the reset code fields if you haven't already
                ResetPasswordCode: null,
                ResetPasswordExpire: null,
            }
        });

        res.json({ message: "Your password has been updated successfully." });
    } catch (error: any) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Failed to update password', details: error.message });
    }
}




export{addUser,getAllUsers,login,getUserByEmail,getUserById,getAllEngineers,updatePassword,resetPassword,verifyResetCode,setNewPassword}