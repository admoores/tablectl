import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import * as os from 'os';
import { LightStrip } from '../classes/light-strip';
import { SetLightsObj, SetSpecificLightsObj } from './types';

const strip = new LightStrip(144, 18, os.hostname() !== 'raspberrypi');

export async function setLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetLightsObj;

  strip.setAll(values.red, values.green, values.blue);

  return h.response().code(200);
}

export async function setSpecificLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetSpecificLightsObj;

  strip.setSome(values.lights, values.red, values.green, values.blue);

  return h.response().code(200);
}

export async function runLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetLightsObj;

  strip.runPixels(values.red, values.green, values.blue);

  return h.response().code(200);
}

