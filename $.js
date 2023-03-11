import React from 'react'

function $(Comp, props, ...children) {
  if(props instanceof Array || typeof props == 'string' || React.isValidElement(props)) {
    children.unshift(props)
    props = null
  }
  return React.createElement(Comp, props, ...children)
}

export default new Proxy($, {
  get(_, tagName) {
    return function() {
      return _(tagName, ...arguments)
    }
  }
})
