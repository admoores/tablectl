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

      </Grid>
    </>
  )
}
export default Control;
