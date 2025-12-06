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

  convolve(
    imageData: Uint8Array,
    width: number,
    height: number,
    kernel: number[][],
    normalize = true
  ): Uint8Array {
    const output = new Uint8Array(imageData.length);

    const kHeight = kernel.length;
    const kWidth = kernel[0].length;

    const kHalfH = Math.floor(kHeight / 2);
    const kHalfW = Math.floor(kWidth / 2);

    let weightSum = 0;
    for (let y = 0; y < kHeight; y++) {
      for (let x = 0; x < kWidth; x++) {
        weightSum += kernel[y][x];
      }
    }

    if (!normalize || weightSum === 0) {
      weightSum = 1;
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let acc = 0;

        for (let ky = 0; ky < kHeight; ky++) {
          for (let kx = 0; kx < kWidth; kx++) {
            const px = x + (kx - kHalfW);
            const py = y + (ky - kHalfH);

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const pixelValue = imageData[py * width + px];
              acc += pixelValue * kernel[ky][kx];
            }
          }
        }

        let newValue = acc / weightSum;
        if (newValue < 0) newValue = 0;
        if (newValue > 255) newValue = 255;

        output[y * width + x] = newValue;
      }
    }

    return output;
  }

  medianFilter(
    imageData: Uint8Array,
    width: number,
    height: number,
    maskSize: number
  ): Uint8Array {
    const output = new Uint8Array(imageData.length);
    const half = Math.floor(maskSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {

        const neighbors: number[] = [];

        for (let ky = -half; ky <= half; ky++) {
          for (let kx = -half; kx <= half; kx++) {
            const px = x + kx;
            const py = y + ky;

            if (px >= 0 && px < width && py >= 0 && py < height) {
              neighbors.push(imageData[py * width + px]);
            }
          }
        }

        neighbors.sort((a, b) => a - b);

        const median = neighbors[Math.floor(neighbors.length / 2)];

        output[y * width + x] = median;
      }
    }

    return output;
  }

  computeHistogram(imageData: Uint8Array): number[] {
    const histogram = new Array(256).fill(0);

    for (let i = 0; i < imageData.length; i++) {
      histogram[imageData[i]]++;
    }

    return histogram;
  }

  difference(
    imageA: Uint8Array,
    imageB: Uint8Array
  ): Uint8Array {
    if (imageA.length !== imageB.length) {
      throw new Error("As imagens devem ter o mesmo tamanho.");
    }

    const output = new Uint8Array(imageA.length);

    for (let i = 0; i < imageA.length; i++) {
      const diff = Math.abs(imageA[i] - imageB[i]);
      output[i] = diff;
    }

    return output;
  }

}
