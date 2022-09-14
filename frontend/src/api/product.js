const api = 'http://localhost:3001'

export const getProducts = async ({ filterBy, order, porPagina = 10, pagina = 1 }) => {
  let response = {}

  let queryParams = `?porPagina=${porPagina}&pagina=${pagina}`
  if (filterBy) queryParams += `&filterBy=${filterBy}`
  if (order) queryParams += `&order=${order}`

  try {
    response = await fetch(`${api}/items${queryParams}`, {
      headers: {}
    })
  } catch (err) {
    console.log(err)
  } finally {
    return {
      status: response.status,
      body: await response.json()
    }
  }
}

export const prepareProducts = async () => {
  let response = {}

  try {
    response = await fetch(`${api}/items/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    console.log(err)
  } finally {
    return {
      status: response.status,
      body: await response.json()
    }
  }
}

export const getRoutes = async () => {
  let response = {}

  try {
    response = await fetch(`${api}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    console.log(err)
  } finally {
    return {
      status: response.status,
      body: await response.json()
    }
  }
} 

export const addProduct = async (data) => {
  let response = {}

  try {
    response = await fetch(`${api}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "identificador": data.identificador,
        "descricao": data.description,
        "empresa": data.company,
        "estado": data.state,
        "dataEntrega": data.deliverDate,
      }),
    })
  } catch (err) {
    console.log(err)
  } finally {
    return {
      status: response.status,
      body: await response.json()
    }
  }
}
