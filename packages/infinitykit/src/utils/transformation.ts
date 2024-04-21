export {}

// import { type Box, type Transform, type Vec2, isBox } from '..'

// export const screenToCanvas = <T extends Vec2 | Box>(
//   viewport: Box,
//   transform: Transform,
//   item: T
// ): T extends Box ? Box : Vec2 => {
//   let matrix = mat2d.create()

//   // Adjust matrix for screen to canvas conversion
//   mat2d.translate(matrix, matrix, [-viewport.width / 2, -viewport.height / 2])
//   mat2d.scale(matrix, matrix, [1 / transform.scale, 1 / transform.scale])
//   mat2d.translate(matrix, matrix, [-transform.translate.x, -transform.translate.y])
//   mat2d.translate(matrix, matrix, [viewport.width / 2, viewport.height / 2])

//   // Transform the point or box
//   const result = vec2.transformMat2d(vec2.create(), [item.x, item.y], matrix)

//   if (isBox(item)) {
//     const bottomRight = vec2.transformMat2d(
//       vec2.create(),
//       [item.x + item.width, item.y + item.height],
//       matrix
//     )
//     return {
//       x: result[0],
//       y: result[1],
//       width: bottomRight[0] - result[0],
//       height: bottomRight[1] - result[1]
//     } as T extends Box ? Box : Vec2
//   } else {
//     return {
//       x: result[0],
//       y: result[1]
//     } as T extends Vec2 ? Box : Vec2
//   }
// }

// export const canvasToScreen = <T extends Vec2 | Box>(
//   viewport: Box,
//   transform: Transform,
//   item: T
// ): T extends Box ? Box : Vec2 => {
//   let matrix = mat2d.create()

//   // Construct the matrix for canvas to screen conversion
//   mat2d.translate(matrix, matrix, [viewport.width / 2, viewport.height / 2])
//   mat2d.scale(matrix, matrix, [transform.scale, transform.scale])
//   mat2d.translate(matrix, matrix, [transform.translate.x, transform.translate.y])
//   mat2d.translate(matrix, matrix, [-viewport.width / 2, -viewport.height / 2])

//   // Apply the matrix to the point or box
//   const result = vec2.transformMat2d(vec2.create(), [item.x, item.y], matrix)

//   if (isBox(item)) {
//     // For a Box, transform the opposite corner to calculate new width and height
//     const bottomRight = vec2.transformMat2d(
//       vec2.create(),
//       [item.x + item.width, item.y + item.height],
//       matrix
//     )
//     return {
//       x: result[0],
//       y: result[1],
//       width: Math.abs(bottomRight[0] - result[0]), // Ensure positive dimensions
//       height: Math.abs(bottomRight[1] - result[1])
//     } as T extends Box ? Box : Vec2
//   } else {
//     return {
//       x: result[0],
//       y: result[1]
//     } as T extends Box ? Box : Vec2
//   }
// }

// // export const screenToCanvas = <T extends Vec2>(
// //   viewport: Box,
// //   transform: Transform,
// //   box: T
// // ): T extends Box ? Box : Vec2 => {
// //   const originX = -viewport.width / 2
// //   const originY = -viewport.height / 2

// //   const px = originX + (box.x - viewport.x) - transform.translate.x
// //   const py = originY + (box.y - viewport.y) - transform.translate.y

// //   let x = px / transform.scale
// //   let y = py / transform.scale

// //   x += viewport.width / 2
// //   y += viewport.height / 2

// //   if (isBox(box)) {
// //     const width = box.width / transform.scale
// //     const height = box.height / transform.scale
// //     return {
// //       x,
// //       y,
// //       width,
// //       height
// //     } as T extends Box ? Box : Vec2
// //   } else {
// //     return {
// //       x,
// //       y
// //     } as T extends Box ? Box : Vec2
// //   }
// // }

// // export const canvasToScreen = <T extends Vec2>(
// //   viewport: Box,
// //   transform: Transform,
// //   box: T,
// //   scaled: boolean = true
// // ): T extends Box ? Box : Vec2 => {
// //   // Move origin to center of canvas
// //   let x = box.x - viewport.width / 2
// //   let y = box.y - viewport.height / 2

// //   // Apply scale
// //   x *= transform.scale
// //   y *= transform.scale

// //   // Apply translation
// //   x += transform.translate.x
// //   y += transform.translate.y

// //   // Adjust origin back to the top-left corner of the container
// //   x = x + viewport.width / 2
// //   y = y + viewport.height / 2

// //   if (isBox(box)) {
// //     // Apply scale to container
// //     const width = box.width * (scaled ? transform.scale : 1.0)
// //     const height = box.height * (scaled ? transform.scale : 1.0)
// //     return {
// //       x,
// //       y,
// //       width,
// //       height
// //     } as T extends Box ? Box : Vec2
// //   } else {
// //     return {
// //       x,
// //       y
// //     } as T extends Box ? Box : Vec2
// //   }
// // }
