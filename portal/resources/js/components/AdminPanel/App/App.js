import React, { Suspense, useEffect, useState } from 'react';
import { ApmRoute } from '@elastic/apm-rum-react'
import { HashRouter, Switch } from 'react-router-dom';

import '../polyfill';
import './tabs.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { getUser } from "../../../endpoints/UserFunctions";
import { useDispatch } from "react-redux";
import { Spinner } from "../../Spinner/Spinner";
import {getImage} from "../../Utilities/helpers";

// Containers
const TheLayout = React.lazy(() => import('../containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('../views/pages/login/Login'));
const Register = React.lazy(() => import('../views/pages/register/Register'));
const Page404 = React.lazy(() => import('../views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('../views/pages/page500/Page500'));

const AdminPanel = () => {
  const dispatch = useDispatch()
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    getUser().then(result => {
      let image = getImage(result)
      dispatch({
        type: 'setLogin',
        id:result.id,
        name: result.name,
        email:result.email,
        role: result.role,
        image:image,
        address:result.address,
        created_at:result.created_at,
        updated_at:result.updated_at,
        show_video:result.show_video
      });
      setLoading(true);
    })
  }, []);
  return (
    <>
      {loading ? (
          <HashRouter>
            <Suspense fallback={<Spinner/>}>
              <Switch>
                <ApmRoute exact path="/login" name="Login Page" render={props => <Login {...props}/>}/>
                <ApmRoute exact path="/register" name="Register Page"
                          render={props => <Register {...props}/>}/>
                <ApmRoute exact path="/404" name="Page 404" render={props => <Page404 {...props}/>}/>
                <ApmRoute exact path="/500" name="Page 500" render={props => <Page500 {...props}/>}/>
                <ApmRoute path="/" name="Home" render={props => <TheLayout {...props}/>}/>
              </Switch>
            </Suspense>
          </HashRouter>
        ) :
        (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="warning" />
          </div>
        )
      }
    </>
  );
}
export default AdminPanel;
