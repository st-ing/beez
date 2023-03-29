import React, {useState} from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../../endpoints/UserFunctions";
import history from "../../../history";
import {useTranslation} from "react-i18next";
import './index.css'
import {Link, useRouteMatch} from "react-router-dom";

const TheHeaderDropdown = ({showModal}) => {
  const loggedUser = useSelector(state => state.userLogged);
  const dispatch = useDispatch();
  const{t,i18n} = useTranslation();
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
  const SLink = ({exact, to, children}) => {
    const match=useRouteMatch({
      exact,
      path: to
    })
    return(
          <Link className={match? 'c-sidebar-nav-link c-active p-0' : 'c-sidebar-nav-link p-0'} to={to}>
            {children}
          </Link>
    )}

  return (
    <CDropdown
      inNav
      className="c-header-nav-item px-2 d-flex h-100"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={true}>
        <div className="c-avatar">
            <div id="imagePreview"
                 style= {{backgroundImage: `url(${loggedUser.image})`}}
            >
            </div>
        </div>
        <div className='c-user-name px-1'>{loggedUser.name}</div>
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end">
        <div className='c-sidebar-nav-link py-0 px-2 acn' onClick={showModal}><CIcon name='cil-video' height='18' width='14' className="mfe-2"/> {'Help video'}</div>
        <CDropdownItem divider />
        <div className='py-0 acn px-2'>
        <SLink exact={false} to='/users'><CIcon name='user-logo' height='18' width='14' className='mfe-2'/>{t('sidebar.user.settings')}</SLink>
        </div>
        <CDropdownItem divider />
          <div className='c-sidebar-nav-link py-0 px-2 acn' onClick={handleSubmit}><CIcon name='logout-logo' height='12' width='15' className="mfe-2"/> {t('sidebar.logout')}</div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
