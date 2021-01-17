import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { DisplayConfig, Asset } from '../../server/update-display/types';
import DisplayImageAsset from '../components/displayImageAsset';

const Display = (): JSX.Element => {
  const [displayConfig, setDisplayConfig] = useState<DisplayConfig>();

  function getValue(): void {
    axios.get('/v1/display').then(res => {
      setDisplayConfig(res.data)
    })
  }

  function drawAssets(assets: Array<Asset>): void {
    const drawnAssets = displayConfig?.assets.map(asset => {
      return (
        <img src={asset.file}
          key={asset.file}
          style={{
            position: 'relative',
            height: asset.height,
            width: asset.width,
            top: asset.top,
            left: asset.left,
          }}
        />
      )
    })
  }

  useEffect(() => {
    setInterval(getValue, 500);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url("${displayConfig?.background}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}>

      {
        displayConfig?.assets.map((asset, idx) => {
          return (
            <DisplayImageAsset asset={asset} key={idx} idx={idx} />
          )
        })
      }

    </div>
  )
};

export default Display;
