import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PipelineBlock } from 'src/app/models/pipeline.model';

@Component({
  selector: 'app-pipeline-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pipeline-card.component.html',
  styleUrls: ['./pipeline-card.component.scss'],
})
export class PipelineCardComponent {
  @Input() bloco!: PipelineBlock;
  @Output() edit = new EventEmitter<PipelineBlock>();
  @Output() remove = new EventEmitter<PipelineBlock>();

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
}
