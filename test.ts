// // import { PrismaClient } from '@prisma/client';
// // import { Request, Response } from 'express';
// // import { uploadFile } from '../middelware/multerSetup';
// // import multer, { MulterError } from 'multer';

// // const prisma = new PrismaClient();

// // interface Studies {
// //   DateDeReception: Date;
// //   DateDeSoumission: Date;
// //   FullName: string;
// //   Factured: number;
// //   TypeEtude: 'NouvelleEtude' | 'Retouche';
// //   NomberDeRetouche: number;
// //   TypeDeRetouche: 'Exterieur' | 'Interieur';
// //   Category: 'Classique' | 'Precaire' | 'GrandPrecaire';
// //   Nature: 'Normale' | 'Prioritere';
// // }

// // const addStudy = async (req: Request, res: Response) => {
// //   uploadFile(req, res, async (err: MulterError | undefined) => {
// //     if (err instanceof multer.MulterError) {
// //       return res.status(400).send(err);
// //     } else if (err) {
// //       res.status(500).send(err);
// //     } else {
// //       try {
// //         const {
// //           DateDeReception,
// //           DateDeSoumission,
// //           FullName,
// //           Factured,
// //           TypeEtude,
// //           NomberDeRetouche,
// //           TypeDeRetouche,
// //           Category,
// //           Nature,
// //         }: Studies = req.body;

// //         const { clientId, userId } = req.params;

// //         const client = await prisma.client.findUnique({
// //           where: { IdClient: Number(clientId) },
// //         });

// //         if (!client) {
// //           return res.status(404).send({ message: 'Client not found' });
// //         }

// //         const uploadedFile = req.file; // Using req.file directly

// //         const newFile = await prisma.files.create({
// //           data: {
// //             FileName: uploadedFile.originalname,
// //             FileType: uploadedFile.mimetype,
// //             FileContent: uploadedFile.buffer, // Store the file content
// //             uploadDate: new Date(),
// //             FileSize: uploadedFile.size,
// //           },
// //         });

// //         const newStudy = await prisma.studies.create({
// //           data: {
// //             // Other study data...
// //             client: { connect: { IdClient: client.IdClient } },
// //             // Other associations...
// //             files: {
// //               connect: { idFiles: newFile.idFiles },
// //             },
// //           },
// //         });

// //         res.json(newStudy);
// //       } catch (error) {
// //         res.status(500).send(error);
// //       }
// //     }
// //   });
// // };

// // const getAllStudies = async (req: Request, res: Response) => {
// //   try {
// //     const allStudies = await prisma.studies.findMany();
// //     res.json(allStudies);
// //   } catch (error) {
// //     res.status(500).json(error);
// //   }
// // };

// // export { addStudy, getAllStudies };
// import { PrismaClient, Prisma } from '@prisma/client';
// import { Request, Response } from 'express';
// import { uploadFile } from '../middleware/multerSetup';
// import multer, { MulterError } from 'multer';

// const prisma = new PrismaClient();

// interface Studies {
//   DateDeReception: Date;
//   DateDeSoumission: Date;
//   FullName: string;
//   Factured: number;
//   TypeEtude: 'NouvelleEtude' | 'Retouche';
//   NomberDeRetouche: number;
//   TypeDeRetouche: 'Exterieur' | 'Interieur';
//   Category: 'Classique' | 'Precaire' | 'GrandPrecaire';
//   Nature: 'Normale' | 'Prioritere';
// }

// const addStudy = async (req: Request, res: Response) => {
//   uploadFile(req, res, async (err: MulterError) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).send(err);
//     } else if (err) {
//       res.status(500).send(err);
//     } else {
//       const uploadedFile = req.file;

//       const {
//         DateDeReception,
//         DateDeSoumission,
//         FullName,
//         Factured,
//         TypeEtude,
//         NomberDeRetouche,
//         TypeDeRetouche,
//         Category,
//         Nature,
//       }: Studies = req.body;

//       const { clientId, userId } = req.params;

//       try {
//         const client = await prisma.client.findUnique({
//           where: { IdClient: Number(clientId) },
//         });

//         if (!client) {
//           return res.status(404).send({ message: 'Client not found' });
//         }

//         const newFile = await prisma.files.create({
//           data: {
//             FileName: uploadedFile.originalname,
//             FileType: uploadedFile.mimetype,
//             FileContent: uploadedFile.buffer, // Store the file content
//             uploadDate: new Date(),
//             FileSize: uploadedFile.size,
//           },
//         });

//         const newStudy = await prisma.studies.create({
//           data: {
//             DateDeReception,
//             DateDeSoumission,
//             FullName,
//             Factured,
//             TypeEtude,
//             NomberDeRetouche,
//             TypeDeRetouche,
//             Category,
//             Nature,
//             client: { connect: { IdClient: client.IdClient } },
//             users_has_studies: {
//               create: {
//                 users: {
//                   connect: { UserID: Number(userId) },
//                 },
//               },
//             },
//             files: {
//               connect: { idFiles: newFile.idFiles },
//             },
//           },
//         });

//         res.json(newStudy);
//       } catch (error) {
//         res.status(500).send(error);
//       }
//     }
//   });
// };

// const getAllStudies = async (req: Request, res: Response) => {
//   try {
//     const allStudies = await prisma.studies.findMany();
//     res.json(allStudies);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// export { addStudy, getAllStudies };
