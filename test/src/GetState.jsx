import { useGetState } from '@ppzp/hooks'

export default
function GetState() {
  const [value, update] = useGetState({
    get() { return Math.random() },
    defaultValue: 1
  })

  const [asyncValue, asyncUpdate] = useGetState({
    get: getAsyncData,
    ifGet: value > 0.5,
    defaultValue: 1,
    map: value => value * 10
  })

  return <div>
    <section
      id = 'get'
      onClick = {() => {
        console.log('clicked')
        update()
      }}
    >
      GetState: {value}
    </section>

    <section
      id = 'async-get'
      onClick = {asyncUpdate}
    >
      GetState Async: {asyncValue}
    </section>
  </div>
}

function getAsyncData() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(Math.random())
    }, 1000)
  })
}
