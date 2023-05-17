import React, { useState, useEffect, useCallback } from 'react'

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
    if(props instanceof Array || isPrimative(props) || React.isValidElement(props)) {
      children.unshift(props)
      props = null
    }
    return React.createElement(Comp, props, ...children)
  }, {
  get(_, tagName) {
    if(tagName == '_')
      tagName = React.Fragment
    return function() {
      return _(tagName, ...arguments)
    }
  }
})

export
function $$(Cmp) {
  return function() {
    return $(Cmp, ...arguments)
  }
}

/** useEffect but async and no unmount */
export
function useEffect2(watch, effect) {
  useEffect(() => { // 大括号保留！否则会 return effect()
    effect()
  }, watch)
}

export
function useNotMount(watch, effect) {
  const [first, setFirst] = useState(true)
  useEffect2([watch], function exec_effect() {
    if(first) {
      setFirst(false)
      return
    }
    effect()
  })
}

/** useEffect2 but not the first time */
export
function useChange(...args) {
  const watcher = args.pop()
  if(typeof watcher != 'function')
    throw Error('bug: useChange must have a last argument as a callback')
  if(args.length == 0)
    throw Error('bug: useWatch must have at least one watch')
  const [isMount, setIsMount] = useState(true)
  useEffect(() => {
    if(isMount) {
      setIsMount(false)
      return
    }
    watcher()
  }, args)
}

/** pure callback */
export
function useCallback2(fn) {
  return useCallback(fn, [])
}
export { useCallback2 as useCb }

export
function useMount(onMount) {
  useEffect(() => { // 大括号保留！否则会 return onMount()
    onMount()
  }, [])
}

export
function classNames() {
  return Array.from(arguments)
    .flatMap(className)
    .filter(className => className).join(' ')
}
export { classNames as cns }

function className(target) {
  if(typeof target == 'string')
    return target
  
  const classNames = []
  for(let className in target)
    if(target[className])
      classNames.push(className)
  return classNames
}

/** mount 之后，等待 duration 毫秒 */
export
function useWait(duration = 200) {
  const [value, setValue] = useState(false)
  useMount(() => {
    setTimeout(() => {
      setValue(true)
    }, duration)
  })
  return value
}

/** 判断基本数据类型 */
function isPrimative(target) {
  return typeof target != 'object' && typeof target != 'function' || target === null
}
