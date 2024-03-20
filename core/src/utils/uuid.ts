import { nanoid } from 'nanoid'

export const createUuid = (length: number = 18) => nanoid(length)

export const createUserId = (length: number = 30) => nanoid(length)

export const createTimestamp = () => Date.now()

export const password = () => createUuid(6)
