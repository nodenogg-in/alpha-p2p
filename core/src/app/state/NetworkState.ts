import { State } from '../../utils'

export class NetworkState extends State<{ state: { online: boolean } }> {
  constructor() {
    super({
      initial: () => ({
        state: {
          online: navigator?.onLine || true
        }
      })
    })
    window.addEventListener('offline', this.setOffline)
    window.addEventListener('online', this.setOnline)
  }

  private setOnline = () => this.setKey('state', () => ({ online: true }))

  private setOffline = () => this.setKey('state', () => ({ online: false }))

  public dispose = () => {
    window.removeEventListener('offline', this.setOffline)
    window.removeEventListener('online', this.setOnline)
  }
}
