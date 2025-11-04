export type PipelineBlockType = 'input' | 'processamento' | 'exibicao' | 'gravacao';

export type ProcessamentoType =
    | 'brilho'
    | 'limiarizacao'
    | 'convolucao'
    | 'media'
    | 'mediana'
    | 'laplaciano';

export interface PipelineBlock {
    id: number;                 // Identificador único
    tipo: PipelineBlockType;    // Tipo do bloco
    nome: string;               // Ex: "Entrada RAW", "Filtro Gaussiano"
    processo?: ProcessamentoType; // Tipos de processos
    configuracao?: any;         // Parâmetros específicos (intensidade, path, etc.)
    resultado?: any;            // Dados da imagem após o processamento
}

export interface Pipeline {
    id: number;
    nome: string;
    blocos: PipelineBlock[];
}
