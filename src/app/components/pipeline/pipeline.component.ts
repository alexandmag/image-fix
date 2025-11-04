import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionSheetController, AlertController, IonicModule } from '@ionic/angular';
import { PipelineBlock, PipelineBlockType, ProcessamentoType } from 'src/app/models/pipeline.model';
import { PipelineCardComponent } from '../pipeline-card/pipeline-card.component';
import { PipelineService } from 'src/app/services/pipeline';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, IonicModule, PipelineCardComponent],
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
})
export class PipelineComponent {
  pipelineBlocks: PipelineBlock[] = [];

  constructor(
    private pipelineService: PipelineService,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {

    this.pipelineService.pipeline$.subscribe(pipeline => {
      this.pipelineBlocks = pipeline.blocos;
    });
  }

  async addBlockAt(index: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Adicionar bloco',
      buttons: [
        {
          text: 'Processamento',
          icon: 'filter-outline',
          handler: () => this.createBlock(index, 'processamento')
        },
        {
          text: 'Exibição',
          icon: 'eye-outline',
          handler: () => this.createBlock(index, 'exibicao')
        },
        {
          text: 'Gravação',
          icon: 'save-outline',
          handler: () => this.createBlock(index, 'gravacao')
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private createBlock(index: number, tipo: PipelineBlockType) {
    const newBlock: PipelineBlock = {
      id: this.pipelineService.generateId(),
      tipo,
      nome:
        tipo === 'processamento'
          ? 'Novo Processamento'
          : tipo === 'exibicao'
          ? 'Exibir Imagem'
          : 'Salvar Resultado'
    };

    this.pipelineService.addBlockAt(index + 1, newBlock);
  }

  removeBlock(bloco: PipelineBlock) {
    this.pipelineService.removeBlock(bloco.id);
  }

  async editBlock(bloco: PipelineBlock) {
    if (bloco.tipo !== 'processamento') {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Escolher tipo de processamento',
      inputs: [
        { label: 'Brilho', type: 'radio', value: 'brilho', checked: bloco.processo === 'brilho' },
        { label: 'Limiarização', type: 'radio', value: 'limiarizacao', checked: bloco.processo === 'limiarizacao' },
        { label: 'Convolução', type: 'radio', value: 'convolucao', checked: bloco.processo === 'convolucao' },
        { label: 'Média', type: 'radio', value: 'media', checked: bloco.processo === 'media' },
        { label: 'Mediana', type: 'radio', value: 'mediana', checked: bloco.processo === 'mediana' },
        { label: 'Laplaciano', type: 'radio', value: 'laplaciano', checked: bloco.processo === 'laplaciano' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: (processo: ProcessamentoType) => {
            this.pipelineService.editBlock(bloco.id, processo);
          },
        },
      ],
    });

    await alert.present();
  }
}
