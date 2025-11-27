import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pipeline, PipelineBlock, PipelineImage, ProcessamentoType } from '../models/pipeline.model';

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
      { id: 2, tipo: 'processamento', nome: 'Novo Processamento' },
      { id: 3, tipo: 'exibicao', nome: 'Visualização da Imagem' },
      { id: 4, tipo: 'gravacao', nome: 'Salvar em Disco' },
    ],
  });

  pipeline$ = this.pipelineSubject.asObservable();

  // Retorna o pipeline atual
  getPipeline(): Pipeline {
    return this.pipelineSubject.value;
  }
  
  constructor() {}

  // Atualiza o pipeline reativamente
  private update(blocos: PipelineBlock[]) {
    this.pipelineSubject.next({ ...this.pipelineSubject.value, blocos });
  }

  // Gera ID incremental simples
  generateId(): number {
    const blocos = this.pipelineSubject.value.blocos;
    return blocos.length ? Math.max(...blocos.map(b => b.id)) + 1 : 1;
  }

  // Ações
  addBlockAt(index: number, newBlock: PipelineBlock) {
    const blocos = [...this.getPipeline().blocos];
    blocos.splice(index, 0, newBlock);
    this.update(blocos);
  }

  removeBlock(id: number) {
    const blocos = this.getPipeline().blocos.filter(b =>
      b.tipo === 'input' ? true : b.id !== id
    );
    this.update(blocos);
  }

  editBlock(id: number, processo: ProcessamentoType) {
    const blocos = this.getPipeline().blocos.map(b =>
      b.id === id
        ? { ...b, processo, nome: this.getNomeFromProcesso(processo) }
        : b
    );
    this.update(blocos);
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

  // Define uma imagem em qualquer bloco
  setBlockImage(id: number, imagem: PipelineImage) {
    const blocos = this.getPipeline().blocos.map(b =>
      b.id === id ? { ...b, imagem } : b
    );
    this.update(blocos);
    console.log("setBlockImage:", imagem);
    console.log("Blocos atualizados no pipeline:", this.getPipeline().blocos);
  }

  getBlockImage(id: number): PipelineImage | undefined {
    console.log("getBlockImage",this.getPipeline().blocos.find(b => b.id === id)?.imagem)
    return this.getPipeline().blocos.find(b => b.id === id)?.imagem;
  }
}