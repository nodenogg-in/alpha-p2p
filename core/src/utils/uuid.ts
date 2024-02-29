import { nanoid } from 'nanoid'

export const createUuid = (prefix: string, l: number = 18) => `${prefix}/${nanoid(l)}`

export const createUserId = () => createUuid('user', 36)

export const createTimestamp = () => Date.now()

export const password = (l: number = 6) => nanoid(l)
