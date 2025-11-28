import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuxiliaryFunctions {
  adjustBrightness(imageData: Uint8Array, brightness: number, isSubtract: boolean): Uint8Array {
    const output = new Uint8Array(imageData.length);

    for (let i = 0; i < imageData.length; i++) {
      let newValue = isSubtract ? imageData[i] - (imageData[i] / 100 * brightness) : imageData[i] + (imageData[i] / 100 * brightness);

      if (newValue > 255) newValue = 255;
      else if (newValue < 0) newValue = 0;

      output[i] = newValue;
    }

    return output;
  }

  threshold(imageData: Uint8Array, threshold: number): Uint8Array {
    const output = new Uint8Array(imageData.length);

    for (let i = 0; i < imageData.length; i++) {
      const pixel = imageData[i];
      output[i] = pixel >= threshold ? 255 : 0;
    }

    return output;
  }

}
