import { kebabCase } from 'scule'

const myworker = () => {
  const value = Math.random()
  console.log(kebabCase)
  return value
}

onmessage = () => {
  console.log('Message received from main script')
  const workerResult = myworker()
  postMessage(workerResult)
}
