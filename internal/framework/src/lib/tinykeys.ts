// A copy of this library, copied over because of this error https://github.com/jamiebuilds/tinykeys/issues/191

import type { Unsubscribe } from '@figureland/statekit'

// MIT License

// Copyright (c) 2020 Jamie Kyle

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

type Timeout = ReturnType<typeof setTimeout>

type KeyBindingPress = [string[], string]

/**
 * A map of keybinding strings to event handlers.
 */
export interface KeyBindingMap {
  [keybinding: string]: (event: KeyboardEvent) => void
}

export interface KeyBindingHandlerOptions {
  /**
   * Keybinding sequences will wait this long between key presses before
   * cancelling (default: 1000).
   *
   * **Note:** Setting this value too low (i.e. `300`) will be too fast for many
   * of your users.
   */
  timeout?: number
}

/**
 * Options to configure the behavior of keybindings.
 */
export interface KeyBindingOptions extends KeyBindingHandlerOptions {
  /**
   * Key presses will listen to this event (default: "keydown").
   */
  event?: 'keydown' | 'keyup'
}

/**
 * These are the modifier keys that change the meaning of keybindings.
 *
 * Note: Ignoring "AltGraph" because it is covered by the others.
 */
const KEYBINDING_MODIFIER_KEYS = ['Shift', 'Meta', 'Alt', 'Control']

/**
 * Keybinding sequences should timeout if individual key presses are more than
 * 1s apart by default.
 */
const DEFAULT_TIMEOUT = 1000

/**
 * Keybinding sequences should bind to this event by default.
 */
const DEFAULT_EVENT = 'keydown'

/**
 * Platform detection code.
 * @see https://github.com/jamiebuilds/tinykeys/issues/184
 */
const PLATFORM = typeof navigator === 'object' ? navigator.platform : ''
const APPLE_DEVICE = /Mac|iPod|iPhone|iPad/.test(PLATFORM)

/**
 * An alias for creating platform-specific keybinding aliases.
 */
const MOD = APPLE_DEVICE ? 'Meta' : 'Control'

/**
 * Meaning of `AltGraph`, from MDN:
 * - Windows: Both Alt and Ctrl keys are pressed, or AltGr key is pressed
 * - Mac: ⌥ Option key pressed
 * - Linux: Level 3 Shift key (or Level 5 Shift key) pressed
 * - Android: Not supported
 * @see https://github.com/jamiebuilds/tinykeys/issues/185
 */
const ALT_GRAPH_ALIASES = PLATFORM === 'Win32' ? ['Control', 'Alt'] : APPLE_DEVICE ? ['Alt'] : []

/**
 * There's a bug in Chrome that causes event.getModifierState not to exist on
 * KeyboardEvent's for F1/F2/etc keys.
 */
function getModifierState(event: KeyboardEvent, mod: string) {
  return typeof event.getModifierState === 'function'
    ? event.getModifierState(mod) ||
        (ALT_GRAPH_ALIASES.includes(mod) && event.getModifierState('AltGraph'))
    : false
}

/**
 * Parses a "Key Binding String" into its parts
 *
 * grammar    = `<sequence>`
 * <sequence> = `<press> <press> <press> ...`
 * <press>    = `<key>` or `<mods>+<key>`
 * <mods>     = `<mod>+<mod>+...`
 */
export function parseKeybinding(str: string): KeyBindingPress[] {
  return str
    .trim()
    .split(' ')
    .map((press) => {
      let mods = press.split(/\b\+/)
      const key = mods.pop() as string
      mods = mods.map((mod) => (mod === '$mod' ? MOD : mod))
      return [mods, key]
    })
}

/**
 * This tells us if a series of events matches a key binding sequence either
 * partially or exactly.
 */
