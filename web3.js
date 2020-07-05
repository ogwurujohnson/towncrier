let Web3 =  require('web3');
let web3Extension = require('@energi/web3-ext');

class Web3Service {
  constructor(rpcLink) {
    this.url = rpcLink;
    this.cacheTime = 30000; //30secs
    this.proposal = []
    this.web3;
    this.lastChecked = 0;
  }

  // connect
  async connect() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(this.url)
    )
    web3Extension.extend(this.web3);
    
    return this.checkConnection();
  }

  async checkConnection() {
    try {
      await this.web3.nrg.getBlockNumber();
      return true;
    } catch (err) {
      console.error(`Web3 connection error, Error: ${err}`);
      return false;
    }
  }

  async getBudgetProposals() {
    try {
      const now = Date.now();
      const lastTimeChecked = now - this.lastChecked;

      if (lastTimeChecked > this.cacheTime) {
        this.proposal = await this.web3.energi.budgetInfo();
        this.lastChecked = Date.now();
        return this.proposal;
      } else {
        return this.proposal;
      }

    } catch (err) {
      console.error(`Error fetching proposal list, Error: ${err}`);
    }
  }

  async convertToNRGFromWei(data) {
    const value = this.web3.utils.fromWei(data, 'nrg');
    return value;
  }
}

module.exports = Web3Service;