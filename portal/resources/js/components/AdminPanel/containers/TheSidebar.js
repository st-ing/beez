import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarMinimizer,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {useTranslation} from "react-i18next";
import navigation from './_nav'
import navigation_regular from './_nav_regular'
import {logout} from "../../../endpoints/UserFunctions";
import history from '../../history';
import {getAllSettings} from "../../../endpoints/SettingFunctions";
import {getSetting} from "../../Utilities/helpers";
import {PrimaryYoutube} from "../../Youtube/YoutubeModal";
const TheSidebar = () => {
  const [navItems,setNavItems] = useState(navigation_regular);
  const [adminNavItems,setAdminNavItems] = useState(navigation);
  const [loading,setLoading] = useState(true);
  const [settings,setSettings] = useState([]);
  const loggedUser = useSelector(state => state.userLogged);
  const dispatch = useDispatch();
  const{t,i18n} = useTranslation();
  const show = useSelector(state => state.sidebarShow)

  useEffect(() => {
    getAllSettings().then(data => {
      setSettings(Object.values(data));
      setLoading(false);
    })
  }, [])

  const translate = (item) => {
    let settingSidebarDashboard = getSetting('ui.sidebar.show_dashboard',settings,loggedUser.id);
    let settingSidebarThemes = getSetting('ui.sidebar.show_themes',settings,loggedUser.id);
    let settingSidebarComponents = getSetting('ui.sidebar.show_components',settings,loggedUser.id);
    if(settingSidebarDashboard==='false' || settingSidebarDashboard==='0'){
      if(item.data === 'dashboard'){item.className = 'd-none'; }
    }
    if(settingSidebarThemes==='false' || settingSidebarThemes==='0'){
      if(item.data === 'theme'){item.className = 'd-none'; }
    }
    if(settingSidebarComponents==='false' || settingSidebarComponents==='0'){
      if(item.data === 'components'){item.className = 'd-none'; }
    }

    if ('key' in item) {
      if(item._tag === 'CSidebarNavTitle')
      {
        item._children = [t(`${item.key}`)]
      }
      item.name = t(`${item.key}`);
    }

    if (item._tag==='CSidebarNavDropdown' && item._children.length > 0) {
      item._children.map( child => translate(child));
    }
  }

  const handleSubmit = (e) => {
     e.preventDefault();
     return logout().then(res => {
            if(res) {
                dispatch({type: 'setLogin', name: '',email:'',id:''})
                dispatch({type: 'setApiaries', fetched:false})
                dispatch({type: 'setBeehives', fetched:false})
                dispatch({type: 'setOperations', finishedFetched:false, ongoingFetched:false, plannedFetched:false, templatesFetched:false,})
                dispatch({type: 'setPlans', fetched:false,plansTemplatesFetched: false})
                history.push('/');
            }
            else {
                console.log('error');
            }
        }
  )}

  const setSidebarItems = () => {
    let sidebarItems;
    (loggedUser.role === 'admin') ?
      (sidebarItems = adminNavItems.map(item => {translate(item); return item;})):
      (sidebarItems = navItems.map(item => {translate(item); return item; }))
    return sidebarItems;
  }

  return (
    !loading &&

    <CSidebar
      show={show.sidebarShow}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none text-decoration-none justify-content-start px-3" to="/">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={ setSidebarItems() }
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
          <CSidebarNavItem >
              <a className='c-sidebar-nav-link' href='#' onClick={handleSubmit}><CIcon name='logout-logo' className="c-sidebar-nav-icon"/> {t('sidebar.logout')}</a>
          </CSidebarNavItem>
          <CSidebarNavDivider/>
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
      {loggedUser.show_video===1 &&
      <PrimaryYoutube/>
      }
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
