import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { create, getAll, getOne, update, remove } from './task.controller';

const router = Router();

router.use(protect);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;