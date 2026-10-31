export function createAlunoController(alunoService) {
  return {
    listar: async (_req, res, next) => {
      try {
        const alunos = await alunoService.listar();
        return res.status(200).json(alunos);
      } catch (error) {
        return next(error);
      }
    },

    buscarPorId: async (req, res, next) => {
      try {
        const aluno = await alunoService.buscarPorId(req.params.id);
        return res.status(200).json(aluno);
      } catch (error) {
        return next(error);
      }
    },

    criar: async (req, res, next) => {
      try {
        const aluno = await alunoService.criar(req.body);
        return res.status(201).json(aluno);
      } catch (error) {
        return next(error);
      }
    }
  };
}
