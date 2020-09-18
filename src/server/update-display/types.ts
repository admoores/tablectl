export interface UpdateValue {
  value: string
}

export interface Asset {
  file: string,
  top: string,
  left: string,
  height: string,
  width: string,
}

export interface DisplayConfig {
  heightSquares: number,
  widthSquares: number,
  background: string,
  assets: Array<Asset>,
}