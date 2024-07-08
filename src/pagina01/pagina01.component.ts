import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-pagina01',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule, HttpClientModule
  ],
  templateUrl: './pagina01.component.html',
  styleUrls: ['./pagina01.component.css']
})
export class Pagina01 implements OnInit {
  cursos: any[] = [];
  alunos: any[] = [];
  alunosCursos: any[] = [];
  selectedCurso: number | undefined;
  selectedAluno: number | undefined;
  descricaoCurso: string = '';
  ementaCurso: string = '';
  nomeAluno: string = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.obterCursos();
    this.obterAlunos();
    this.obterAlunosCursos();
  }

  obterCursos() {
    this.httpClient.get<any[]>('http://localhost:3000/allcursos').subscribe(
      response => this.cursos = response,
      error => console.error('Erro ao buscar cursos:', error)
    );
  }

  obterAlunos() {
    this.httpClient.get<any[]>('http://localhost:3000/alunos').subscribe(
      response => this.alunos = response,
      error => console.error('Erro ao buscar alunos:', error)
    );
  }

  obterAlunosCursos() {
    this.httpClient.get<any[]>('http://localhost:3000/alunoscursos').subscribe(
      response => this.alunosCursos = response,
      error => console.error('Erro ao obter matrículas:', error)
    );
  }

  cadastrarCurso(cursoData: { descricao: string, ementa: string }) {
    this.httpClient.post('http://localhost:3000/inserircurso', cursoData).subscribe(
      () => {
        alert('Curso adicionado com sucesso!');
        this.obterCursos();
      },
      error => {
        console.error('Erro ao adicionar curso:', error);
        alert('Erro ao adicionar curso: ' + error.message);
      }
    );
  }

  cadastrarAluno(alunoData: { nome: string }) {
    this.httpClient.post('http://localhost:3000/inseriraluno', alunoData).subscribe(
      () => {
        alert('Aluno adicionado com sucesso!');
        this.obterAlunos();
      },
      error => {
        console.error('Erro ao adicionar aluno:', error);
        alert('Erro ao adicionar aluno: ' + error.message);
      }
    );
  }

  matricularAluno() {
    if (this.selectedCurso && this.selectedAluno) {
      this.httpClient.post('http://localhost:3000/associaralunocursos', {
        codigo_aluno: this.selectedAluno,
        codigos_cursos: [this.selectedCurso]
      }).subscribe(
        () => {
          alert('Matrícula realizada com sucesso!');
          this.obterAlunosCursos();
        },
        error => {
          console.error('Erro na matrícula:', error);
          alert('Erro na matrícula: ' + error.message);
        }
      );
    } else {
      alert('Selecione um aluno e um curso para matricular.');
    }
  }

  removerMatricula(alunoId: number, cursoId: number) {
    this.httpClient.delete(`http://localhost:3000/desmatricular/${alunoId}/${cursoId}`).subscribe(
      () => {
        alert('Matrícula removida com sucesso!');
        this.obterAlunosCursos();
      },
      error => {
        console.error('Erro ao remover matrícula:', error);
        alert('Erro ao remover matrícula: ' + error.message);
      }
    );
  }

  editarAluno(aluno: any) {
    const novoNome = prompt("Digite o novo nome do aluno:", aluno.nome);
    if (novoNome) {
      this.httpClient.put(`http://localhost:3000/alunos/${aluno.codigo}`, { nome: novoNome }).subscribe(
        () => {
          alert('Aluno atualizado com sucesso!');
          this.obterAlunos();
        },
        error => {
          console.error('Erro ao atualizar aluno:', error);
          alert('Erro ao atualizar aluno: ' + error.message);
        }
      );
    }
  }

  excluirAluno(alunoId: number) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      this.httpClient.delete(`http://localhost:3000/alunos/${alunoId}`).subscribe(
        () => {
          alert('Aluno excluído com sucesso!');
          this.obterAlunos();
        },
        error => {
          console.error('Erro ao excluir aluno:', error);
          alert('Erro ao excluir aluno: ' + error.message);
        }
      );
    }
  }

  editarCurso(curso: any) {
    const novaDescricao = prompt("Digite a nova descrição do curso:", curso.descricao);
    const novaEmenta = prompt("Digite a nova ementa do curso:", curso.ementa);
    if (novaDescricao && novaEmenta) {
      this.httpClient.put(`http://localhost:3000/cursos/${curso.codigo}`, { descricao: novaDescricao, ementa: novaEmenta }).subscribe(
        () => {
          alert('Curso atualizado com sucesso!');
          this.obterCursos();
        },
        error => {
          console.error('Erro ao atualizar curso:', error);
          alert('Erro ao atualizar curso: ' + error.message);
        }
      );
    }
  }

  excluirCurso(cursoId: number) {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      this.httpClient.delete(`http://localhost:3000/cursos/${cursoId}`).subscribe(
        () => {
          alert('Curso excluído com sucesso!');
          this.obterCursos();
        },
        error => {
          console.error('Erro ao excluir curso:', error);
          alert('Erro ao excluir curso: ' + error.message);
        }
      );
    }
  }

  limparDados() {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
      this.httpClient.delete(`http://localhost:3000/clearall`).subscribe(
        () => {
          alert('Todos os dados foram limpos com sucesso!');
          this.obterCursos();
          this.obterAlunos();
          this.obterAlunosCursos();
        },
        error => {
          console.error('Erro ao limpar os dados:', error);
          alert('Erro ao limpar os dados: ' + error.message);
        }
      );
    }
  }

}
