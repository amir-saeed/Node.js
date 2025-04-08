import express from 'express';
import { PropertyController } from '../controllers/PropertyController';

const router = express.Router();

// Property routes
router.post('/', PropertyController.createProperty);
router.get('/', PropertyController.getProperties);
router.get('/search/proximity', PropertyController.searchPropertiesByProximity);
router.get('/:id', PropertyController.getPropertyById);
router.put('/:id', PropertyController.updateProperty);
router.delete('/:id', PropertyController.deleteProperty);

export default router;