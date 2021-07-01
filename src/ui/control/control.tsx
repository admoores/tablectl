import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Grid, Input } from '@material-ui/core';
import { DisplayConfig, Asset } from '../../server/update-display/types';
import DisplayImageAsset from '../components/displayImageAsset';

const Control = (): JSX.Element => {
  const [mapList, setMapList] = useState<Array<string>>([]);
  const [displayConfig, setDisplayConfig] = useState<DisplayConfig>();
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [mode, setMode] = useState<string>('add');
  const [assetHeight, setAssetHeight] = useState<number>(5)
  const [assetWidth, setAssetWidth] = useState<number>(5)

  useEffect(() => {
    axios.get('/v1/display/maps').then(mapsRes => {
      setMapList(mapsRes.data as Array<string>);
    })

    axios.get('/v1/display').then(displayConfigRes => {
      setDisplayConfig(displayConfigRes.data);
    })
  }, [])

  function updateValue(): void {
    axios.post('/v1/display', displayConfig).then(res => {
      setDisplayConfig(res.data);
      setIsUpdated(false);
    });
  }

  function resetDisplayConfig(): void {
    axios.get('/v1/display').then(displayConfigRes => {
      setDisplayConfig(displayConfigRes.data);
      setIsUpdated(false);
    })
  }

  function handleAssetClick(key: number): void {
    if (mode === 'delete') {
      const displayConfigClone = JSON.parse(JSON.stringify(displayConfig));
      displayConfigClone.assets.splice(key, 1);
      setDisplayConfig(displayConfigClone);
      setIsUpdated(true);
    }
  }

  function handleDisplayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (mode === 'delete') {
      return;
    }
    const height = e.currentTarget.clientHeight;
    const width = e.currentTarget.clientWidth;
    const xPos = e.clientX - e.currentTarget.offsetLeft;
    const yPos = e.clientY - e.currentTarget.offsetTop;
    const coords = { x: xPos / width * 100, y: yPos / height * 100 }

    const newAsset: Asset = {
      file: '/images/assets/fire/fire1.png',
      top: `${coords.y}%`,
      left: `${coords.x}%`,
      height: `${assetHeight / 5 * 100 / (displayConfig?.heightSquares || 1)}%`,
      width: `${assetWidth / 5 * 100 / (displayConfig?.widthSquares || 1)}%`,
    }

    const displayConfigClone = JSON.parse(JSON.stringify(displayConfig));
    displayConfigClone.assets.push(newAsset);
    setDisplayConfig(displayConfigClone);
    setIsUpdated(true);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <div
          onClick={handleDisplayClick}
          style={{
            height: `${90 * 9 / 16}vw`,
            width: '90vw',
            backgroundImage: `url("${displayConfig?.background}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        >
          <div style={{ position: 'relative', height: '50%', width: '50%' }}>
            {
              displayConfig?.assets.map((asset, idx) => {
                return (
                  <DisplayImageAsset onClickWithKey={handleAssetClick} asset={asset} key={idx} idx={idx} opacity={.75} />
                )
              })
            }
          </div>

        </div>
      </Grid>
      <Grid item container xs={12} spacing={1}>
        {
          mapList.map((mapName) => {
            return (
              <Grid item xs={1} key={mapName} >
                <img style={{ width: '100%', height: 'auto', border: mapName === displayConfig?.background ? '1px solid red' : '1px solid black' }} src={mapName}
                  onClick={() => {
                    const displayConfigClone = JSON.parse(JSON.stringify(displayConfig));
                    displayConfigClone.background = mapName;
                    setDisplayConfig(displayConfigClone);
                    setIsUpdated(true);
                  }}
                />
              </Grid>
            )
          })
        }
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={3}>
          <Button
            onClick={updateValue}
            variant='outlined'
            disabled={!isUpdated}
          >Publish</Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            onClick={resetDisplayConfig}
            variant='outlined'
            disabled={!isUpdated}
          >Reset</Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            onClick={() => {
              if (mode === 'add') {
                setMode('delete');
              } else {
                setMode('add');
              }
            }}
            variant='outlined'
          >{mode === 'delete' ? 'Delete' : 'Add'}</Button>
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={3}>
          <Button onClick={() => {
            setAssetHeight(assetHeight - 5)
          }}>{'<'}</Button>
        </Grid>
        <Grid item xs={3}>
          <h4>Height: {assetHeight}</h4>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={() => {
            setAssetHeight(assetHeight + 5)
          }}>{'>'}</Button>
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={3}>
          <Button onClick={() => {
            setAssetWidth(assetWidth - 5)
          }}>{'<'}</Button>
        </Grid>
        <Grid item xs={3}>
          <h4>Width: {assetWidth}</h4>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={() => {
            setAssetWidth(assetWidth + 5)
          }}>{'>'}</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Control;
