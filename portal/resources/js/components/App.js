import React, {Suspense, useEffect} from "react"
import { Router, Switch } from "react-router-dom";
import { ApmRoute } from '@elastic/apm-rum-react';
import { icons } from './AdminPanel/assets/icons';
import { Verify } from "./Verify/Verify";
import NoMatch from "./NoMatch";
import history from './history';
import { Spinner } from "./Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import i18n from './i18n';
import { fetchLocalization } from "../endpoints/LocalizationFunctions";

const AdminPanel = React.lazy( () => import ('./AdminPanel/App/App'));
const LandingPage = React.lazy(() => import('../pages/LandingPage'));

React.icons = icons

function App() {
    const dispatch = useDispatch();
    const fetchFirstLanguage = lang => {
      if(lang===undefined){
        fetchFirstLanguage('en');
        document.documentElement.setAttribute('lang','en');
      }else {
        const languages = ['de', 'sr', 'en','sr-Cyrl']
        if (languages.includes(lang)) {
          fetchLocalization(lang).then(res => {
            res = Object.values(res.data);
            let resources = {};
            res.map(item => {
              resources[item.key_path] = item.translation;
            })
            i18n.addResourceBundle(lang, 'translation', resources);
            i18n.changeLanguage(lang);
            dispatch({type: 'setLanguage', initialized:true})
            document.documentElement.setAttribute('lang',lang);
          })
        } else {
          var res = lang.split("-");
          res = res[res.length - 2]
          fetchFirstLanguage(res);
        }
      }
    }
    useEffect(()=>{
      fetchFirstLanguage(i18n.language)
    },[])
    const localization = useSelector(state => state.localization)
    return (
      localization.initialized?(
            <Router history={history}>
                <Suspense fallback={<Spinner/>}>
                    <Switch>
                        <ApmRoute exact path="/" component={LandingPage} />
                        <ApmRoute path="/panel" component={AdminPanel} />
                        <ApmRoute path="/email/verify" component={Verify} />
                        <ApmRoute path="/change/password" component={LandingPage} />
                        <ApmRoute component={NoMatch} />
                    </Switch>
                </Suspense>
            </Router>
            ):
        (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="warning" />
            </div>
        )
    );
}
export default App;
