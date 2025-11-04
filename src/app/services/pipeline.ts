import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pipeline, PipelineBlock, ProcessamentoType } from '../models/pipeline.model';

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  // Pipeline único
  private pipelineSubject = new BehaviorSubject<Pipeline>({
    id: 1,
    nome: 'Pipeline Principal',
    blocos: [
      { id: 1, tipo: 'input', nome: 'Entrada (.raw)' },
      { id: 2, tipo: 'processamento', nome: 'Filtro Gaussiano' },
      { id: 3, tipo: 'exibicao', nome: 'Visualização da Imagem' },
      { id: 4, tipo: 'gravacao', nome: 'Salvar em Disco' },
    ],
  });

  pipeline$ = this.pipelineSubject.asObservable();

  constructor() {}

  // Retorna os blocos atuais
  getBlocks(): PipelineBlock[] {
    return this.pipelineSubject.value.blocos;
  }

  // Gera ID incremental simples
  generateId(): number {
    const blocos = this.pipelineSubject.value.blocos;
    return blocos.length ? Math.max(...blocos.map(b => b.id)) + 1 : 1;
  }

  // Ações
  addBlockAt(index: number, newBlock: PipelineBlock) {
    const blocos = [...this.pipelineSubject.value.blocos];
    blocos.splice(index, 0, newBlock);
    this.pipelineSubject.next({ ...this.pipelineSubject.value, blocos });
  }

  removeBlock(id: number) {
    const blocos = this.pipelineSubject.value.blocos.filter(b => {
      if (b.tipo === 'input') return true;
      return b.id !== id;
    });

    this.pipelineSubject.next({ ...this.pipelineSubject.value, blocos });
  }

  editBlock(id: number, processo: ProcessamentoType) {
    const blocos = this.pipelineSubject.value.blocos.map(b =>
      b.id === id
        ? { ...b, processo, nome: this.getNomeFromProcesso(processo) }
        : b
    );
    this.pipelineSubject.next({ ...this.pipelineSubject.value, blocos });
  }

  private getNomeFromProcesso(processo: ProcessamentoType): string {
    switch (processo) {
      case 'brilho': return 'Ajuste de Brilho';
      case 'limiarizacao': return 'Limiarização';
      case 'convolucao': return 'Convolução';
      case 'media': return 'Filtro de Média';
      case 'mediana': return 'Filtro de Mediana';
      case 'laplaciano': return 'Filtro Laplaciano';
      default: return 'Processamento';
    }
  }
}