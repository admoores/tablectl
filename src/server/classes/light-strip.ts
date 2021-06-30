const ws281x = require('rpi-ws281x');

export class LightStrip {
  pin: number;
  lights: number;
  strip: any;

  constructor(lights: number, pin: number) {
    this.pin = pin;
    this.lights = lights
    ws281x.configure({ leds: this.lights, pin: this.pin, stripType: 'grb' });
    this.strip = ws281x;
  }

  setAll(red: number, green: number, blue: number): void {
    const pixels = new Uint32Array(this.lights);

    for (let i = 0; i < this.lights; i++) {
      pixels[i] = (red << 16) | (green << 8) | blue;

      this.strip.render(pixels);
    }
  }
}