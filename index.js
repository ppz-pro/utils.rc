import { useState, useEffect } from 'react'
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
      set_is_mount(false)
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