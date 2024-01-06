import { kebabCase } from 'scule'
import { is, string } from 'valibot'

export const validateMicrocosmName = (name: string) => is(string(), name) && name.length > 1

export const sanitiseMicrocosmName = (name: string) => kebabCase(name.trim())

export const createTimestamp = () => new Date().toISOString()
