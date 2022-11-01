import { Injectable } from '@angular/core';
import * as images from '../images';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public getRandomImage() {
    return images.default[Math.floor(Math.random() * images.default.length)];
  }
}
