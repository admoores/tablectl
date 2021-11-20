import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { UpdateValue, DisplayConfig } from './types';
import * as fs from 'fs';
import * as path from 'path';

let value = 'default';
let displayConfig: DisplayConfig = {
  heightSquares: 14,
  widthSquares: 24,
  background: path.resolve('/images/defaults/bg.png'),
  assets: [
  ]
}

export async function getMaps(): Promise<Array<string>> {
  const files = await fs.promises.readdir(path.resolve('/home/pi/repos/tablectl/src/resources/maps'));
  return files.map(filename => `/images/maps/${filename}`);
}

export async function getMap(req: Request, h: ResponseToolkit): Promise<string> {
  const filename = req.params.name;

  console.log(filename);

  return `/images/maps/${filename}`;
}

export async function getValue(): Promise<string> {
  return value;
}

export async function changeValue(req: Request): Promise<UpdateValue> {
  const payload = req.payload as UpdateValue
  value = payload.value;
  return Promise.resolve(req.payload as UpdateValue);
}

export async function updateDisplayConfig(req: Request): Promise<DisplayConfig> {
  const payload = req.payload as DisplayConfig;
  displayConfig = payload;
  return payload;
}

export async function getDisplayConfig(): Promise<DisplayConfig> {
  return displayConfig;
}