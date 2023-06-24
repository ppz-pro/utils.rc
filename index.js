import React, { useState, useEffect } from 'react'

/** simpler React.createElement */
export
const $ = new Proxy(
  function(Comp, props, ...children) {
    if(props instanceof Array || is_primative(props) || React.isValidElement(props)) {
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

/** another simpler React.createElement */
export
const O = new Proxy(
  /** 仅识别参数 props 是 “属性” 还是 “第一个元素” */
  function create_element(Cmp, props, ...children) {
    if(props instanceof Array || is_primative(props) || React.isValidElement(props)) {
      children.unshift(props)
      props = null
    }
    return React.createElement(Cmp, props, ...children)
  },
  {
    /** “原生 html 标签” 和 “React.Fragment” */
    get(ce, tag_name) {
      return function create_raw_element() {
        if(tag_name == '_')
          tag_name = React.Fragment
        return ce(tag_name, ...arguments)
      }
    },
    /** React 组件 */
    apply(ce, _, [Cmp]) {
      return function create_complex_element() {
        return ce(Cmp, ...arguments)
      }
    }
  }
)

export
function $$(Cmp) {
  return function() {
    return $(Cmp, ...arguments)
  }
}

/** useState where state is a function */
export
function useFunctionState(init_fun) {
  const [f, set_fun] = useState(() => init_fun)
  return [f, f => set_fun(() => f)]
}

/** useEffect but async and no unmount */
export
function useEffect2(watch, effect) {
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

export
function useIsMount() {
  const [is_mount, set_is_mount] = useState(true)
  useMount(function onMount() {
    set_is_mount(false)
  })
  return is_mount
}

export
function useWatch(target, effect) {
  const [is_mount, set_is_mount] = useState(true)
  useEffect2(target, () => {
    if(is_mount)
      set_is_mount(true)
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

export
function class_names() {
  return Array.from(arguments)
    .flatMap(class_name)
    .filter(class_name => class_name).join(' ')
}
export { class_names as cns }

function class_name(target) {
  if(typeof target == 'string')
    return target
  
  const class_names = []
  for(let class_name in target)
    if(target[class_name])
      class_names.push(class_name)
  return class_names
}

/** 判断基本数据类型 */
function is_primative(target) {
  return typeof target != 'object' && typeof target != 'function' || target === null
}
