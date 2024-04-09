"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userStudyController_1 = require("../controller/userStudyController");
const router = express_1.default.Router();
router.get("/users/:userId", userStudyController_1.getUserStudies);
router.get("/studies/:studyId", userStudyController_1.getStudyUsers);
exports.default = router;
