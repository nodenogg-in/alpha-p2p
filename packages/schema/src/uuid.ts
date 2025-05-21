import { init } from '@paralleldrive/cuid2'

const uuidFn = init({
  random: Math.random,
  length: 16,
  fingerprint: 'nodenogg.in'
})

export const createUUID = (prefix: string = '') => `${prefix ? `${prefix}` : ''}${uuidFn()}`

export const isValidUUID = (input: string): boolean => {
  const regex = /^[0-9A-Za-z]+$/
  return regex.test(input)
}
