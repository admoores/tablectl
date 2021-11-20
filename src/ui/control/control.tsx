import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Grid, Input, Card } from '@material-ui/core';
import { DisplayConfig, Asset } from '../../server/update-display/types';
import DisplayImageAsset from '../components/displayImageAsset';
import { Color, ColorPicker, createColor } from "material-ui-color";
import { RGBColor } from '../../server/utils/color';


const Control = (): JSX.Element => {
  const [color, setColor] = useState<Color>(createColor('white'));

  function submitColor(): void {
    const colorPayload: RGBColor = {
      r: color.rgb[0],
      g: color.rgb[1],
      b: color.rgb[2],
    }

    axios.post('/v1/lights', colorPayload);
  }

  function submitPattern(pattern: object): void {
    axios.post('/v1/lights/randomFade', pattern)
  }

  function submitDirectColor(color: object): void {
    axios.post('/v1/lights', color)
  }

  return (
    <>
      <Grid
        container
        spacing={1} style={{ maxWidth: '1000px', minHeight: '90vh', margin: 'auto', marginTop: '16px', border: '1px solid #434343', padding: '16px' }}
        justify="center">
        <Grid xs={3}>
          <ColorPicker value={color} onChange={setColor} />
        </Grid>
        <Grid xs={3}>

          <Button onClick={submitColor}>Set Color</Button>
        </Grid>

        <Grid xs={12} />

        <Grid xs={3}>
          <Button
            onClick={() => {
              submitPattern({
                "red": 0,
                "green": 255,
                "blue": 100,
                "hueRange": 0.15,
                "variationDistance": 30
              })
            }}>
            Greenish Fade
          </Button>
        </Grid>

        <Grid xs={3}>
          <Button
            onClick={() => {
              submitPattern({
                "red": 255,
                "green": 25,
                "blue": 25,
                "hueRange": 0.15,
                "variationDistance": 30
              })
            }}>
            Reddish Fade
          </Button>
        </Grid>

        <Grid xs={3}>
          <Button
            onClick={() => {
              submitPattern({
                "red": 255,
                "green": 0,
                "blue": 255,
                "hueRange": 0.15,
                "variationDistance": 30
              })
            }}>
            Purple Fade
          </Button>
        </Grid>

        <Grid xs={3}>
          <Button
            onClick={() => {
              submitDirectColor(
                {
                  "r": 0,
                  "g": 0,
                  "b": 0
                }
              )
            }}>
            Clear
          </Button>
        </Grid>

      </Grid>
    </>
  )
}
export default Control;
