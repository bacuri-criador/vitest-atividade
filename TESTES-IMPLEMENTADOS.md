# Testes implementados

## Testes unitários (`tests/aluno.service.test.js`)
1. Cadastra aluno e normaliza email.
2. Rejeita cadastro sem campos obrigatórios.
3. Lista alunos cadastrados.

## Testes de rotas (`tests/alunos.routes.test.js`)
1. GET `/alunos` retorna lista.
2. POST `/alunos` cadastra e retorna HTTP 201.
3. POST `/alunos` sem campos obrigatórios retorna HTTP 400.
4. GET `/alunos/999` retorna HTTP 404 quando não existe.

Os testes usam dependência em memória, sem acessar o banco real.
