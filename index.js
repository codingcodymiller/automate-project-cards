require('dotenv').config()
// const { Octokit } = require("@octokit/core");
const { App } = require("@octokit/app");
const dedent = require("dedent-js");
const cardTemplates = require("./card-templates.js")
const express = require('express')
const server = express()
const path = require('path')
const fetch = require('node-fetch');
const { readFileSync } = require('fs');
const {
  PORT,
  GITHUB_WEBHOOK_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_APP_ID,
  GITHUB_PRIVATE_KEY
  } = process.env
;(async () => {
const app = new App({
  appId: GITHUB_APP_ID,
  privateKey: readFileSync('./pem.pem'),
  oauth: {
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  },
  webhooks: {
    secret: GITHUB_WEBHOOK_SECRET
  }
});

const { data } = await app.octokit.request("/app");
console.log("authenticated as %s", data.name);

server.use(express.json())

server.post('/', async (req, res) => {
  console.log(req.body)
})

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})
// for await (const { octokit, repository } of app.eachRepository.iterator()) {
//   await octokit.request("POST /repos/{owner}/{repo}/dispatches", {
//     owner: repository.owner.login,
//     repo: repository.name,
//     event_type: "my_event",
//   });
// }

})()
// app.get('/oauth/redirect', async (req, res) => {
//   const { code } = req.query
//   const response = await fetch('https://github.com/login/oauth/access_token', {
//     method: 'POST',
//     headers: {
//       accept: 'application/json'
//     },
//     body: JSON.stringify({
//     client_id: GITHUB_CLIENT_ID,
//     client_secret: GITHUB_CLIENT_SECRET,
//     code
//     })
//   })
//   const data = await response.json()
//   console.log(data)
//   const accessToken = data.access_token
//   res.redirect(`/?access_token=${accessToken}`)
// })

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`)
// })

// const mediaType = {
//   previews: [
//     'inertia'
//   ]
// }

// const octokit = new Octokit({
//   auth: "Access Token Here"
// })

// async function buildProject(){
//   const { data: { id: projectId } } = await createProject("Web Development Portfolio")
//   const createdColumns = await createColumns(projectId, ["Pending", "In Progress", "In Review", "Completed"])
//   const pendingColumnId = createdColumns.find(column => column.name === "Pending").id
//   createCards(pendingColumnId, cardTemplates)
// }

// function createProject(name){
//   return octokit.request('POST /user/projects', { name, mediaType })
// }

// async function createColumns(project_id, columns){
//   const createdColumns = [];
//   for(let i = 0; i < columns.length; i++){
//     const name = columns[i]
//     const column = await octokit.request(`POST /projects/${project_id}/columns`, { project_id, name, mediaType }).catch(console.log)
//     createdColumns.push(column.data)
//   }
//   return createdColumns;
// }

// async function createCards(column_id, cards){
//   for(let i = 0; i < cards.length; i++){
//     const note = dedent(cards[i].content)
//     await octokit.request(`POST /projects/columns/${column_id}/cards`, { column_id, note, mediaType }).catch(console.log)
//   }
// }
