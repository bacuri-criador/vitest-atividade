import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createApp } from './app.js';
import { PrismaAlunoRepository } from './repositories/prisma-aluno.repository.js';
import { AlunoService } from './services/aluno.service.js';

const prisma = new PrismaClient();
const alunoRepository = new PrismaAlunoRepository(prisma);
const alunoService = new AlunoService(alunoRepository);
const app = createApp({ alunoService });
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`API de alunos disponível em http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando a aplicação...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
