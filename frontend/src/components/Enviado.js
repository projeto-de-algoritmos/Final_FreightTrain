import React, { useState } from 'react'
import $ from 'jquery'

import { addProduct } from '../api/product'

const Enviado = () => {
    const closeProductModal = () => {
        $('#enviado').modal('hide')
      }
  return (
    <div id="enviado" className="modal fade" data-backdrop="static" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button onClick={closeProductModal} type="button" className="close">×</button>
            <h4 className="modal-title">Mercadoria Enviada!</h4>
          </div>
            <div className="modal-body">

              Suas mercadorias foram enviadas com sucesso! Pode consultar o mapa.

            </div>
            <div className="modal-footer">
              <button onClick={closeProductModal} type="button" className="btn btn-black">Ok</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Enviado
