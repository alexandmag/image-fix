import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PipelineComponent } from 'src/app/components/pipeline/pipeline.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, PipelineComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {}
