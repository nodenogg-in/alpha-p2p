export const isValidURL = (url: string) => {
  try {
    new URL(url);
    console.log(url)
    return true;
  } catch (error) {
    return false;
  }
};
