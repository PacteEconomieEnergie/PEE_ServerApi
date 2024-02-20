// src/utils/typeGuards.ts
import { studies_TypeDeRetouche } from '@prisma/client';

export function isTypeDeRetouche(value: any): value is studies_TypeDeRetouche {
    return Object.values(studies_TypeDeRetouche).includes(value);
}
