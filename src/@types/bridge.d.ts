import { api } from '../../electron/bridge'

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
  }
}



// declare module 'electron-db' {
// 	const value: any
// 	export default value
// }
