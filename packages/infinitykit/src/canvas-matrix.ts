import { type Box, isBox } from '@figureland/mathkit/box'
import matrix2D, {
  copy,
  getScale,
  identity,
  invert,
  multiply,
  scale as scaleMat2,
  translate
} from '@figureland/mathkit/matrix2D'
import vector2, { type Vector2, add, negate, transformMatrix2D } from '@figureland/mathkit/vector2'
import { type PersistenceName, signal } from '@figureland/statekit'

export const signalCanvasMatrix = () => {
  const state = signal(() => matrix2D(1, 0, 0, 1, 0, 0))

  const previous = signal(() => ({
    transform: matrix2D(),
    distance: 0
  }))

  const screenToCanvas = <T extends Vector2 | Box>(item: T): T => {
    // Create an inverted matrix for screen-to-canvas transformation
    const invTransform = matrix2D()
    invert(invTransform, state.get())

    // Initialize a result object that will either be Vector2 or Box

    // Transform the position
    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, invTransform)

    // Transform dimensions if the item is a Box
    if (isBox(item)) {
      // Assuming a function isBox to check if the item has width and height properties
      const v = vector2()
      const transformedDim = transformMatrix2D(
        v,
        add(v, v, vector2(item.x + item.width, item.y + item.height)),
        invTransform
      )
      result.width = transformedDim.x - result.x
      result.height = transformedDim.y - result.y
    }

    return result as T
  }

  const canvasToScreen = <T extends Vector2 | Box>(item: T): T => {
    const transform = state.get()
    // Initialize a result object that will either be Vector2 or Box

    // Transform the position
    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, state.get())

    // Transform dimensions if the item is a Box
    if (isBox(item)) {
      const transformedDim = transformMatrix2D(
        vector2(),
        vector2(item.x + item.width, item.y + item.height),
        transform
      )
      result.width = transformedDim.x - result.x
      result.height = transformedDim.y - result.y
    }

    return result as T
  }

  const update = (point: Vector2, newScale: Vector2 = vector2(1.0, 1.0)) =>
    state.mutate((existingMatrix) => {
      const newMatrix = translate(matrix2D(), matrix2D(), point)
      scaleMat2(newMatrix, newMatrix, newScale)
      translate(newMatrix, newMatrix, negate(vector2(), point))
      multiply(newMatrix, existingMatrix, newMatrix)
      copy(existingMatrix, newMatrix)
    })

  const scale = signal((get) => getScale(get(state)))

  const reset = () => state.mutate(identity)

  const storePrevious = (distance: number = 0) => {
    previous.set({
      transform: state.get(),
      distance
    })
  }

  return {
    ...state,
    previous,
    storePrevious,
    canvasToScreen,
    screenToCanvas,
    scale,
    update,
    reset
  }
}

export type SignalCanvasMatrix = ReturnType<typeof signalCanvasMatrix>
