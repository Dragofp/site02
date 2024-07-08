import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { AlunoEntity } from "./Aluno.entity";

@Entity('curso_entity')
export class CursoEntity {
  @PrimaryGeneratedColumn()
  codigo!: number;

  @Column({ length: 50 })
  descricao!: string;

  @Column("text")
  ementa!: string;

  @ManyToMany(() => AlunoEntity, aluno => aluno.cursos)
  @JoinTable({
    name: "curso_aluno",
    joinColumn: {
      name: "codigo_curso",
      referencedColumnName: "codigo"
    },
    inverseJoinColumn: {
      name: "codigo_aluno",
      referencedColumnName: "codigo"
    }
  })
  alunos!: AlunoEntity[];
}
