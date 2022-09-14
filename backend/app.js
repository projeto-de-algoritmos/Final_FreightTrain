const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const itemsDatabase = require('./database/items.json')
const estados = require('./database/estados.json')
const ufEstados = require('./src/ufEstados.json')
const { getUtcDateTime, sort, toDate, buildRoute } = require('./src/utils')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getItems = (request, response) => {
  const { filterBy, order, porPagina = 10, pagina = 1 } = request.query
  if (filterBy) {
    if (!['identificador', 'estado', 'empresa', 'dataEntrega'].find(filter => filter === filterBy))
      return response.status(400).json({ message: "Parâmetro filterBy inválido, deve ser um desses valores: ['identificador', 'estado', 'empresa']" })
    if (order && !['crescente', 'decrescente'].find(ord => ord === order))
      return response.status(400).json({ message: "Parâmetro order inválido, deve ser um desses valores: ['crescente', 'decrescente']" })

    const itemsOrdenados = sort(itemsDatabase, request.query.filterBy, request.query.order)
    return response.status(200).json({
      data: itemsOrdenados.slice((pagina - 1) * porPagina, pagina * porPagina),
      totalProdutos: itemsOrdenados.length,
      totalPaginas: Math.ceil(itemsOrdenados.length / porPagina)
    })
  }
  response.status(200).json(itemsDatabase.slice((pagina - 1) * porPagina, pagina * porPagina))
}

const addItem = (request, response) => {
  const { identificador, descricao, empresa, estado, dataEntrega } = request.body
  const novoItem = { identificador, descricao, empresa, estado, dataEntrega }

  const dataAgora = getUtcDateTime()
  const dataObjEntrega = new Date(dataEntrega.split('/')[2], dataEntrega.split('/')[1] - 1, dataEntrega.split('/')[0])

  if (typeof identificador !== 'number') return response.status(400).json({ message: "Identificador inválido, deve ser um número" })
  if (typeof descricao !== 'string') return response.status(400).json({ message: "Descricao inválida, deve ser uma string" })
  if (typeof empresa !== 'string') return response.status(400).json({ message: "Empresa inválida, deve ser uma string" })
  if (typeof estado !== 'string') return response.status(400).json({ message: "Estado inválido, deve ser uma string" })
  if (typeof dataEntrega !== 'string') return response.status(400).json({ message: "Data de Entrega inválida, deve ser uma string e maior do que o dia de hoje" })
  if (dataObjEntrega < dataAgora) return response.status(400).json({ message: "Data de Entrega inválida, deve ser maior do que o dia de hoje" })

  const itemExistente = itemsDatabase.find(item => item.identificador === identificador)
  if (itemExistente) return response.status(400).json({ message: "Produto com este identificador já está cadastrado" })

  novoItem['dataEntrega'] = toDate(novoItem['dataEntrega'])
  itemsDatabase.unshift(novoItem)
  fs.writeFile('./database/items.json', JSON.stringify(itemsDatabase), (err) => {
    if (err) return console.log(err);
    console.log('Item salvo com sucesso no banco de dados');
  });
  return response.status(201).json({ message: "Produto criado com sucesso!" })
}

const prepareItems = (request, response) => {
  const caminhoes = {
    "norte": 1,
    "nordeste": 2,
    "centro-oeste": 3,
    "sudeste": 4,
    "sul": 5
  }

  const itemsOrdenados = sort(itemsDatabase, 'dataEntrega', 'crescente')
  for (let i = 0; i < itemsOrdenados.length; i++) {
    const itemEstado = itemsOrdenados[i]['estado']
    const ufItemEstado = ufEstados[itemEstado]
    const estado = estados[ufItemEstado]
    const caminhao = caminhoes[estado['regiao']]

    itemsOrdenados[i].caminhao = caminhao
  }

  return response.status(200).json(itemsOrdenados)
}

const getRoutes = (request, response) => {
  const caminhoes = {
    "norte": 1,
    "nordeste": 2,
    "centro-oeste": 3,
    "sudeste": 4,
    "sul": 5
  }

  const itemsOrdenados = sort(itemsDatabase, 'dataEntrega', 'crescente')
  for (let i = 0; i < itemsOrdenados.length; i++) {
    const itemEstado = itemsOrdenados[i]['estado']
    const ufItemEstado = ufEstados[itemEstado]
    const estado = estados[ufItemEstado]
    const caminhao = caminhoes[estado['regiao']]

    itemsOrdenados[i].caminhao = caminhao
  }

  const regiao = {
    norte: ['Acre', 'Amapá', 'Roraima', 'Rondônia', 'Pará', 'Tocantins'],
    nordeste: ['Maranhão', 'Piauí', 'Bahia', 'Ceará', 'Rio Grande do Norte', 'Paraíba', 'Pernambuco', 'Alagoas', 'Sergipe'],
    centroOeste: ['Distrito Federal', 'Mato Grosso do Sul', 'Goiás', 'Mato Grosso'],
    sudeste: ['Minas Gerais', 'São Paulo', 'Espírito Santo', 'Rio de Janeiro'],
    sul: ['Paraná', 'Santa Catarina', 'Rio Grande do Sul'],
  }

  const produtosNorte = ['PA', ...new Set(itemsOrdenados.filter(i => regiao.norte.includes(i.estado)).map(p => ufEstados[p.estado]))]
  const produtosNordeste = ['BA', ...new Set(itemsOrdenados.filter(i => regiao.nordeste.includes(i.estado)).map(p => ufEstados[p.estado]))]
  const produtosCentroOeste = ['DF', ...new Set(itemsOrdenados.filter(i => regiao.centroOeste.includes(i.estado)).map(p => ufEstados[p.estado]))]
  const produtosSudeste = ['DF', ...new Set(itemsOrdenados.filter(i => regiao.sudeste.includes(i.estado)).map(p => ufEstados[p.estado]))]
  const produtosSul = ['DF', ...new Set(itemsOrdenados.filter(i => regiao.sul.includes(i.estado)).map(p => ufEstados[p.estado]))]

  const routes = {
    1: buildRoute(produtosNorte, 'PA'),
    2: buildRoute(produtosNordeste, 'BA'),
    3: buildRoute(produtosCentroOeste, 'DF'),
    4: buildRoute(produtosSudeste, 'DF'),
    5: buildRoute(produtosSul, 'DF'),
  }

  return response.status(200).json(routes)
}

app
  .route('/items')
  .get(getItems)
  .post(addItem)

app
  .route('/items/prepare')
  .post(prepareItems)

app
  .route('/routes')
  .post(getRoutes)

// Start server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port`, process.env.PORT || 3001)
})