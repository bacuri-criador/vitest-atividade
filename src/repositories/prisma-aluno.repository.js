/** Implementação do repositório usando Prisma Client. */
export class PrismaAlunoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  listar() {
    return this.prisma.aluno.findMany({ orderBy: { id: 'asc' } });
  }

  buscarPorId(id) {
    return this.prisma.aluno.findUnique({ where: { id } });
  }

  buscarPorEmail(email) {
    return this.prisma.aluno.findUnique({ where: { email } });
  }

  criar(dados) {
    return this.prisma.aluno.create({ data: dados });
  }
}
