import { Request,Response } from "express";
import {PrismaClient, users} from "@prisma/client"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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


// In your userControllers.ts

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

// In your userControllers.ts

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




export{addUser,getAllUsers,login,getUserByEmail,getUserById,getAllEngineers}