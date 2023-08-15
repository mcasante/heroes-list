import { Component } from '@angular/core';

@Component({
  selector: 'app-create-hero-form',
  templateUrl: './create-hero-form.component.html',
  styleUrls: ['./create-hero-form.component.scss']
})
export class CreateHeroFormComponent {
  selectedImage: File | undefined;
  dataUrl: string | undefined;

  handleDataUrl(dataUrl: string): void {
    this.dataUrl = dataUrl;
  }
}

