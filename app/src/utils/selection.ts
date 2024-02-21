export const getSelectionText = () => {
  if (window.getSelection) {
    return window.getSelection()?.toString() || ''
  }
  return ''
}