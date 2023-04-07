// Constants
const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"]
const renameMsgs = ["Cleaned", "Affected", "Made it with", "Fixed", "Rounded up"]
const idleMsgs = ["All great, already", "Nothing to do, everything's good", "Any layers to affect? Can't see it", "Nothing to do, your layers are great", "Round as circle!"]

// Variables
let notification: NotificationHandler
let selection: ReadonlyArray<SceneNode>
let working: boolean
let nodeCount: number = 0
let vertCount: number = 0

figma.on("currentpagechange", cancel)


// Main + Elements Check
working = true
selection = figma.currentPage.selection
if (selection.length)
  for (const node of selection)
    mainFunction(node)
finish()

// Action for selected nodes
function mainFunction(node, command = {}, parameters = {}) {
  if (node.type !== 'VECTOR') return
  node.x = Math.round(node.x)
  node.y = Math.round(node.y)
  let newNetwork = JSON.parse(JSON.stringify(node.vectorNetwork))
  for (const vert of newNetwork.vertices) {
    vert.x = Math.round(vert.x)
    vert.y = Math.round(vert.y)
    vertCount++
  }
  node.vectorNetwork = newNetwork
  console.log(node.vectorNetwork.vertices)
  nodeCount++
}

// Ending the work
function finish() {
  working = false
  figma.root.setRelaunchData({ relaunch: '' })
  if (nodeCount > 0) {
    notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)] +
      " " + renameMsgs[Math.floor(Math.random() * renameMsgs.length)] +
      " " + ((nodeCount === 1) ? "only one layer" : (nodeCount + " layers")) +
      " with " + ((vertCount === 1) ? " one point" : (vertCount + " points")) +
      " inside")

  }
  else notify(idleMsgs[Math.floor(Math.random() * idleMsgs.length)])
  setTimeout(() => { console.log("Timeouted"), figma.closePlugin() }, 3000)
}

// Show new notification
function notify(text: string) {
  if (notification != null)
    notification.cancel()
  notification = figma.notify(text)
}

// Showing interruption notification
function cancel() {
  if (notification != null)
    notification.cancel()
  if (working) {
    notify("Plugin work have been interrupted")
  }
}