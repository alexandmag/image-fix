import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PipelineBlock, PipelineImage } from 'src/app/models/pipeline.model';
import { PipelineService } from 'src/app/services/pipeline';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pipeline-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pipeline-card.component.html',
  styleUrls: ['./pipeline-card.component.scss'],
})
export class PipelineCardComponent implements OnInit, OnDestroy {
  @Input() bloco!: PipelineBlock;
  @Output() edit = new EventEmitter<PipelineBlock>();
  @Output() remove = new EventEmitter<PipelineBlock>();

  public imageName?: string;
  public imageUrl?: string;

  private sub?: Subscription;

  constructor(private pipelineService: PipelineService) {}

  ngOnInit() {
    // Atualiza automaticamente o bloco local quando o pipeline mudar
    this.sub = this.pipelineService.pipeline$.subscribe(pipeline => {
      const atualizado = pipeline.blocos.find(b => b.id === this.bloco.id);
      if (atualizado) this.bloco = atualizado;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getIcon(): string {
    switch (this.bloco.tipo) {
      case 'input': return 'folder-open-outline';
      case 'processamento': return 'settings-outline';
      case 'exibicao': return 'eye-outline';
      case 'gravacao': return 'save-outline';
      default: return 'cube-outline';
    }
  }

  onEdit() { this.edit.emit(this.bloco); }
  onRemove() { this.remove.emit(this.bloco); }

  async onSelectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.raw';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      this.imageName = file.name;
      console.log("onSelectImage File", file);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const imagem: PipelineImage = {
        data: uint8Array,
        width: 128,
        height: 128,
      };

      this.pipelineService.setBlockImage(this.bloco.id, imagem);
    };

    input.click();
  }

  onShowImage() {
    const imagem = this.pipelineService.getBlockImage(this.bloco.id);
    console.log("onShowImage", imagem);
    if (!imagem) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, data } = imagem;
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      imageData.data[i * 4 + 0] = v;
      imageData.data[i * 4 + 1] = v;
      imageData.data[i * 4 + 2] = v;
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    this.imageUrl = canvas.toDataURL();
  }
}
