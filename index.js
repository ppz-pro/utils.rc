import { useState, useEffect, useCallback, useMemo } from 'react'
export { default as E } from './create_element.js'
export { default as useAsync_get } from './use_async_get.js'

/** useEffect but async and no unmount */
export
function useEffect2(watch, effect) {
  useEffect(() => { // 大括号保留！否则会 return effect()
    effect()
  }, watch)
}

export
function useCallback2(watch, cb) {
  return useCallback(cb, watch)
}

export
function useMemo2(watch, factory) {
  return useMemo(factory, watch)
}

export
function useState2(init_value) {
  const [value, set] = useState(init_value)
  return { value, set }
}

export
function useMount(on_mount) {
  useEffect(() => { // 大括号保留！否则会 return on_mount()
    on_mount()
  }, [])
}

export
function useIs_mount() {
  const [is_mount, set_is_mount] = useState(true)
  useMount(function on_mount() {
    set_is_mount(false)
  })
  return is_mount
}

export
function useWatch(target, effect) {
  const [is_mount, set_is_mount] = useState(true)
  useEffect2(target, () => {
    if(is_mount)
      set_is_mount(false) // bug: 这里好像会执行多次（有可能是开发模式下会立即 unmount 再重新 mount 造成的）
    else
      effect()
  })
}

/** 返回一个 watch 对象，和更新它的函数 */
export
function useFlag() {
  const [value, set_value] = useState(0)
  return {
    value,
    update() {
      set_value(value + 1)
    }
  }
}
