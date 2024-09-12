import express from 'express'
import { createReport, getReportById, getReportsByUserId } from './controller.js';

const router = express.Router();

router.post('/create-report', createReport );
router.get("/reports/:userid", getReportsByUserId);
router.get("/report/:reportId", getReportById);



export default router;