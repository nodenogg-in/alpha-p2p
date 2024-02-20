import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createUuid } from 'nodenoggin/utils'

type ErrorItem = {
  id: string
  message: string
  origin?: Error
}

const ERROR_STORE_NAME = 'errors'

export const useErrors = defineStore(ERROR_STORE_NAME, () => {
  const errors = ref<ErrorItem[]>([])

  const addError = (message: string, origin?: Error) => {
    errors.value.push({
      id: createUuid(),
      message,
      origin
    })
  }
  return {
    errors,
    addError
  }
})
