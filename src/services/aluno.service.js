export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

/** Regras de negócio e validações da entidade Aluno. */
export class AlunoService {
  constructor(alunoRepository) {
    this.alunoRepository = alunoRepository;
  }

  listar() {
    return this.alunoRepository.listar();
  }

  async buscarPorId(idInformado) {
    const id = Number(idInformado);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('O ID deve ser um número inteiro positivo.', 400);
    }

    const aluno = await this.alunoRepository.buscarPorId(id);
    if (!aluno) {
      throw new AppError('Aluno não encontrado.', 404);
    }
    return aluno;
  }

  async criar(dados) {
    const nome = typeof dados?.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados?.email === 'string' ? dados.email.trim().toLowerCase() : '';
    const curso = typeof dados?.curso === 'string' ? dados.curso.trim() : '';

    if (!nome || !email || !curso) {
      throw new AppError('Informe nome, email e curso.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError('Informe um endereço de email válido.');
    }

    const alunoExistente = await this.alunoRepository.buscarPorEmail(email);
    if (alunoExistente) {
      throw new AppError('Já existe um aluno cadastrado com este email.', 409);
    }

    try {
      return await this.alunoRepository.criar({ nome, email, curso });
    } catch (error) {
      // Protege também contra duplicidade causada por duas requisições simultâneas.
      if (error?.code === 'P2002') {
        throw new AppError('Já existe um aluno cadastrado com este email.', 409);
      }
      throw error;
    }
  }
}
