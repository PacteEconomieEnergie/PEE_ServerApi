import { prisma,files_Type } from "../utils/prismaClient";


export class LeadsService {

    public async createUtilisateur(leadData: any, file: any){
        if (!file) {
            throw new Error('File is missing');
        }
        // Debugging output
        console.log('Available types:', Object.values(files_Type));
        const { type, ...restLeadData } = leadData; 
         console.log('Received file type:', type);
        if (!Object.values(files_Type).includes(type)) {
           
            
            throw new Error('Invalid file type');
        }
        
        const newLead = await prisma.lead.create({
            data: {
                ...restLeadData,
                pieceJointe: { // Assuming 'pieceJointe' is the correct relation field name
                    create: {
                        FileName: file.originalname,
                        FileType: file.mimetype,
                        FileContent: file.buffer,
                        uploadDate: new Date(),
                        FileSize: file.size,
                        Type: type, // assuming you're passing the file type from the client
                    }
                } 
            },
            include: {
                pieceJointe: true, // Optionally include the file data in the response
            }
        });
    
        return "newLead;"
    }

    public async getAllUtilisateurs(){
        return await prisma.lead.findMany({
            include:{pieceJointe:{select:{
                idFiles:true,
                Type:true
            }}}
        })
    }

    public async getUtilisateurById(id:number){
        return await prisma.lead.findUnique({
            where:{id}
        })
    }
    public async getUtilisateurByEmail(email:string){
        return await prisma.lead.findUnique({
            where:{mail:email}
        })
    }
}