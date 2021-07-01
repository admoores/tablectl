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
    this.pixels = new Uint32Array();
  }

  setAll(red: number, green: number, blue: number): void {
    if (this.emulate) {
      return;
    }

    for (let i = 0; i < this.lights; i++) {
      this.pixels[i] = (red << 16) | (green << 8) | blue;

      this.strip.render(this.pixels);
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

      this.strip.render(this.pixels);
    })
  }
}