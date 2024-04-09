import { prisma } from "../utils/prismaClient";


export class UtilisateurService {

    public async createUtilisateur(data:any){
        return await prisma.utilisateurs.create({data:data})
    }

    public async getAllUtilisateurs(){
        return await prisma.utilisateurs.findMany()
    }

    public async getUtilisateurById(id:number){
        return await prisma.utilisateurs.findUnique({
            where:{id}
        })
    }
    public async getUtilisateurByEmail(email:string){
        return await prisma.utilisateurs.findUnique({
            where:{mail:email}
        })
    }
}