import { isNumber } from '@figureland/kit/math'

export const createTimestamp = () => Date.now()

export const isValidTimestamp = (input: unknown): input is number => isNumber(input) && input > 0
