import { Router } from 'express';
import { createAlunoController } from '../controllers/aluno.controller.js';

export function createAlunosRouter(alunoService) {
  const router = Router();
  const controller = createAlunoController(alunoService);

  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.post('/', controller.criar);

  return router;
}
