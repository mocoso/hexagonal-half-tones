export function gridDimensions(width, height, gridSize) {
  return {
    horizontal: Math.round(width / gridSize),
    vertical: Math.round(height / gridSize)
  }
}

export function coordinatesForGridLocation(n, m, gridSize) {
  return {
    x: (n * gridSize) + ((m % 2) * gridSize * Math.cos(Math.PI/3)),
    y: m * gridSize * 2 * Math.cos(Math.PI/3)
  }
}
