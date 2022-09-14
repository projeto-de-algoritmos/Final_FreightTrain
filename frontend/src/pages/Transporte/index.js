import React, { useEffect, useState } from 'react'

import SideBar from '../../components/SideBar'
import Header from '../../components/Header'
import imgagemEscolhida from '../../assets/img/cargas.jpg'
import Enviado from '../../components/Enviado'

const Transporte = () => {
  const [isManaged, setIsManaged] = useState(false)


  const manageTrucks = () => {
    
    setIsManaged(true)
  }


  return (
    <section className="dashboard">
      <div className="container-fluid display-table">
        <div className="row display-table-row">
          <SideBar nav="trens" query={isManaged ? 'organizado' : null} />
          

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

export default Transporte
