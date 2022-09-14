import React, { useEffect, useState } from 'react'

import SideBar from '../../components/SideBar'
import Header from '../../components/Header'
import imgagemEscolhida from '../../assets/img/cargas.jpg'
import Enviado from '../../components/Enviado'

import { prepareProducts } from '../../api/product'

const Caminhao = () => {
  const [products, setProducts] = useState([])
  const [isManaged, setIsManaged] = useState(false)

  const [truck1, setTruck1] = useState([])
  const [truck2, setTruck2] = useState([])
  const [truck3, setTruck3] = useState([])
  const [truck4, setTruck4] = useState([])
  const [truck5, setTruck5] = useState([])

  const setTruck = (setFunc, product, i) => {
    const time = 1000

    setTimeout(() => {
      setFunc(products => [...products, product])
      setProducts(products => products.slice(1))
    }, i * time)
  }

  const manageTrucks = () => {
    products.forEach((product, i) => {
      switch(product.caminhao) {
        case 1:
          setTruck(setTruck1, product, i)
          break;
        case 2:
          setTruck(setTruck2, product, i)
          break;
        case 3:
          setTruck(setTruck3, product, i)
          break;
        case 4:
          setTruck(setTruck4, product, i)
          break;
        case 5:
          setTruck(setTruck5, product, i)
          break;
        default:
          break;
      }
    })
    setIsManaged(true)
  }

  useEffect(() => {
    (async () => {
      const { status, body } = await prepareProducts()
      if (status === 200) setProducts(body)
    })()
  }, [])

  return (
    <section className="dashboard">
      <div className="container-fluid display-table">
        <div className="row display-table-row">
          <SideBar nav="caminhoes" query={isManaged ? 'organizado' : null} />
          

          <div className="col-md-6 col-sm-6 display-table-cell v-align">

            <div className="cargas">
              <img src={imgagemEscolhida}/>
            </div>

            <div className="user-dashboard cargas-center">   
              <div className='manage-trucks'>
                <button type="button" onClick={manageTrucks} data-toggle="modal" data-target="#enviado" className="btn btn-primary">
                  Enviar mercadorias
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="modals">
        <Enviado />
      </div>

    </section>
  )
}

export default Caminhao
