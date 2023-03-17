import React, { Suspense } from 'react'
import { $ } from '.'

export
const routes = []

export
function pushRoute({ path, Page }) {
  routes.push({
    path,
    element: $(Page)
  })
}

export
function pushLazyRoute({ path, Page }) {
  routes.push({
    path,
    element: $(Suspense,
      $(React.lazy(Page))
    )
  })
}
