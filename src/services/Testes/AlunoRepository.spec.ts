import { DataSource } from "typeorm";
import { AlunoEntity} from "../Aluno.entity";
import { typeOrmConfig} from "../typeorm.config";

describe('AlunoRepository', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource(typeOrmConfig);
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('deve criar um novo aluno', async () => {
    const alunoRepository = dataSource.getRepository(AlunoEntity);
    const aluno = alunoRepository.create({ nome: 'Teste' });
    const savedAluno = await alunoRepository.save(aluno);

    expect(savedAluno["codigo"]).toBeDefined();
    expect(savedAluno["nome"]).toBe('Teste');
  });
});
