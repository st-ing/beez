import React, { useState } from 'react';
import {login, getUser, googleLogin} from '../../endpoints/UserFunctions';
import GoogleButton from 'react-google-button'
import './login.css';
import {
  FormCheck,
  Modal, Spinner,
} from 'react-bootstrap';
import history from '../history';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {CFormGroup, CFormText, CInputCheckbox, CLabel, CSwitch} from "@coreui/react";
import {validate} from 'email-validator'

const LoginModal = () => {
    const errorState = useSelector(state => state.errorState)
    const [backdrop,setBackdrop] = useState(true);
    const [user,setUser] = useState({email:'',password:'',remember:false});
    const [loading,setLoading] = useState(true);
    const {t,i18n} = useTranslation();

    const dispatch = useDispatch()
    const modalVisible = useSelector(state => state.modalShow)

    const changeState = (e) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      setUser({
        ...user,
        [name]:value
      });
    }

    const handleShowRegister = () => {
        dispatch({type: 'setModal', isLoginVisible: false});
        dispatch({type: 'setModal', isRegisterVisible: true});
    }
    const handleShowRecovery = () => {
        dispatch({type: 'setModal', isLoginVisible: false});
        dispatch({type: 'setModal', email: user.email});
        dispatch({type: 'setModal', isRecoveryVisible: true});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(false);
        setBackdrop('static');
        if(!validate(user.email)){
          dispatch({type: 'setErrors', errors:{"email":["Please enter a valid email address"]}})
          setUser({...user,email: ''})
          setBackdrop(true);
          setLoading(true);
        }else{
          login(user).then(res => {
              if(!res) {
                  getUser().then(result => {
                      if(result){
                          setLoading(true);
                          setBackdrop(true);
                          dispatch({type: 'setModal', isLoginVisible: false})
                          dispatch({type: 'setErrors', errors:''})
                          return history.push("/panel");
                      }
                  })
              }
              else{
                  dispatch({type: 'setErrors', errors:res})
                  setBackdrop(true);
                  setUser({email: '',password: ''})
                  setLoading(true);
              }
          })
        }
    }

    const handleForgot = (e) => {
        e.preventDefault();
        history.push({
            pathname: '/reset',
            state: { email:user.email }
        });
    }

    const hideModalLogin = () => {
      dispatch({type: 'setErrors', errors:''});
      dispatch({type: 'setModal', isLoginVisible: false});
    }
    const loginWithGoogle = () => {
      setLoading(false);
      googleLogin().then(data => {
        setLoading(true);
        window.location = data;
      });
    }

    return (
        <>
            <Modal
              centered
              show={modalVisible.isLoginVisible}
              size="md"
              dialogClassName="modal-style"
              keyboard={false}
              backdrop={backdrop}
              onHide={() => hideModalLogin()}
            >
                <div className="container p-md-5 p-sm-2 p-2">
                  <div className="row div-big">
                    <div className="col div-white">
                      <p className="p-small">{t("navbar.login")}</p>
                    </div>
                    <div className="col div-regular" onClick={handleShowRegister}>
                      <p className="p-small" style={{color:"#FFFFFF"}}>{t("login.register")}</p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-label-group">
                      <input
                        id="inputEmail"
                        className="form-beez"
                        placeholder="Email address"
                        required autoFocus
                        name="email"
                        value={user.email}
                        onChange={(e) => changeState(e)}
                      />
                      <label className="text-center" htmlFor="inputEmail">{t("login.email")}</label>
                    </div>
                    <div className="form-label-group">
                      <input type="password"
                             id="inputPassword"
                             name="password"
                             className="form-beez"
                             placeholder="Password"
                             value={user.password}
                             onChange={(e) => changeState(e)}
                             required
                      />
                      <label className="text-center" htmlFor="inputPassword">{t("login.password")}</label>
                      <div className="row row-big">
                        <div className="col col-small">
                          <CFormGroup variant="custom-checkbox" className='d-flex justify-content-center'>
                              <CInputCheckbox
                                custom
                                id="remember"
                                name="remember"
                                value={user.remember}
                                onChange={(e) => changeState(e)}
                              />
                              <CLabel variant="custom-checkbox" htmlFor="remember" className='text-inside' >{t("login.remember_me")}</CLabel>
                            </CFormGroup>
                        </div>
                        <div className="col col-small text-center">
                          <p className="small text-inside btn" id="forget-password" onClick={handleShowRecovery}>{t("login.forgot")}</p>
                        </div>
                      </div>
                    </div>
                    {loading?(
                      <>
                        <div className="text-center">
                          <button
                            className="btn btn-login text-uppercase font-weight-bold"
                            type="submit">{t("login.sign_in")}
                          </button>
                        </div>
                        <div>
                          <GoogleButton
                            label='Google'
                            type='light'
                            className='mx-auto my-2 google-btn text-left'
                            onClick={loginWithGoogle}
                          />
                        </div>
                      </>
                    ):(
                      <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="warning" />
                      </div>
                      )
                    }
                    {errorState.errors['email'] && <CFormText className="help-block text-center">{errorState.errors['email'][0]}</CFormText>}
                  </form>
                </div>
            </Modal>
        </>
    )
}
export default LoginModal;
