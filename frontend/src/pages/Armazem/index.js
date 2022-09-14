import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import moment from 'moment'

import SideBar from '../../components/SideBar'
import Header from '../../components/Header'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'

import { getProducts } from '../../api/product'

const columns = [
  { label: 'Identificador', value: 'identificador' },
  { label: 'Descrição', value: null },
  { label: 'Estado', value: 'estado' },
  { label: 'Data de Entrega', value: 'dataEntrega' },
]

const Armazem = () => {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState(columns[0])
  const [order, setOrder] = useState('crescente')

  const query = queryString.parse(window.location.search)
  const [currentPage, setCurrentPage] = useState(query.page)
  const [maxPages, setMaxPages] = useState(1)

  const getSortIcon = (type) => {
    if (filter.value === type.value) {
      if (order === 'crescente') {
        return 'fa-sort-up'
      } else if (order === 'decrescente') {
        return 'fa-sort-down'
      }
    }
    return 'fa-sort'
  }

  const handleFilter = (type) => {
    if (filter.value === type.value) {
      if (order === 'crescente') {
        setOrder('decrescente')
      } else if (order === 'decrescente') {
        setOrder('crescente')
      }
    }
    setFilter(type)
  }

  useEffect(() => {
    setCurrentPage(query.page)
  }, [query.page])

  useEffect(() => {
    (async () => {
      const params = {
        filterBy: filter.value,
        order: order,
        porPagina: 10,
        pagina: currentPage ? currentPage : "1",
      }

      const { status, body } = await getProducts(params)

      if (status === 200) {
        setProducts(body.data)
        setMaxPages(body.totalPaginas)
      }
    })()
  }, [filter, order, currentPage])

  return (
    <section className="dashboard">
      <div className="container-fluid display-table">
        <div className="row display-table-row">
          <SideBar nav="armazem" />

          <div className="col-md-6 col-sm-6 display-table-cell v-align">
            <Header />

            <div className="user-dashboard">
              
              <div id="info-div"></div>

              <div className="row">
                <div className="col-md-12 col-xs-12">
                  <div className="card">
                    
                    <div className="card-body">
                      <table className="table">
                        <thead>
                          <tr>
                            {columns.map((column) => {
                              if (!column.value) {
                                return (
                                  <th key={column.label} scope="col">
                                    {column.label}
                                  </th>
                                )
                              }
                              return (
                                <th key={column.value} scope="col">
                                  <a href={`#${column.value}`} onClick={() => handleFilter(column)}>
                                    {column.label}
                                    <i id="icon" className={`fa ${getSortIcon(column)}`} />
                                  </a>
                                </th>
                              )
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product.identificador}>
                              <th scope="row">{product.identificador}</th>
                              <td>{product.descricao}</td>               
                              <td>{product.estado}</td>
                              <td>{moment(new Date(product.dataEntrega)).format('DD/MM/YY')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {maxPages > 1 &&
                      <Pagination
                        currentPage={currentPage ? currentPage : "1"}
                        maxPages={maxPages}
                      />
                    }
                  </div>
                </div>

              </div>
            </div>

            <div className="search">
              <div className="header-top">
                <button className="btn btn-dark" data-toggle="modal" data-target="#add_product">Novo Produto</button>
              </div>
            </div>

          </div>
        </div>

      

      </div>

      <div className="modals">
        <Modal />
      </div>

      

    </section>
  )
}

export default Armazem
