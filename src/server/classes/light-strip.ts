import { hslToRgb, RGBColor } from "../utils/color";

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

    new Promise<void>(() => {
      setInterval(() => {
        if (this.instructionQueue.length) {
          const instruction = this.instructionQueue.shift();
          if (instruction) {
            this.instructionQueue.push(instruction);
            this.pixels = instruction.pixels
            this.renderPixels();

            if (instruction.sleep !== undefined) {
              this.strip.sleep(instruction.sleep);
            }
          }
        } else if (this.pixels.some((p) => { p !== 0 })) {
          this.pixels = new Uint32Array(this.lights);
          this.renderPixels;
        }
      }, 1);
    });

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

      this.renderPixels();
    }
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

      this.renderPixels();
    })
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

  rainbow() {
    this.resetPixels();

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

  demo() {
    this.resetPixels();

    const pixels = new Uint32Array(this.lights);

    this.instructionQueue.push({ pixels, sleep: 2500 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (0 << 16) | (0 << 8) | 255;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (0 << 16) | (255 << 8) | 0;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (0 << 16) | (255 << 8) | 255;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (0 << 8) | 0;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (0 << 8) | 255;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (255 << 8) | 0;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (255 << 16) | (255 << 8) | 255;
    }

    this.instructionQueue.push({ pixels, sleep: 250 });

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