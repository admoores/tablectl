import { RGBColor } from "../utils/color";

export interface SetLightsObj extends RGBColor { }

export interface SetSpecificLightsObj extends RGBColor {
  lights: Array<number>;
}
