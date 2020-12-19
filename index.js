const { Octokit } = require("@octokit/core");
const dedent = require("dedent-js");
const cardTemplates = require("./card-templates.js")

const mediaType = {
  previews: [
    'inertia'
  ]
}

const octokit = new Octokit({
  auth: "Access Token Here"
})

async function buildProject(){
  const { data: { id: projectId } } = await createProject("Web Development Portfolio")
  const createdColumns = await createColumns(projectId, ["Pending", "In Progress", "In Review", "Completed"])
  const pendingColumnId = createdColumns.find(column => column.name === "Pending").id
  createCards(pendingColumnId, cardTemplates)
}

function createProject(name){
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
    const note = dedent(cards[i].content)
    await octokit.request(`POST /projects/columns/${column_id}/cards`, { column_id, note, mediaType }).catch(console.log)
  }
}

buildProject()
