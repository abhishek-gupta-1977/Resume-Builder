import express from 'express';
import { generateResumeAI, updateResumeContent, exportResumePdf, getUserResumes, getResumeById, getTemplates, updateResumeTemplate } from '../controllers/resumeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateResumeAI);
router.get('/templates/list', protect, getTemplates);
router.put('/:resumeId/template', protect, updateResumeTemplate); 
router.put('/:resumeId', protect, updateResumeContent);
router.get('/:resumeId/export', protect, exportResumePdf);
router.get('/', protect, getUserResumes);
router.get('/:resumeId', protect, getResumeById);


export default router;