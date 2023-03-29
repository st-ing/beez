import React, {useEffect} from 'react';
import styled from 'styled-components'
import './login.css';
import LoginModal from "./Login";
import RegisterModal from "./Register";
import RecoveryModal from "./Recovery";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import ResetPassword from "./ResetPassword";

const StyledA = styled.a`
    cursor: pointer;
`;

export const AuthModal = () => {
    const dispatch = useDispatch()
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const mail = params.get('email');
    const modalVisible = useSelector(state => state.modalShow)
    const{t,i18n} = useTranslation();
    useEffect(() => {
      if(token && mail){
        dispatch({type: 'setModal', isLoginVisible: false})
        dispatch({type: 'setModal', isRegisterVisible: false})
        dispatch({type: 'setModal', isRecoveryVisible: false})
        dispatch({type: 'setModal', isPasswordResetVisible: true})
      }
    },[]);
    const handleShowLogin = () => {
        dispatch({type: 'setModal', isLoginVisible: true})
    }
    return (
      <>
        <StyledA className="nav-link navBarLogin navigation-login" onClick={handleShowLogin}>
            {t("navbar.login")}
        </StyledA>

        { modalVisible.isLoginVisible && <LoginModal />}
        { modalVisible.isRegisterVisible && <RegisterModal />}
        { modalVisible.isRecoveryVisible && <RecoveryModal />}
        { modalVisible.isPasswordResetVisible && <ResetPassword email={mail} token={token} />}
      </>
    )
}
