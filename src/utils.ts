import { kebabCase } from 'scule'

export const validateMicrocosmName = (name: string) => {
  return !!name && name.length > 1
}

export const sanitiseMicrocosmName = (name: string) => kebabCase(name.trim())

export const createTimestamp = () => new Date().toISOString()
