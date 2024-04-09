"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeDeRetouche = void 0;
// src/utils/typeGuards.ts
const client_1 = require("@prisma/client");
function isTypeDeRetouche(value) {
    return Object.values(client_1.studies_TypeDeRetouche).includes(value);
}
exports.isTypeDeRetouche = isTypeDeRetouche;
