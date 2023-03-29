import React, {Suspense, useState,useEffect} from 'react';
import { ApmRoute } from '@elastic/apm-rum-react';
import { Redirect, Switch } from 'react-router-dom';
import { CContainer, CFade } from '@coreui/react';
// routes config
import routes from '../routes';
import {Spinner} from "../../Spinner/Spinner";

const TheContent = () => {

  return (
    <main className="c-body">
      <CContainer className="c-body py-3">
        <Suspense fallback={<Spinner/>}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <ApmRoute
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade className='c-body'>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to="/apiaries" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
