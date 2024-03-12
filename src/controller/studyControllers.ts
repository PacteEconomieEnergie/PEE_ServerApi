import { Request,Response } from "express";
import { StudyService } from "../services/StudyService";
import { UploadedFile } from "../interfaces/UploadedFile";
import { StudiesStatus } from "../interfaces/StudiesStatus";
export class StudyManagementController {
    private studyService: StudyService;
  
    constructor() {
      this.studyService = new StudyService();
    }
  
    public addStudy = async (req: Request, res: Response) => {
      try {
        const { clientId, userId, createdById } = req.params;
        const file = req.file; // Available thanks to multer processing the upload in the route
  
        const studyData = req.body; // Extract study data from request body
  
        if (!file) {
          return res.status(400).json({ message: 'File is missing.' });
        }
      
        const newStudy = await this.studyService.createStudy(studyData, file, clientId, userId, createdById);
        res.status(201).json(newStudy);
      } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ messagessss: error.message });
          } else {
            // If the error is not an Error instance, handle it as an unknown error
            res.status(500).json({ message: 'An unknown error occurred' });
          }
      }
    };
  
    
  
    public getAllStudies = async (req: Request, res: Response) => {
      try {
        const studies = await this.studyService.getAllStudies();
        res.status(200).json(studies);
      } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
          } else {
            // If the error is not an Error instance, handle it as an unknown error
            res.status(500).json({ message: 'An unknown error occurred' });
          }
      }
    };
    public getStudyById = async (req: Request, res: Response): Promise<void> => {
      const { userId } = req.params;
  
      try {
        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
          res.status(400).json({ message: "Invalid user ID" });
          return;
        }
  
        const studies = await this.studyService.getStudiesByUserId(userIdInt);
        res.json(studies);
      } catch (error) {
        console.error('Error in getStudyById:', error);
        res.status(500).json({ message: 'Failed to retrieve studies for the user.' });
      }
    };

    public uploadSyntheseFile = async (req: Request, res: Response): Promise<void> => {
      const studyId = parseInt(req.params.studyId);
  
      if (isNaN(studyId)) {
          res.status(400).json({ message: "Invalid study ID." });
          return;
      }
  
      const file = req.file as UploadedFile | undefined;
      if (!file) {
          res.status(400).json({ message: 'File is missing.' });
          return;
      }
  
      try {
          const { syntheseFile, updatedStudy } = await this.studyService.uploadSyntheseFile(studyId, file);
          res.json({
              message: 'Synthèse file uploaded successfully',
              
              updatedStudy
          });
      } catch (error) {
          console.error('Failed to upload synthèse file:', error);
          res.status(500).json({ message: 'Internal server error', error: error });
      }
  };

  public getEngineersStudies = async (req: Request, res: Response) => {
    try {
      const engineersData = await this.studyService.getEngineersStudies();
      res.json(engineersData);
    } catch (error) {
      console.error('Error in getEngineersStudies controller:', error);
      res.status(500).json({ message: 'Failed to retrieve engineers and their studies', error: error });
    }
  };
  public updateStudyStatus = async (req: Request, res: Response): Promise<void> => {
    const { studyId } = req.params;
    const { Status } = req.body;
 // Assuming you have middleware to set userId from token


    try {
      const updatedStudy = await this.studyService.updateStudyStatus(parseInt(studyId), Status as StudiesStatus);
      res.json({
        message: 'Study status updated successfully',
        data: updatedStudy
      });
    } catch (error) {
      console.error('Error updating study status:', error);
      res.status(500).json({ message: 'Failed to update study status', error: error });
    }
  }
  public addModification = async (req: Request, res: Response): Promise<void> => {
    const { studyId, userId } = req.params;
    const file = req.file as UploadedFile; // Assuming multer setup correctly adds the file
    const { TypeDeRetouche, additionalRetouch,comment } = req.body; // Parse additionalRetouch from the request body

    try {
        const result = await this.studyService.addModification( 
            parseInt(studyId),
            file,
            parseInt(userId),
            TypeDeRetouche,
            parseInt(additionalRetouch),
             comment
        );
        res.json('cretaed');
    } catch (error) {
        console.error('Error adding modification:', error);
        res.status(500).json({ message: 'Failed to add modification', error: error });
    }
};

  
    // Implement other methods as needed...
  }