import React, {useState} from "react";
import styled from "styled-components";
import ReactPlayer from 'react-player'
import {CModal} from "@coreui/react";
import {GreyButton, OrangeButton} from "../buttons/Buttons";
import {hideVideo, updateUser} from "../../endpoints/UserFunctions";
import {useDispatch, useSelector} from "react-redux";
import {Spinner} from "react-bootstrap";

const CenteredModal = styled(CModal)`
  .modal-dialog {
    top: 44%;
    left:-20%;
    height:700px;
    width: 1127px;
    transform: translate(0, -48%) !important;
  }
  .modal-content{
  border-radius: 3px 0px 0px 3px !important;
    height: 700px;
    width: 1127px;
  }
`;

export const PrimaryYoutube = ()  => {
  const loggedUser = useSelector(state => state.userLogged);
  const [loadingData,setLoadingData] = useState(false);
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
  const dispatch = useDispatch()
  const [popup, setPopup] = useState({show: true, id: null});

  const closeModal = () => {
    setLoadingData(true);
    hideVideo(current.id).then(() => {
    updateUser(current, current.id).then(res => {
      if (res.data) {
        setCurrent(res.data);
        dispatch({type: 'setLogin', show_video: res.data.show_video});
        setLoadingData(false);
        dispatch({type: 'setErrors', errors: ''});
        setPopup({show: false, id: null});
      } else {
        dispatch({type: 'setErrors', errors: res})
        setLoadingData(false);
       }
     })
    })
  };

  const remindMeNextTime = () => {
    setPopup({show: false, id: null, text:''});
  };

    return (
      <>
        <CenteredModal show={popup.show}>
          <ReactPlayer
            url='https://www.youtube.com/embed/9tcT0a5vAe4'
            height='100%'
            width='100%'
            volume={0.9}
            muted={popup.show === false}
            playing={false}
          />
          {!loadingData ?
            (
              <span className='d-flex justify-content-end py-1'>
                <GreyButton className='px-1' onClick={remindMeNextTime}>
                  Skip and remind me next time
                </GreyButton>
                <OrangeButton className='p-0 m-1' onClick={closeModal}>
                  Close and don't show anymore
                </OrangeButton>
              </span>
            ) :
            (
               <span className='d-flex justify-content-center'>
                 <Spinner animation="border" variant="warning"/>
               </span>
            )
          }
        </CenteredModal>
      </>
    );
}

export const SecondaryYoutube = ({show,remind,close,load})  => {
  const loggedUser = useSelector(state => state.userLogged);

   return (
        <CenteredModal show={show}>
          <ReactPlayer
            url='https://www.youtube.com/embed/9tcT0a5vAe4'
            height='100%'
            width='100%'
            volume={0.9}
            muted={show === false}
            playing={false}
          />
          {loggedUser.show_video===1 ?
            ( <>
              { !load ?
              (
                <span className='d-flex justify-content-end py-1'>
                  <GreyButton className='px-1' onClick={remind}>
                    Skip and remind me next time
                  </GreyButton>
                  <OrangeButton className='p-0 m-1' onClick={close}>
                    Close and don't show anymore
                  </OrangeButton>
                </span>
              ) :
              (
                <span className='d-flex justify-content-center'>
                  <Spinner animation="border" variant="warning"/>
                </span>
              )
            }
             </>
            ) :
            (
              <span className='d-flex justify-content-end py-1'>
                <OrangeButton className='p-0 m-1' onClick={remind}>
                  Close
                </OrangeButton>
              </span>
            )
          }
        </CenteredModal>
    );
}
