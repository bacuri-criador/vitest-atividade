import express from 'express';
import { createAlunosRouter } from './routes/alunos.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

/** Cria a aplicação com o serviço injetado, facilitando os testes sem banco real. */
export function createApp({ alunoService }) {
  if (!alunoService) {
    throw new Error('O alunoService é obrigatório para criar a aplicação.');
  }

  const app = express();
  app.use(express.json());
  app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Alunos funcionando!',
    rotas: {
      alunos: '/alunos',
      health: '/health'
    }
  });
});

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/alunos', createAlunosRouter(alunoService));

  app.use((_req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
  });

  app.use(errorHandler);
  return app;
}
