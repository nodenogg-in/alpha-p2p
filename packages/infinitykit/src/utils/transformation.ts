import { type Box, type Transform, type Vec2, isBox } from '..'

export const screenToCanvas = <T extends Vec2>(
  viewport: Box,
  transform: Transform,
  box: T
): T extends Box ? Box : Vec2 => {
  const originX = -viewport.width / 2
  const originY = -viewport.height / 2

  const px = originX + (box.x - viewport.x) - transform.translate.x
  const py = originY + (box.y - viewport.y) - transform.translate.y

  let x = px / transform.scale
  let y = py / transform.scale

  x += viewport.width / 2
  y += viewport.height / 2

  if (isBox(box)) {
    const width = box.width / transform.scale
    const height = box.height / transform.scale
    return {
      x,
      y,
      width,
      height
    } as T extends Box ? Box : Vec2
  } else {
    return {
      x,
      y
    } as T extends Box ? Box : Vec2
  }
}

export const canvasToScreen = <T extends Vec2>(
  viewport: Box,
  transform: Transform,
  box: T,
  scaled: boolean = true
): T extends Box ? Box : Vec2 => {
  // Move origin to center of canvas
  let x = box.x - viewport.width / 2
  let y = box.y - viewport.height / 2

  // Apply scale
  x *= transform.scale
  y *= transform.scale

  // Apply translation
  x += transform.translate.x
  y += transform.translate.y

  // Adjust origin back to the top-left corner of the container
  x = x + viewport.width / 2
  y = y + viewport.height / 2

  if (isBox(box)) {
    // Apply scale to container
    const width = box.width * (scaled ? transform.scale : 1.0)
    const height = box.height * (scaled ? transform.scale : 1.0)
    return {
      x,
      y,
      width,
      height
    } as T extends Box ? Box : Vec2
  } else {
    return {
      x,
      y
    } as T extends Box ? Box : Vec2
  }
}
