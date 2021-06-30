import { Request } from '@hapi/hapi';

const ws281x = require('rpi-ws281x');
ws281x.configure({ leds: 10, gpio: 18 });

export async function setLights(req: Request): Promise<void> {
  const pixels = new Uint32Array(10);
  for (let i = 0; i < 10; i++) {
    pixels[i] = (255 << 16) | (255 << 8) | (255);
  }

  ws281x.render(pixels);
}
