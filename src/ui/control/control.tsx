import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Grid, Input, Card } from '@material-ui/core';
import { DisplayConfig, Asset } from '../../server/update-display/types';
import DisplayImageAsset from '../components/displayImageAsset';
import { Color, ColorPicker, createColor } from "material-ui-color";


const Control = (): JSX.Element => {
  const [color, setColor] = useState<Color>(createColor('white'));

  function submitColor(): void {
    axios.post('/v1/lights', {
      red: color.rgb[0],
      green: color.rgb[1],
      blue: color.rgb[2],
    })
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={3}>
          <ColorPicker value={color} onChange={setColor} />
        </Grid>
        <Grid xs={3}>

          <Button onClick={submitColor}>Set Color</Button>
        </Grid>

      </Grid>

      <h4>{JSON.stringify(color)}</h4>
    </>
  )
}
export default Control;
