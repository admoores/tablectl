import { hslToRgb, RGBColor } from "../utils/color";

const ws281x = require('rpi-ws281x');

export class LightStrip {
  pin: number;
  lights: number;
  strip: any;
  emulate: boolean;
  pixels: Uint32Array;

  constructor(lights: number, pin: number, emulate = false) {
    this.pin = pin;
    this.lights = lights
    if (!emulate) {
      ws281x.configure({ leds: this.lights, pin: this.pin, stripType: 'grb' });
    }
    this.strip = ws281x;
    this.emulate = emulate;
    this.pixels = new Uint32Array(this.lights);
  }

  renderPixels() {
    this.strip.render(this.pixels);
  }

  setAll(red: number, green: number, blue: number): void {
    if (this.emulate) {
      return;
    }

    for (let i = 0; i < this.lights; i++) {
      this.pixels[i] = (red << 16) | (green << 8) | blue;

      this.renderPixels();
    }
  }

  setSome(indices: Array<number>, red: number, green: number, blue: number) {
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

  runPixels(red: number, green: number, blue: number) {
    const center = (red << 16) | (green << 8) | blue;
    const oneOff = (red * .6 << 16) | (green * .6 << 8) | blue * .6;
    const twoOff = (red * .2 << 16) | (green * .2 << 8) | blue * .2;

    this.pixels = new Uint32Array(this.lights);
    this.renderPixels();

    new Promise(() => {
      for (let i = 0; i < this.lights; i++) {
        this.pixels = new Uint32Array(this.lights);
        this.pixels[i] = center;
        if (i > 0) this.pixels[i - 1] = oneOff;
        if (i > 1) this.pixels[i - 2] = twoOff;
        if (i < this.lights - 1) this.pixels[i + 1] = oneOff;
        if (i < this.lights - 2) this.pixels[i + 2] = twoOff;

        this.renderPixels();
        this.strip.sleep(50);
      }
    });
  }

  setFire() {

  }

  rainbow() {
    const rainbowPixels = new Uint32Array(this.lights);
    for (let i = 0; i < this.lights; i++) {
      const hueValue = (360 / this.lights) * i;
      const rgbValue: RGBColor = hslToRgb({ h: hueValue, s: 100, l: 50 })

      rainbowPixels[i] = (rgbValue.r << 16) | (rgbValue.g << 8) | rgbValue.b;
    }

    this.pixels = rainbowPixels;
    this.renderPixels();
  }
}