import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  uploadedImage: string | ArrayBuffer | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target?.result as ArrayBuffer;
        this.drawImageOnCanvas();
      };
      reader.readAsDataURL(file);
    }
  }

  clearFileContent(): void {
    this.uploadedImage = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.clearCanvas();
  }

  drawImageOnCanvas(): void {
    this.clearCanvas();
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx && this.uploadedImage) {
      const img = new Image();
      img.src = this.uploadedImage.toString();
      img.onload = () => {

        const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;

        ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);
      };
    }
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  downloadImage(): void {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
  }
}
