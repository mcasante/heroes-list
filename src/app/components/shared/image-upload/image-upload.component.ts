import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CanvasService } from '../../../core/services/canvas/canvas.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  @Output() dataUrlEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Input() selectedImage: string | ArrayBuffer | null = null;

  constructor(private canvasService: CanvasService) {}

  ngAfterViewInit(): void {
    this.canvasService.setContext(
      this.canvasRef.nativeElement.getContext('2d') as CanvasRenderingContext2D,
    );

    if (this.selectedImage) {
      this.canvasService.readBuffer(this.selectedImage as ArrayBuffer);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.canvasService.readBuffer(reader.result as ArrayBuffer, () =>
        this.captureCanvas(),
      );
    });

    reader.readAsDataURL(file);
  }

  clearFileContent(): void {
    if (!this.fileInput) return;
    this.canvasService.clear();
    this.captureCanvas();
    this.fileInput.nativeElement.value = '';
  }

  captureCanvas(): void {
    const dataUrl = this.canvasService.toDataUrl();
    this.dataUrlEmitter.emit(dataUrl as string);
  }
}
