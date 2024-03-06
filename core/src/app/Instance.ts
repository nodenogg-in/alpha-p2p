import { UIState } from './state/UIState'
import { SessionState } from './state/SessionState'

export namespace Instance {
  export const ui = new UIState()
  export const session = new SessionState()
}
