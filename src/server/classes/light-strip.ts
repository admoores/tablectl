const ws281x = require('rpi-ws281x');

export class LightStrip {
  pin: number;
  lights: number;
  strip: any;
  emulate: boolean;

  constructor(lights: number, pin: number, emulate = false) {
    this.pin = pin;
    this.lights = lights
    if (!emulate) {
      ws281x.configure({ leds: this.lights, pin: this.pin, stripType: 'grb' });
    }
    this.strip = ws281x;
    this.emulate = emulate;
  }

  setAll(red: number, green: number, blue: number): void {
    if (this.emulate) {
      return;
    }
    const pixels = new Uint32Array(this.lights);

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (red << 16) | (green << 8) | blue;

      this.strip.render(pixels);
    }
  }

  setSome(indices: Array<number>, red: number, green: number, blue: number) {
    if (this.emulate) {
      return;
    }
    const pixels = new Uint32Array(this.lights);

    indices.forEach((idx) => {
      if (idx >= 0 && idx < this.lights) {
        pixels[idx] = (red << 16) | (green << 8) | blue;
      }

      this.strip.render(pixels);
    })
  }
}