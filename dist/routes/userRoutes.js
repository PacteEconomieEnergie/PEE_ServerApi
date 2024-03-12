"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controller/userControllers");
const userValidatore_1 = require("../middleware/userValidatore");
const router = express_1.default.Router();
router.post("/add", (0, userValidatore_1.userValidationRules)(), userValidatore_1.validate, userControllers_1.addUser);
router.post("/login", (0, userValidatore_1.loginValidationRules)(), userValidatore_1.validate, userControllers_1.login);
router.get('/', userControllers_1.getAllUsers);
router.get('/email/:Email', userControllers_1.getUserByEmail);
router.get('/id/:id', userControllers_1.getUserById);
router.get("/engineers", userControllers_1.getAllEngineers);
exports.default = router;
