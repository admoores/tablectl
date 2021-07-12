import { HSLColor, hslToRgb, RGBColor, rgbToHsl } from "../utils/color";

const ws281x = require('rpi-ws281x');

interface Instruction {
  pixels: Uint32Array;
  sleep?: number;
}

export class LightStrip {
  pin: number;
  lights: number;
  strip: any;
  emulate: boolean;
  pixels: Uint32Array;

  instructionQueue: Array<Instruction> = [];

  constructor(lights: number, pin: number, emulate = false) {
    this.pin = pin;
    this.lights = lights
    if (!emulate) {
      ws281x.configure({ leds: this.lights, pin: this.pin, stripType: 'grb' });
    }
    this.strip = ws281x;
    this.emulate = emulate;
    this.pixels = new Uint32Array(this.lights);

    const context = this;
    function takeAction(): void {
      if (context.instructionQueue.length) {
        const instruction = context.instructionQueue.shift();
        if (instruction) {
          context.instructionQueue.push(instruction);
          context.pixels = instruction.pixels
          context.renderPixels();

          if (instruction.sleep !== undefined) {
            context.strip.sleep(instruction.sleep);
          }
        }
      } else if (context.pixels.some((p) => { p !== 0 })) {
        context.pixels = new Uint32Array(context.lights);
        context.renderPixels;
      }

      setTimeout(takeAction, 1)
    }

    takeAction();

  }

  renderPixels() {
    this.strip.render(this.pixels);
  }

  resetPixels() {
    this.instructionQueue = [];
    this.pixels = new Uint32Array(this.lights);
    this.renderPixels();
  }

  setAll(red: number, green: number, blue: number): void {
    this.resetPixels();

    if (this.emulate) {
      return;
    }

    for (let i = 0; i < this.lights; i++) {
      this.pixels[i] = (red << 16) | (green << 8) | blue;
    }
    this.renderPixels();
  }

  setSome(indices: Array<number>, red: number, green: number, blue: number) {
    this.resetPixels();

    if (this.emulate) {
      return;
    }

    indices.forEach((idx) => {
      if (idx >= 0 && idx < this.lights) {
        this.pixels[idx] = (red << 16) | (green << 8) | blue;
      }
    })
    this.renderPixels();
  }

  runPixels(red: number, green: number, blue: number): void {
    const center = (red << 16) | (green << 8) | blue;
    const oneOff = (red * .6 << 16) | (green * .6 << 8) | blue * .6;
    const twoOff = (red * .2 << 16) | (green * .2 << 8) | blue * .2;

    this.resetPixels();

    for (let i = 0; i < this.lights; i++) {
      const walkingPixels = new Uint32Array(this.lights);
      walkingPixels[i] = center;
      if (i > 0) walkingPixels[i - 1] = oneOff;
      if (i > 1) walkingPixels[i - 2] = twoOff;
      if (i < this.lights - 1) walkingPixels[i + 1] = oneOff;
      if (i < this.lights - 2) walkingPixels[i + 2] = twoOff;

      this.instructionQueue.push({ pixels: walkingPixels, sleep: 50 });
    }
  }

  setFire() {

  }

  randomFade(red: number, green: number, blue: number, hueRange: number, variationDistance: number) {
    this.resetPixels();

    const baseColor = rgbToHsl({ r: red, g: green, b: blue });
    let nextColor = rgbToHsl({ r: red, g: green, b: blue });
    const pixelSet = new Uint32Array(this.lights);

    let stepSize = hueRange / variationDistance;

    for (let i = 0; i < this.lights; i++) {
      const nextColorRGB = hslToRgb(nextColor);
      pixelSet[i] = (nextColorRGB.r << 16) | (nextColorRGB.g << 8) | (nextColorRGB.b);

      let newHue = nextColor.h;

      if (newHue > baseColor.h + hueRange / 2 || newHue >= 1) {
        stepSize = (hueRange / variationDistance) * -1;
      } else if (newHue < baseColor.h - hueRange / 2 || newHue <= 0) {
        stepSize = hueRange / variationDistance;
      }

      newHue += stepSize;

      nextColor = {
        ...nextColor,
        h: newHue
      }
    }

    for (let j = 0; j < this.lights; j++) {
      const rotatedPixelSet = new Uint32Array(this.lights);
      for (let c = 0; c < this.lights; c++) {
        rotatedPixelSet[c] = pixelSet[(c + j) % this.lights];
      }
      this.instructionQueue.push({ pixels: rotatedPixelSet, sleep: 50 });
    }
  }

  rainbow(brightness: number) {
    this.resetPixels();

    for (let j = 0; j < this.lights; j++) {
      const rainbowPixels = new Uint32Array(this.lights);
      for (let i = 0; i < this.lights; i++) {
        const hueValue = (1 / this.lights) * i;
        const rgbValue: RGBColor = hslToRgb({ h: hueValue, s: 1, l: .5 })
        rainbowPixels[(i + j) % this.lights] = ((rgbValue.r * (brightness / 255)) << 16) | ((rgbValue.g * (brightness / 255)) << 8) | rgbValue.b * (brightness / 255);
      }
      this.instructionQueue.push({ pixels: rainbowPixels, sleep: 10 });
    }
  }

  demo() {
    this.resetPixels();

    let pixels = new Uint32Array(this.lights);
    this.instructionQueue.push({ pixels, sleep: 2500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (0 << 16) | (0 << 8) | 255;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (0 << 16) | (255 << 8) | 0;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (0 << 16) | (255 << 8) | 255;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (0 << 8) | 0;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (0 << 8) | 255;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (255 << 8) | 0;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });

    pixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (255 << 8) | 255;
    }
    this.instructionQueue.push({ pixels, sleep: 500 });


    const center = (255 << 16) | (255 << 8) | 255;
    const oneOff = (255 * .75 << 16) | (255 * .75 << 8) | 255 * .75;
    const twoOff = (255 * .5 << 16) | (255 * .5 << 8) | 255 * .5;
    const threeOff = (255 * .25 << 16) | (255 * .25 << 8) | 255 * .25;

    for (let i = 0; i < this.lights; i++) {
      const walkingPixels = new Uint32Array(this.lights);
      walkingPixels[i] = center;
      if (i > 0) walkingPixels[i - 1] = oneOff;
      if (i > 1) walkingPixels[i - 2] = twoOff;
      if (i > 2) walkingPixels[i - 2] = threeOff;
      if (i < this.lights - 1) walkingPixels[i + 1] = oneOff;
      if (i < this.lights - 2) walkingPixels[i + 2] = twoOff;
      if (i < this.lights - 3) walkingPixels[i + 2] = threeOff;

      this.instructionQueue.push({ pixels: walkingPixels, sleep: 25 });
    }


    for (let c = 0; c < 10; c++) {
      for (let j = 0; j < this.lights; j++) {
        const rainbowPixels = new Uint32Array(this.lights);
        for (let i = 0; i < this.lights; i++) {
          const hueValue = (1 / this.lights) * i;
          const rgbValue: RGBColor = hslToRgb({ h: hueValue, s: 1, l: .5 })
          rainbowPixels[(i + j) % this.lights] = (rgbValue.r << 16) | (rgbValue.g << 8) | rgbValue.b;
        }
        this.instructionQueue.push({ pixels: rainbowPixels, sleep: 10 });
      }
    }
  }
}