import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private ctx: CanvasRenderingContext2D | undefined | null;

  constructor() {}

  setContext(context: CanvasRenderingContext2D): void {
    this.ctx = context;
  }

  readBuffer(buffer: ArrayBuffer, callback?: () => void): void {
    const img = new Image();
    img.src = buffer.toString();
    img.addEventListener('load', () => {
      this.drawImage(img, this.ctx?.canvas.width || 0, this.ctx?.canvas.height || 0);
      if(callback) callback()
    })
  }

  drawImage(image: HTMLImageElement, width: number, height: number): void {
    if(!this.ctx) return
    this.clear();

    const scaleFactor = Math.min(width / image.width, height / image.height);
    const newWidth = image.width * scaleFactor;
    const newHeight = image.height * scaleFactor;

    this.ctx?.drawImage(
      image,
      (width - newWidth) / 2,
      (height - newHeight) / 2,
      newWidth, newHeight
    );
  }

  clear(): void {
    if (!this.ctx) return
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }


  toDataUrl(mimeType: string = 'image/png', quality: number = 1): string | void {
    if(!this.ctx) return
    return this.ctx.canvas.toDataURL(mimeType, quality);
  }
}
