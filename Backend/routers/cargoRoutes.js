import express from 'express';
import { createAdmin, addContainer, addItemToContainer, getContainers } from '../controllers/cargoController.js';

const router = express.Router();

router.post('/admin', createAdmin);
router.post('/admin/container', addContainer);
router.post('/admin/container/item', addItemToContainer);
router.get('/admin/:adminId/containers', getContainers);

export default router;
