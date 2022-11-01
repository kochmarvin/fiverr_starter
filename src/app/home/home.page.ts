import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ImageService } from '../services/image/image.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('canva') canvas: ElementRef;

  public backgroundImage;
  public backgroundImagePixelCount;

  // if you increase this every click reveals more pixel
  public pixelPerClick = 1;
  private remainingPixel = [];

  // fixed size do not change
  public canvasSize = 300;
  private fill = false;

  constructor(private imageService: ImageService) {}

  ngAfterViewInit(): void {
    const image = this.imageService.getRandomImage();
    this.initNewImage(image.pixels, image.path);
  }

  private initNewImage(pixels: number, url: string) {
    const native: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = native.getContext('2d');
    ctx.fillStyle = '#f7ecc6';
    ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

    this.backgroundImagePixelCount = pixels;
    this.backgroundImage = `https://zsdmntbrlwkqfgzcwihs.supabase.co/storage/v1/object/public/images/paintings/${url}.png`;

    this.fill = true;
    for (let i = 0; i < this.backgroundImagePixelCount; i++) {
      for (let j = 0; j < this.backgroundImagePixelCount; j++) {
        this.remainingPixel.push({ x: i, y: j });
      }
    }

    this.fill = false;
  }

  /**
   * 
   * This method has to be on the GPU
   */
  removePixel() {
    const native: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = native.getContext('2d');

    for (let i = 0; i < this.pixelPerClick; i++) {
      const index = Math.floor(Math.random() * this.remainingPixel.length);
      const pixel = this.remainingPixel[index];

      ctx.clearRect(
        pixel.x * (this.canvasSize / this.backgroundImagePixelCount),
        pixel.y * (this.canvasSize / this.backgroundImagePixelCount),
        this.canvasSize / this.backgroundImagePixelCount,
        this.canvasSize / this.backgroundImagePixelCount
      );

      this.remainingPixel.splice(index, 1);

      if (this.remainingPixel.length === 0) {
        break;
      }
    }

    if (this.remainingPixel.length === 0) {
      const image = this.imageService.getRandomImage();
      this.initNewImage(image.pixels, image.path);
    }
  }
}
