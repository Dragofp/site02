import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { CursoEntity } from "./Curso.entity";

@Entity('aluno_entity')
export class AlunoEntity {
  @PrimaryGeneratedColumn()
  codigo: number = 0;

  @Column({ length: 50 })
  nome: string = '';

  @ManyToMany(() => CursoEntity, curso => curso.alunos)
  cursos?: CursoEntity[];
}
