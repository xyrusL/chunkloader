export interface CoordinateFormatOptions {
  chunkCoordinates?: boolean;
  binaryCoordinates?: boolean;
}

export function formatWorldCoordinate(value: number, options: CoordinateFormatOptions): string {
  if (options.binaryCoordinates) {
    return `0b${Math.round(value).toString(2)}`;
  }

  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return String(Math.round(value));
}
