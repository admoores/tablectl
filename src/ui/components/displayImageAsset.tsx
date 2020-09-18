import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { DisplayConfig, Asset } from '../../server/update-display/types';

const DisplayImageAsset = (props: { asset: Asset, idx: number, onClickWithKey?: (key: number) => void, opacity?: number }): JSX.Element => {

  const { asset, idx, onClickWithKey, opacity } = props;

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if (onClickWithKey) {
      e.preventDefault();
      onClickWithKey(idx);
    }
  }

  return (
    <img src={asset.file}
      onClick={handleClick}
      style={{
        opacity: opacity,
        position: 'absolute',
        height: asset.height,
        width: asset.width,
        top: asset.top,
        left: asset.left,
        transform: 'translate(-50%, -50%)'
      }}
    />
  )
};

export default DisplayImageAsset;
