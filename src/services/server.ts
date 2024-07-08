import "reflect-metadata";
import express, { Request, Response } from 'express';
import { DataSource } from "typeorm";
import { typeOrmConfig } from "./typeorm.config";
import { AlunoEntity } from "./Aluno.entity";
import { CursoEntity } from "./Curso.entity";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port: number = parseInt(process.env['PORT'] || '3000', 10);

const dataSource = new DataSource(typeOrmConfig);

dataSource.initialize()
  .then(() => {
    console.log('Database connection established');

    const alunoRepository = dataSource.getRepository(AlunoEntity);
    const cursoRepository = dataSource.getRepository(CursoEntity);

    app.get('/alunos', async (req: Request, res: Response) => {
      try {
        const alunos = await alunoRepository.find({ relations: ["cursos"] });
        res.json(alunos);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        res.status(500).json({ error: 'Erro ao buscar alunos' });
      }
    });

    app.post('/inseriraluno', async (req: Request, res: Response) => {
      try {
        const aluno = alunoRepository.create(req.body);
        await alunoRepository.save(aluno);
        res.status(200).json({ message: 'Aluno inserido com sucesso!' });
      } catch (error) {
        console.error('Erro ao inserir aluno:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.put('/alunos/:id', async (req: Request, res: Response) => {
      try {
        const aluno = await alunoRepository.findOneBy({ codigo: parseInt(req.params['id'], 10) });
        if (aluno) {
          alunoRepository.merge(aluno, req.body);
          await alunoRepository.save(aluno);
          res.status(200).json(aluno);
        } else {
          res.status(404).json({ error: 'Aluno não encontrado' });
        }
      } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.delete('/alunos/:id', async (req: Request, res: Response) => {
      try {
        const alunoId: number = parseInt(req.params['id'], 10);
        const aluno: AlunoEntity | null = await alunoRepository.findOne({
          where: { codigo: alunoId },
          relations: ['cursos']
        });

        if (aluno && (aluno.cursos?.length === 0 || !aluno.cursos)) {
          await alunoRepository.remove(aluno);
          res.status(200).json({ message: 'Aluno excluído com sucesso!' });
        } else {
          res.status(400).json({ body: { error: 'Aluno não pode ser excluído porque está matriculado em cursos' } });
        }
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        res.status(500).json({ body: { error: 'Erro interno do servidor' } });
      }
    });

    app.post('/inserircurso', async (req: Request, res: Response) => {
      try {
        const curso = cursoRepository.create(req.body);
        await cursoRepository.save(curso);
        res.status(200).json({ message: 'Curso inserido com sucesso!' });
      } catch (error) {
        console.error('Erro ao inserir curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.get('/allcursos', async (req: Request, res: Response) => {
      try {
        const cursos = await cursoRepository.find({ relations: ["alunos"] });
        res.json(cursos);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        res.status(500).json({ error: 'Erro ao buscar cursos' });
      }
    });

    app.put('/cursos/:id', async (req: Request, res: Response) => {
      try {
        const curso = await cursoRepository.findOneBy({ codigo: parseInt(req.params['id'], 10) });
        if (curso) {
          cursoRepository.merge(curso, req.body);
          await cursoRepository.save(curso);
          res.status(200).json(curso);
        } else {
          res.status(404).json({ error: 'Curso não encontrado' });
        }
      } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.delete('/cursos/:id', async (req: Request, res: Response) => {
      try {
        const curso = await cursoRepository.findOne({
          where: { codigo: parseInt(req.params['id'], 10) },
          relations: ['alunos']
        });
        if (curso && curso.alunos.length === 0) {
          await cursoRepository.remove(curso);
          res.status(200).json({ message: 'Curso excluído com sucesso!' });
        } else {
          res.status(400).json({ error: 'Curso não pode ser excluído porque tem alunos matriculados' });
        }
      } catch (error) {
        console.error('Erro ao excluir curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.post('/associaralunocursos', async (req: Request, res: Response) => {
      try {
        const { codigo_aluno, codigos_cursos } = req.body;

        if (!Array.isArray(codigos_cursos)) {
          return res.status(400).json({ error: 'codigos_cursos deve ser um array' });
        }

        const aluno = await alunoRepository.findOne({
          where: { codigo: codigo_aluno },
          relations: ["cursos"]
        });

        if (aluno) {
          aluno.cursos = aluno.cursos || [];
          const cursosAtuais = new Set(aluno.cursos.map(curso => curso.codigo));
          for (const codigo_curso of codigos_cursos) {
            if (!cursosAtuais.has(codigo_curso)) {
              const curso = await cursoRepository.findOneBy({ codigo: codigo_curso });
              if (curso) {
                aluno.cursos.push(curso);
              }
            }
          }
          await alunoRepository.save(aluno);
          return res.status(200).json({ message: 'Aluno associado aos cursos com sucesso!' });
        } else {
          return res.status(404).json({ error: 'Aluno não encontrado' });
        }
      } catch (error) {
        console.error('Erro ao associar aluno aos cursos:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.delete('/desmatricular/:alunoId/:cursoId', async (req: Request, res: Response) => {
      try {
        const { alunoId, cursoId } = req.params;
        const aluno = await alunoRepository.findOne({
          where: { codigo: parseInt(alunoId, 10) },
          relations: ['cursos']
        });

        if (aluno) {
          aluno.cursos = aluno.cursos || [];
          aluno.cursos = aluno.cursos.filter(curso => curso.codigo !== parseInt(cursoId, 10));
          await alunoRepository.save(aluno);
          res.status(200).json({ message: 'Aluno desmatriculado do curso com sucesso!' });
        } else {
          res.status(404).json({ error: 'Aluno não encontrado' });
        }
      } catch (error) {
        console.error('Erro ao desmatricular aluno do curso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

    app.get('/alunoscursos', async (req: Request, res: Response) => {
      try {
        const alunos = await alunoRepository.find({ relations: ["cursos"] });
        const alunosCursos = alunos.map(aluno => {
          return {
            aluno_id: aluno.codigo,
            aluno_nome: aluno.nome,
            cursos: aluno.cursos ? aluno.cursos.map(curso => ({
              curso_id: curso.codigo,
              curso_descricao: curso.descricao
            })) : []
          };
        });
        res.json(alunosCursos);
      } catch (error) {
        console.error('Erro ao buscar alunos e cursos:', error);
        res.status(500).json({ error: 'Erro ao buscar alunos e cursos' });
      }
    });

    app.delete('/clearall', async (req: Request, res: Response) => {
      try {
        await dataSource.query('TRUNCATE TABLE curso_aluno, aluno_entity, curso_entity RESTART IDENTITY CASCADE');
        res.status(200).json({ message: 'Todas as tabelas foram limpas com sucesso!' });
      } catch (error) {
        console.error('Erro ao limpar as tabelas:', error);
        res.status(500).json({ error: 'Erro ao limpar as tabelas' });
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  }).catch(error => {
  console.error('Error connecting to database', error);
});
