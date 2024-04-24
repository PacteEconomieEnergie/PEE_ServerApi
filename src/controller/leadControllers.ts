import { Request,Response } from "express";
import { LeadsService } from "../services/utilisateurService";

export class LeadsControllers {
    private leadService:LeadsService
    constructor (){
        this.leadService=new LeadsService()
    }
    public  createLead=async(req: Request, res: Response)=> {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'File is missing.' });
            }


            const leadData = req.body;
            console.log(leadData);
            const newLead = await this.leadService.createUtilisateur(leadData, file);
            res.status(201).json(newLead);
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ message: error });
        }
    } 
    public  getAllLeads=async(req: Request, res: Response)=> {
        try {
            const leads = await this.leadService.getAllUtilisateurs();
            
            
            res.json(leads).status(200);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
    public  getLeadById=async(req: Request, res: Response)=> {
        try {
            const id = parseInt(req.params.id);
            const lead = await this.leadService.getUtilisateurById(id);
            if (lead) {
                res.json(lead);
            } else {
                res.status(404).json({ message: 'Lead not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
    public  getLeadByEmail=async(req: Request, res: Response)=> {
        try {
            const email = req.params.email;
            const lead = await this.leadService.getUtilisateurByEmail(email);
            if (lead) {
                res.json(lead);
            } else {
                res.status(404).json({ message: 'Lead not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error});
        }
    }
}
