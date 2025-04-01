export const createTimestamp = () => Date.now()

export const isValidTimestamp = (input: unknown): input is number =>
  !isNaN(input as number) && (input as number) > 0
