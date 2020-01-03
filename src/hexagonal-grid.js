export function gridDimensions(width, height, gridSize) {
  return {
    horizontal: Math.round(width / (gridSize * Math.cos(Math.PI/6))),
    vertical: Math.round(height / ((gridSize / 2) * (1 + Math.sin(Math.PI/6))))
  }
}

export function coordinatesForGridLocation(n, m, gridSize) {
  return {
    x: gridSize * (n + (m % 2) / 2) * Math.cos(Math.PI/6),
    y: gridSize * m * (1 + Math.sin(Math.PI/6)) / 2
  }
}
