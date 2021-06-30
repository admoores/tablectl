import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { SetLightsObj } from './types';

const ws281x = require('rpi-ws281x');
ws281x.configure({ leds: 10, gpio: 18 });

export async function setLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetLightsObj;

  const pixels = new Uint32Array(10);
  for (let i = 0; i < 10; i++) {
    pixels[i] = (values.red << 16) | (values.green << 8) | (values.blue);
  }

  console.log(JSON.stringify(pixels))

  ws281x.render(pixels);

  return h.response().code(200);
}
