import React, { useState, useEffect } from 'react'

/** 返回一个 watch 对象，和更新它的函数 */
export
function useFlag() {
  const [flag, setFlag] = useState(0)
  return [
    flag,
    () => setFlag(flag => flag + 1)
  ]
}

/** simpler React.render */
export
const $ = new Proxy(
  function(Comp, props, ...children) {
    if(props instanceof Array || typeof props == 'string' || React.isValidElement(props)) {
      children.unshift(props)
      props = null
    }
    return React.createElement(Comp, props, ...children)
  }, {
  get(_, tagName) {
    return function() {
      return _(tagName, ...arguments)
    }
  }
})

/** useEffect but async and no unmount */
export
function useEffect2(effect, watch) {
  useEffect(() => { // 大括号保留！否则会 return effect()
    effect()
  }, watch)
}

export
function useMount(onMount) {
  useEffect(() => { // 大括号保留！否则会 return onMount()
    onMount()
  }, [])
}
