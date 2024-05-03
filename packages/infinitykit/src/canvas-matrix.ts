import {
  matrix2D,
  copy,
  getScale,
  identity,
  multiply,
  scale as scaleMat2,
  translate
} from '@figureland/mathkit/matrix2D'
import { type Vector2, type Matrix2D, vector2, negate } from '@figureland/mathkit/vector2'
import { type Signal, manager, signal } from '@figureland/statekit'

export const signalCanvasMatrix = (): SignalCanvasMatrix => {
  const { use, dispose } = manager()
  const state = use(signal(() => matrix2D(1, 0, 0, 1, 0, 0)))
  const scale = use(signal((get) => getScale(get(state))))

  const previous = use(
    signal(() => ({
      transform: matrix2D(),
      distance: 0
    }))
  )
  const update = (point: Vector2, newScale: Vector2 = vector2(1.0, 1.0)) =>
    state.mutate((existingMatrix) => {
      const newMatrix = translate(matrix2D(), matrix2D(), point)
      scaleMat2(newMatrix, newMatrix, newScale)
      translate(newMatrix, newMatrix, negate(vector2(), point))
      multiply(newMatrix, existingMatrix, newMatrix)
      copy(existingMatrix, newMatrix)
    })

  const reset = () => state.mutate(identity)

  const storePrevious = (distance: number = 0) => {
    previous.set({
      transform: state.get(),
      distance
    })
  }

  return {
    ...state,
    dispose,
    previous,
    storePrevious,
    scale,
    update,
    reset
  }
}

export type SignalCanvasMatrix = Signal<Matrix2D> & {
  previous: Signal<{ transform: Matrix2D; distance: number }>
  storePrevious: (distance?: number) => void
  scale: Signal<number>
  update: (point: Vector2, newScale?: Vector2) => void
  reset: () => void
}
