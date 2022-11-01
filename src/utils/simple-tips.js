import vue from '@/main'

const successConfig = {
  title: 'Success',
  message: 'Created Successfully',
  type: 'success',
  duration: 2000
}
const failConfig = {
  title: 'Success',
  message: 'Successfully',
  type: 'success',
  duration: 2000
}
export function showSuccessTip(config) {
  vue.$notify(successConfig)
}
export function showFailTip(config) {
  vue.$notify(failConfig)
}
