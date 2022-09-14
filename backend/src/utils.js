const estados = require('../database/estados.json')
const distancias = require('./distancias.json')

const getUtcDateTime = (offset = '0') => {
  var d = new Date()
  var utc = d.getTime() - (d.getTimezoneOffset() * 60000)
  var nd = new Date(utc + (3600000 * offset))
  return nd
}

const toDate = (dateStr) => {
  if (typeof dateStr !== 'string') return dateStr
  const parts = dateStr.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

const _mergeArrays = (a, b, filter, order) => {
  const c = []

  while (a.length && b.length) {
    if (order === 'crescente') c.push(a[0][filter] > b[0][filter] ? b.shift() : a.shift())
    else c.push(a[0][filter] < b[0][filter] ? b.shift() : a.shift())
  }

  while (a.length) c.push(a.shift())
  while (b.length) c.push(b.shift())

  return c
}

const mergeSort = (array, filter, order) => {
  if (array.length < 2) return array
  const middle = Math.floor(array.length / 2)
  const array_l = array.slice(0, middle)
  const array_r = array.slice(middle, array.length)
  const sorted_l = mergeSort(array_l, filter, order)
  const sorted_r = mergeSort(array_r, filter, order)
  return _mergeArrays(sorted_l, sorted_r, filter, order)
}

const sort = (items, filter, order = 'crescente') => {
  const itemsOrdenados = mergeSort(items, filter, order)
  return itemsOrdenados
}

const dijkstra = (startState, endState) => {
  const queue = []
  let distances = {}
  let parents = {}
  let visited = {}

  queue.push(estados[startState])

  Object.keys(estados).forEach(state => {
    distances[state] = Infinity
    parents[state] = -1
    visited[state] = false
  })

  distances[startState] = 0

  while (queue.length > 0) {
    const currentNode = queue[0]
    queue.shift()

    if (currentNode.sigla === endState) {
      break;
    }

    currentNode.arestas.forEach(({ sigla: neigh }) => {
      const alt = distances[currentNode.sigla] + (distancias[`${currentNode.sigla}:${neigh}`] || distancias[`${neigh}:${currentNode.sigla}`])
      if (alt < distances[neigh]) {
        distances[neigh] = alt
        parents[neigh] = currentNode.sigla
      }
      if (visited[neigh] === false) {
        visited[neigh] = true
        queue.push(estados[neigh])
      }
    })
  }

  const path = []
  let parent = endState

  while (parent !== startState) {
    path.unshift(estados[parent])
    parent = parents[parent]
  }
  path.unshift(estados[parent])

  const arestas = []
  for (let i = 1; i < path.length; i++) {
    arestas.push(`${path[i - 1].sigla}-${path[i].sigla}`)
  }

  return { path, arestas }
}

const buildRoute = (states, startState) => {

  if (states.length === 0) {
    return { estados: [], arestas: [] }
  } else if (states.length === 1) {
    return { estados: states, arestas: [] }
  }

  const statesOrdenados = states.sort((stateA, stateB) => {
    if ((distancias[`${stateA}:${startState}`] || distancias[`${startState}:${stateA}`]) <
      (distancias[`${stateB}:${startState}`] || distancias[`${startState}:${stateB}`])) return -1
    else return 1
  })

  let path = [], arestas = []
  for (let i = 1; i < statesOrdenados.length; i++) {
    const { path: pathAux, arestas: arestasAux } = dijkstra(statesOrdenados[i - 1], statesOrdenados[i])
    path = path.concat(pathAux)
    arestas = arestas.concat(arestasAux)
  }

  path = [...new Set(path)]
  arestas = [...new Set(arestas)]

  return { estados: path.map(p => p.sigla), arestas: arestas }
}

module.exports = { getUtcDateTime, sort, toDate, buildRoute }