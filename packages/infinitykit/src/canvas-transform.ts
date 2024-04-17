import matrix2D, {
  copy,
  identity,
  isMatrix2D,
  multiply,
  scale,
  translate
} from '@figureland/mathkit/matrix2D'
import vector2, { Vector2, negate } from '@figureland/mathkit/vector2'
import { type PersistenceName, persist, signal } from '@figureland/statekit'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'

export const signalMatrix2D = (persistence?: PersistenceName) => {
  const state = signal(() => matrix2D(1, 0, 0, 1, 0, 0))
  if (persistence) {
    persist(
      state,
      typedLocalStorage({
        name: [...persistence, 'transform'],
        validate: isMatrix2D,
        fallback: state.get,
        interval: 1000
      })
    )
  }

  const update = (point: Vector2, newScale: Vector2) =>
    state.mutate((existingMatrix) => {
      const newMatrix = translate(matrix2D(), matrix2D(), point)
      scale(newMatrix, newMatrix, newScale)
      translate(newMatrix, newMatrix, negate(vector2(), point))
      multiply(newMatrix, existingMatrix, newMatrix)
      copy(existingMatrix, newMatrix)
    })

  const reset = () => state.mutate(identity)
  return {
    ...state,
    update,
    reset
  }
}

export type SignalMatrix2D = ReturnType<typeof signalMatrix2D>
