import { useState, useEffect } from 'react'

const status_map = {
  before_load: Symbol('before_load'),
  loading: Symbol('data_loading'),
  error: Symbol('data_error'),
  loaded: Symbol('data_loaded')
}

export default
function useAsyncGet({
  getter,
  load_on_mount = true,
  watch = []
}) {
  const [data, set_data] = useState()
  const [error, set_error] = useState()
  const [status, set_status] = useState(status_map.before_load)

  const [is_mount, set_is_mount] = useState(true)
  const [reload_flag, set_reload_flag] = useState(0)
  
  useEffect(function get_async_data() {
    if(is_mount && !load_on_mount) {
      set_is_mount(false)
      return
    }

    set_status(status_map.loading)
    getter()
      .then(function on_data_loaded(data) {
        set_data(data)
        set_status(status_map.loaded)
      })
      .catch(function on_data_error(err) {
        set_status(status_map.error)
        set_error(err)
      })
  }, [...watch, reload_flag])

  return {
    match: matcher => match_status(data, error, status, matcher),
    reload() {
      set_reload_flag(reload_flag + 1)
    }
  }
}

function match_status(data, _err, status, {
  before_load,
  loading,
  before_loaded,
  loaded,
  error
}) {
  switch(status) {
    case status_map.before_load:
      return handle(status, before_load || before_loaded, 'no before_load and before_loaded')
    case status_map.loading:
      return handle(status, loading || before_loaded, 'no loading and before_loaded')
    case status_map.loaded:
      return handle(status, loaded, 'no loaded', data)
    case status_map.error:
      return handle(status, error, 'no error', _err)
    default: throw Error(`matcher error: unknown status ${status.toString()}`)
  }
}

function handle(status, handle, msg, result) {
  if(!handle)
    throw Error(`matcher error on ${status.toString()}: ${msg}`)
  return handle(result)
}
