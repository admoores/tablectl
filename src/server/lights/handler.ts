import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { LightStrip } from '../classes/light-strip';
import { SetLightsObj } from './types';

const ws281x = require('rpi-ws281x');
const strip = new LightStrip(144, 18);

export async function setLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetLightsObj;

  strip.setAll(values.red, values.green, values.blue);

  return h.response().code(200);
}
