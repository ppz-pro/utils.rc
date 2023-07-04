import { createElement, Fragment } from 'react'

export default new Proxy(
  function create_element(Comp, props, ...children) {
    if(props.constructor != Object) {
      children.unshift(props)
      props = null
    }
    return createElement(Comp, Props(props), ...children)
  }, {
    get(ce, tag_name) {
      return function create_tag_element() {
        if(tag_name == '_')
          tag_name = Fragment // 1. Fragment
        return ce(tag_name, ...arguments) // 2. html 标签
      }
    },
    apply(ce, _, [Comp, ...args]) {
      if(Comp instanceof Function) // 3. React 组件
        return ce(Comp, ...args)
      else // 4. html div 标签
        return ce('div', Comp, ...args) // 此处 Comp 是 props 或第一个子元素
    }
  }
)

function Props(props) {
  if(props?.plass) {
    props.className = classnames(props.plass)
    delete props.plass
  }
  return props
}

function classnames(plass) {
  if(typeof plass == 'string')
    return plass
  let result = ''
  for(let key in plass)
    if(plass[key])
      result += key + ' '
  return result
}