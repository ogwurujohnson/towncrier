require('dotenv').config();
const fs = require('fs');
const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');

const Web3Service = require('./web3');
const discordUrl = process.env.DISCORD_URL;

/**
 * TODO: Make sure to make a request to this server from nexus and test the flows
 */

function fetchProposals() {
  let array = fs.readFileSync('persist.txt').toString().split("\r\n");
  return array;
}

function fetchComplete() {
  let array = fs.readFileSync('done.txt').toString().split("\r\n");
  return array;
}

async function fetchBlockchainProposals() {
  const web3 = new Web3Service(`${process.env.RPC_LINK}`);
  const isConnected = await web3.connect();

  if(isConnected) {
    const { proposals } = await web3.getBudgetProposals();
    return proposals;
  }
  return [];
}

async function makeRequest(data) {
  const discordData = {
    content: `The Proposal with UUID:  \`${data.refUUID}\` \n Refers to: \`${data.description}\``
  }
  const result = await fetch(discordUrl, {
    method: 'post',
    body: JSON.stringify(discordData),
    headers: { 'Content-Type': 'application/json' }
  })
  if(result.status === 204) {
    console.log('done')
  } else {
    console.log('not done')
  }
}

function markAsDone(uuid) {
  fs.appendFile('done.txt', JSON.stringify(uuid) + "\r\n", function(err){
    if(err) throw err;
    console.log('IS WRITTEN')
    });
}

// setup cron job to run every minute
const cron = new CronJob('* * * * * *', async () => {
  const preSavedProposals = fetchProposals();
  const blockchainProposals = await fetchBlockchainProposals();

  let complete = fetchComplete();
  complete.pop();

  let matchingProps = [];
  let matchingComplete = null;
  const cleanPreSaved = preSavedProposals.pop();
  preSavedProposals.map((pp) => {
    let {uuid, description} = JSON.parse(pp);
    matchingProps = blockchainProposals.filter((bp) => bp.refUUID === uuid);
    matchingComplete = complete.filter((cp) => JSON.parse(cp) === uuid);

    // console.log(matchingProps)
    if(matchingProps.length > 0 && matchingComplete.length === 0) {
      const data = { ...matchingProps[0], description }
      markAsDone(uuid)
      makeRequest(data)
    }
  });
},null, true);

module.exports = cron;