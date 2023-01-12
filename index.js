const { useState, useEffect } = require('react')

/** 返回一个 watch 对象，和更新它的函数 */
exports.useFlag = function() {
  const [flag, setFlag] = useState(0)
  return [
    flag,
    () => setFlag(flag => flag + 1)
  ]
}

/** 给我一个 api，我给你数据 */
exports.useGetState = function({
  get, ifGet = true, defaultValue, map,
  watch = []
}) {
  const [flag, update] = exports.useFlag()
  watch.push(flag)
  const [state, _setState] = useState(defaultValue)
  const setState = s => _setState(map ? map(s) : s)

  useEffect(() => {
    if(!ifGet) return

    const res = get()
    if(res instanceof Promise)
      res.then(setState)
    else
      setState(res)
  }, watch)
  return [state, update] // 单一控制原则，setState 不外传
}
