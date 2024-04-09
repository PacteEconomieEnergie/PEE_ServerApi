"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEngineers = exports.getUserById = exports.getUserByEmail = exports.login = exports.getAllUsers = exports.addUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allUsers = yield prisma.users.findMany();
            res.json(allUsers);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to load users' });
        }
    });
}
exports.getAllUsers = getAllUsers;
function addUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email, Password, Role } = req.body;
        try {
            const salt = bcrypt_1.default.genSaltSync(10);
            const hashedPassword = bcrypt_1.default.hashSync(Password, salt);
            const newUser = yield prisma.users.create({
                data: {
                    Email,
                    Password: hashedPassword,
                    Role
                }
            });
            const token = jsonwebtoken_1.default.sign({ userId: newUser.UserID, Email: newUser.Email, role: newUser.Role }, process.env.JWT_SECRET, { expiresIn: process.env.expiresIn });
            yield prisma.users.update({
                where: { UserID: newUser.UserID },
                data: { Token: token }
            });
            // Return the JWT token in the response
            res.json({ token });
        }
        catch (error) {
            res.status(500).json({ "error": "Error creating user", "details": error.message });
        }
    });
}
exports.addUser = addUser;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email, Password } = req.body;
        try {
            const user = yield prisma.users.findUnique({
                where: { Email }
            });
            if (!user) {
                return res.status(401).json({ error: 'Email or password is incorrect' });
            }
            if (bcrypt_1.default.compareSync(Password, user.Password)) {
                // Password comparison successful
                const token = jsonwebtoken_1.default.sign({ userId: user.UserID, Email: user.Email, role: user.Role }, process.env.JWT_SECRET, { expiresIn: process.env.expiresIn });
                res.json({ token });
            }
            else {
                // Password comparison failed
                return res.status(401).json({ error: 'Email or password is incorrect' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
        }
    });
}
exports.login = login;
// In your userControllers.ts
function getUserByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email } = req.params; // Assuming you're passing the email as a URL parameter
        try {
            const user = yield prisma.users.findUnique({
                where: { Email }
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
}
exports.getUserByEmail = getUserByEmail;
// In your userControllers.ts
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params; // Assuming you're passing the ID as a URL parameter
        try {
            const user = yield prisma.users.findUnique({
                where: { UserID: parseInt(id) } // Assuming UserID is a numeric ID
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });
}
exports.getUserById = getUserById;
function getAllEngineers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Assuming 'CLIENT' is the role for clients in your users model
            const clients = yield prisma.users.findMany({
                where: {
                    Role: 'ENGINEER' // Replace 'CLIENT' with the actual role name used in your database
                },
                select: {
                    UserID: true,
                    Email: true,
                }
            });
            res.json(clients);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to load clients', details: error.message });
        }
    });
}
exports.getAllEngineers = getAllEngineers;
