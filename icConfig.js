import { Artemis } from 'artemis-web3-adapter'

const connectObj = {
  whitelist: [
    'dvjm4-qgttz-pi6en-pzsqa-pos53-tizlb-crg4y-xywvo-xb2kn-intwa-dqe',
  ],
  host: 'https://icp0.io/',
}
const artemisWalletAdapter = new Artemis(connectObj)

export default artemisWalletAdapter
