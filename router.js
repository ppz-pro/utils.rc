import React, { Suspense } from 'react'
import { $ } from '.'

export
const routes = []

export
function push_route({ path, Page }) {
  routes.push({
    path,
    element: $(Page)
  })
}

export
function push_lazy_route({ path, Page }) {
  routes.push({
    path,
    element: $(Suspense,
      $(React.lazy(Page))
    )
  })
}
