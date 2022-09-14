import React from 'react'
import { Link } from 'react-router-dom'

import logoImg from '../assets/img/train-station.jpg'


const SideBar = (props) => {
  const nav = props.nav
  const query = props.query

  return (
    <div className="col-md-6 col-sm-6 col-xs-6 display-table-cell v-align box imag" id="navigation">


      <div className="admin-bar">
        <ul>
          <li className={nav === "armazem" ? "active" : null}>
            <Link to="/">
              <i className="fa fa-cubes" aria-hidden="true"></i>
              <span className="hidden-xs">Ver Tabela de Mercadorias</span>
            </Link>
          </li>
          <li className={nav === "caminhoes" ? "active" : null}>
            <Link to="/caminhoes">
              <i className="fa fa-truck-moving" aria-hidden="true"></i>
              <span className="hidden-xs">Trens</span>
            </Link>
          </li>
          <li className={nav === "rotas" ? "active" : null}>
            <Link to={`/rotas${query === 'organizado' ? '?organizado=true' : ''}`}>
              <i className="fa fa-route" aria-hidden="true"></i>
              <span className="hidden-xs">Ver Mapa</span>
            </Link>
          </li>
        </ul>

        
      </div>

    </div>

    
  )
}

export default SideBar