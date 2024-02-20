import type { Size } from '../schema/spatial.schema'
import { round } from '../utils/number'

export const fitAspectRatio = (
  item: Size,
  container: Size,
  padding: [number, number] = [0, 0]
): Size => {
  // Apply padding to container container
  const containerWidth = container.width - 2 * padding[0]
  const containerHeight = container.height - 2 * padding[1]

  // Calculate the aspect ratio of the input container
  const inputAspectRatio = item.width / item.height

  // Set output container to input container initially
  let outputWidth = item.width
  let outputHeight = item.height

  // Check if input container exceed container container in either dimension
  if (item.width > containerWidth || item.height > containerHeight) {
    // Calculate the maximum output container that maintain the aspect ratio
    outputWidth = containerWidth
    outputHeight = round(outputWidth / inputAspectRatio)

    // Check if the output height is larger than the container height
    if (outputHeight > containerHeight) {
      outputHeight = containerHeight
      outputWidth = round(outputHeight * inputAspectRatio)
    }
  }

  return {
    width: outputWidth,
    height: outputHeight
  }
}
