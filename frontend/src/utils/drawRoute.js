import $ from 'jquery'

export const drawRoute = (rota) => {
  rota.estados.forEach((estado, index) => {
    if (index === 0) {
      $(`circle#${estado}`).css({ 'fill': '#ff4242', 'display': 'block' })
    } else {
      $(`circle#${estado}`).css({ 'fill': '#002bde', 'display': 'block' })
    }

    $(`text#${estado}_LABEL`).css({ 'display': 'block' })
  })

  rota.arestas.forEach((aresta) => {
    const estados = aresta.split('-')

    $(`line#${estados[0]}-${estados[1]}`).css({ 'stroke': '#002bde', 'display': 'block' })
    $(`line#${estados[1]}-${estados[0]}`).css({ 'stroke': '#002bde', 'display': 'block' })
    $(`path#${estados[0]}-${estados[1]}`).css({ 'stroke': '#002bde', 'display': 'block' })
    $(`path#${estados[1]}-${estados[0]}`).css({ 'stroke': '#002bde', 'display': 'block' })
  })
}
