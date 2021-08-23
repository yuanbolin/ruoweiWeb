// eslint-disable-next-line import/prefer-default-export
export const dva = {
  config: {
    onError(e) {
      e.preventDefault()
      console.error(e.message)
    }
  }
  // plugins: [require('dva-logger')()],
}
