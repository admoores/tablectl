import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import * as os from 'os';
import { LightStrip } from '../classes/light-strip';
import { SetLightsObj, SetSpecificLightsObj } from './types';

const strip = new LightStrip(144, 18, os.hostname() !== 'raspberrypi');

export async function setLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetLightsObj;

  strip.setAll(values.r, values.g, values.b);

  return h.response().code(200);
}

export async function setSpecificLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetSpecificLightsObj;

  strip.setSome(values.lights, values.r, values.g, values.b);

  return h.response().code(200);
}

export async function runLights(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const values = req.payload as SetLightsObj;

  strip.runPixels(values.r, values.g, values.b);

  return h.response().code(200);
}

export async function rainbow(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { brightness } = req.payload as Record<string, any>;

  strip.rainbow(brightness);
  return h.response().code(200);
}

export async function randomFade(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  const { red, green, blue, hueRange, variationDistance } = req.payload as Record<string, number>;

  strip.randomFade(red, green, blue, hueRange, variationDistance);
  return h.response().code(200);
}


export async function demo(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
  strip.demo();
  return h.response().code(200);
}
