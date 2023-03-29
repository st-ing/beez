import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import TheHeaderDropdownTasks from "./TheHeaderDropdownTasks";
import {TheHeaderDropdownLanguage} from "./TheHeaderDropdownLanguage";
import TheHeaderDropdown from "./TheHeaderDropdown";
import {SecondaryYoutube} from "../../../Youtube/YoutubeModal";
import {hideVideo, updateUser} from "../../../../endpoints/UserFunctions";

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)
  const loggedUser = useSelector(state => state.userLogged);
  const [loadingData,setLoadingData] = useState(false);
  const [popup, setPopup] = useState({show: false, id: null});
  const [current, setCurrent] = useState({
    id: loggedUser.id,
    name: loggedUser.name,
    address: loggedUser.address,
    role: loggedUser.role,
    image:loggedUser.image,
    email: loggedUser.email,
    created_at: loggedUser.created_at,
    updated_at: loggedUser.updated_at,
    show_video:loggedUser.show_video
  });


  const toggleSidebar = () => {
    const sidebarValue = sidebarShow.sidebarShow;
    const val = [true, 'responsive'].includes(sidebarValue) ? false : 'responsive';
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const sidebarValue = sidebarShow.sidebarShow;
    const val = [false, 'responsive'].includes(sidebarValue) ? true : 'responsive';
    dispatch({type: 'set', sidebarShow: val})
  }
  const showModal = () => {
    setPopup({show: true, id: null, text:''});
  }

  const close = () => {
    setLoadingData(true);
    hideVideo(current.id).then(() => {
      updateUser(current, current.id).then(res => {
        if (res.data) {
          setCurrent(res.data);
          dispatch({type: 'setLogin', show_video: res.data.show_video});
          setLoadingData(false);
          setPopup({show: false, id: null});
        } else {
          dispatch({type: 'setErrors', errors: res})
        }
      })
    })
  };

  const remindMeNextTime = () => {
    setPopup({show: false, id: null});
  };

  return (
    <>
    <CHeader className='d-flex justify-content-between'>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CHeaderBrand>
      <CHeaderNav>
        <TheHeaderDropdownTasks/>
        <TheHeaderDropdownLanguage/>
        <TheHeaderDropdown showModal={showModal}/>
      </CHeaderNav>
    </CHeader>
    <SecondaryYoutube show={popup.show} close={close} remind={remindMeNextTime} load={loadingData}/>
    </>
  )
}

export default TheHeader
