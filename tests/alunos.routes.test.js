import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { AlunoService } from '../src/services/aluno.service.js';

function criarRepositorioEmMemoria() {
  let alunos = [];
  let proximoId = 1;

  return {
    listar: async () => [...alunos],
    buscarPorId: async (id) => alunos.find((aluno) => aluno.id === id) ?? null,
    buscarPorEmail: async (email) => alunos.find((aluno) => aluno.email === email) ?? null,
    criar: async (dados) => {
      const aluno = { id: proximoId++, ...dados };
      alunos.push(aluno);
      return aluno;
    }
  };
}

describe('Rotas /alunos', () => {
  let app;

  beforeEach(() => {
    const alunoService = new AlunoService(criarRepositorioEmMemoria());
    app = createApp({ alunoService });
  });

  it('retorna a lista de alunos', async () => {
    const response = await request(app).get('/alunos');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('cadastra um aluno pela rota POST /alunos', async () => {
    const response = await request(app)
      .post('/alunos')
      .send({ nome: 'Ana Souza', email: 'ana@exemplo.com', curso: 'ADS' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      nome: 'Ana Souza',
      email: 'ana@exemplo.com',
      curso: 'ADS'
    });
  });

  it('retorna 400 quando os dados obrigatórios não são enviados', async () => {
    const response = await request(app).post('/alunos').send({ nome: 'Ana' });
    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('Informe nome, email e curso.');
  });

  it('retorna 404 para um aluno inexistente', async () => {
    const response = await request(app).get('/alunos/999');
    expect(response.status).toBe(404);
    expect(response.body.erro).toBe('Aluno não encontrado.');
  });
});
