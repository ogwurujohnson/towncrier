# Town Crier (Energi Decentralised Proposal Notification)

## Getting started

1. Copy .env.example to .env
  
```
$ cp .env.example .env
```
  
2. Create discord webhook url and update the `DISCORD_URL` environment variable in `.env` with it
3. Update the `RPC_LINK` in the `.env` file, with an RPC link pointing to a node server on the Energi Blockchain
4. Make sure to update the `NODE_ENV` to `production` while deploying to services like Heroku.
6. Update Nexus with URl of deployed version of this project
