import { Express } from 'express';
import clientRoutes from './clientRoutes';
import notificationRoutes from './notificationRoutes';
import userRoutes from './userRoutes';
import studyRoutes from './studyRoutes';
import userStudiesRoutes from './userStudyRoutes';

// Function to register all routes
export const registerRoutes = (app: Express): void => {
  app.use('/clients', clientRoutes);
  app.use('/notifications', notificationRoutes);
  app.use('/users', userRoutes);
  app.use('/studies', studyRoutes);
  app.use('/userStudies', userStudiesRoutes);
  // Add more routes as needed
};
