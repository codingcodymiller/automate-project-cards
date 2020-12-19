;(async () => {
  const params = new URLSearchParams(location.search)
  const code = params.get('code')
  console.log(code)
})()