function match(event: KeyboardEvent, press: KeyBindingPress): boolean {
  // prettier-ignore
  return !(
		// Allow either the `event.key` or the `event.code`
		// MDN event.key: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
		// MDN event.code: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
		(
			press[1].toUpperCase() !== event.key.toUpperCase() &&
			press[1] !== event.code
		) ||

		// Ensure all the modifiers in the keybinding are pressed.
		press[0].find(mod => {
			return !getModifierState(event, mod)
		}) ||

		// KEYBINDING_MODIFIER_KEYS (Shift/Control/etc) change the meaning of a
		// keybinding. So if they are pressed but aren't part of the current
		// keybinding press, then we don't have a match.
		KEYBINDING_MODIFIER_KEYS.find(mod => {
			return !press[0].includes(mod) && press[1] !== mod && getModifierState(event, mod)
		})
	)
}

/**
 * Creates an event listener for handling keybindings.
 *
 * @example
 * ```js
 * import { createKeybindingsHandler } from "../src/keybindings"
 *
 * let handler = createKeybindingsHandler({
 * 	"Shift+d": () => {
 * 		alert("The 'Shift' and 'd' keys were pressed at the same time")
 * 	},
 * 	"y e e t": () => {
 * 		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
 * 	},
 * 	"$mod+d": () => {
 * 		alert("Either 'Control+d' or 'Meta+d' were pressed")
 * 	},
 * })
 *
 * window.addEvenListener("keydown", handler)
 * ```
 */
export function createKeybindingsHandler(
  keyBindingMap: KeyBindingMap,
  options: KeyBindingHandlerOptions = {}
): EventListener {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT

  const keyBindings = Object.keys(keyBindingMap).map((key) => {
    return [parseKeybinding(key), keyBindingMap[key]] as const
  })

  const possibleMatches = new Map<KeyBindingPress[], KeyBindingPress[]>()
  let timer: number | null | Timeout = null

  return (event) => {
    // Ensure and stop any event that isn't a full keyboard event.
    // Autocomplete option navigation and selection would fire a instanceof Event,
    // instead of the expected KeyboardEvent
    if (!(event instanceof KeyboardEvent)) {
      return
    }

    keyBindings.forEach((keyBinding) => {
      const sequence = keyBinding[0]
      const callback = keyBinding[1]

      const prev = possibleMatches.get(sequence)
      const remainingExpectedPresses = prev ? prev : sequence
      const currentExpectedPress = remainingExpectedPresses[0]

      const matches = match(event, currentExpectedPress)

      if (!matches) {
        // Modifier keydown events shouldn't break sequences
        // Note: This works because:
        // - non-modifiers will always return false
        // - if the current keypress is a modifier then it will return true when we check its state
        // MDN: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
        if (!getModifierState(event, event.key)) {
          possibleMatches.delete(sequence)
        }
      } else if (remainingExpectedPresses.length > 1) {
        possibleMatches.set(sequence, remainingExpectedPresses.slice(1))
      } else {
        possibleMatches.delete(sequence)
        callback(event)
      }
    })

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(possibleMatches.clear.bind(possibleMatches), timeout)
  }
}

/**
 * Subscribes to keybindings.
 *
 * Returns an unsubscribe method.
 *
 * @example
 * ```js
 * import { tinykeys } from "../src/tinykeys"
 *
 * tinykeys(window, {
 * 	"Shift+d": () => {
 * 		alert("The 'Shift' and 'd' keys were pressed at the same time")
 * 	},
 * 	"y e e t": () => {
 * 		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
 * 	},
 * 	"$mod+d": () => {
 * 		alert("Either 'Control+d' or 'Meta+d' were pressed")
 * 	},
 * })
 * ```
 */
export function tinykeys(
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  options: KeyBindingOptions = {}
): Unsubscribe {
  const event = options.event ?? DEFAULT_EVENT
  const onKeyEvent = createKeybindingsHandler(keyBindingMap, options)

  const handler = (e: Event) => {
    const isInput = e.target instanceof HTMLInputElement
    const isContentEditable = e.target instanceof HTMLElement && e.target.isContentEditable
    const isTextArea = e.target instanceof HTMLTextAreaElement
    if (!isInput && !isContentEditable && !isTextArea) {
      onKeyEvent(e)
    }
  }

  target.addEventListener(event, handler)

  return () => {
    target.removeEventListener(event, handler)
  }
}
