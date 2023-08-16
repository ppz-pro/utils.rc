import { createElement, Fragment, isValidElement } from 'react'

export default new Proxy(
  function create_element(Comp, props, ...children) {
    if(!(props?.constructor == Object && !isValidElement(props))) { // 如果不是 props
      // props: 1. 是 Object && 2. 不是 Element
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
      // Comp 要么是一个组件（Function），要么是 div 的属性（没有 render）
      if(Comp instanceof Function || Comp?.render instanceof Function) // 3. React 组件（包括 forwardRef）
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
  else if(plass instanceof Array)
    return plass.filter(item => item).map(classnames).join(' ')
  else if(!plass)
    return null
  
  let result = ''
  for(let key in plass)
    if(plass[key])
      result += key + ' '
  return result
}
