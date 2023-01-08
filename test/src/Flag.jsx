import { useFlag } from '@ppzp/hooks'

export default
function Flag() {
  const [flag, update] = useFlag()

  return <div
    onClick = {update}
  >Flag: {flag}</div>
}
