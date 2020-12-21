const { Octokit } = require("@octokit/core");
const dedent = require("dedent-js");
const cardTemplates = require("./card-templates.js")
const [,,auth] = process.argv
const mediaType = {
  previews: [
    'inertia'
  ]
}

if(!auth) return console.log('Missing auth code')

const octokit = new Octokit({
  auth
})

async function buildProject(){
  const { data: { id: projectId, html_url } } = await createProject("Web Development Portfolio")
  console.log(html_url)
  const createdColumns = await createColumns(projectId, ["Pending", "In Progress", "In Review", "Completed"])
  const pendingColumnId = createdColumns.find(column => column.name === "Pending").id
  await createCards(pendingColumnId, cardTemplates)
  await setProjectToPublic(projectId)
}
async function setProjectToPublic(project_id) {
  return octokit.request(`PATCH /projects/${project_id}`, {
    project_id,
    mediaType,
    private: false
  }).catch(console.log)
}

async function createProject(name){
  return octokit.request('POST /user/projects', { name, mediaType })
}

async function createColumns(project_id, columns){
  const createdColumns = [];
  for(let i = 0; i < columns.length; i++){
    const name = columns[i]
    const column = await octokit.request(`POST /projects/${project_id}/columns`, { project_id, name, mediaType }).catch(console.log)
    createdColumns.push(column.data)
  }
  return createdColumns;
}

async function createCards(column_id, cards){
  for(let i = 0; i < cards.length; i++){
    const note = cards[i].content
    await octokit.request(`POST /projects/columns/${column_id}/cards`, { column_id, note, mediaType }).catch(console.log)
  }
}

buildProject()
