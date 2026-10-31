import { describe, it, expect, beforeEach } from 'vitest';
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

describe('AlunoService', () => {
  let service;

  beforeEach(() => {
    service = new AlunoService(criarRepositorioEmMemoria());
  });

  it('cadastra um aluno e normaliza o email', async () => {
    const aluno = await service.criar({
      nome: '  Maria Silva  ',
      email: ' MARIA@EXEMPLO.COM ',
      curso: 'Análise e Desenvolvimento de Sistemas'
    });

    expect(aluno).toMatchObject({
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      curso: 'Análise e Desenvolvimento de Sistemas'
    });
  });

  it('rejeita cadastro sem os campos obrigatórios', async () => {
    await expect(service.criar({ nome: 'Maria' }))
      .rejects.toThrow('Informe nome, email e curso.');
  });

  it('lista os alunos cadastrados', async () => {
    await service.criar({ nome: 'João', email: 'joao@exemplo.com', curso: 'ADS' });
    const alunos = await service.listar();
    expect(alunos).toHaveLength(1);
    expect(alunos[0].nome).toBe('João');
  });
});
