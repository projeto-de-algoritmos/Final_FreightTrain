import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Armazem from './pages/Armazem'
import Transporte from './pages/Transporte'
import Rotas from './pages/Rotas'

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Armazem} />
                <Route path="/trens" component={Transporte} />
                <Route path="/rotas" component={Rotas} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
