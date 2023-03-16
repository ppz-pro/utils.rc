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
function pushLazyRoute(route) {
  // ...
}
