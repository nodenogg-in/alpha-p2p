import { UIState } from './state/UIState'
import { AppState } from './state/AppState'

export namespace Instance {
  export const ui = new UIState()
  export const app = new AppState()
}
