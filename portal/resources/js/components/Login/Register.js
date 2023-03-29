import React, {useState} from 'react';
import { register } from '../../endpoints/UserFunctions';
import './login.css';
import {
    Modal, Spinner,
} from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {CFormText} from "@coreui/react";
import  {freeSet} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {validate} from 'email-validator'

const RegisterModal = () => {

    const [loading,setLoading] = useState(true);
    const [type,setType] = useState('password');
    const [backdrop,setBackdrop] = useState(true);
    const [user,setUser] = useState({name:'',email:'',password:'',repeatPassword:''});
    const { t,i18n } = useTranslation();
    const dispatch = useDispatch()
    const modalVisible = useSelector(state => state.modalShow)
    const errorState = useSelector(state => state.errorState)

    const changeState = (e) => {
        var { name, value} = e.target;
        setUser({
            ...user,
            [name]:value
        });
    }
    const changeStatePassword = (e) => {
      var { name, value} = e.target;
      setUser({
        ...user,
        [name]:value,
        repeatPassword: value
      });
    }
    const handleClickEye = () => {
       type === 'password'? setType('text'):setType('password')
    }

    const handleShowLogin = () => {
      dispatch({type: 'setModal', isRegisterVisible: false});
      dispatch({type: 'setModal', isLoginVisible: true});
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
        }else {
          register(user).then(res => {
            if (!res) {
              setLoading(true);
              setBackdrop(true);
              dispatch({type: 'setErrors', errors: ''})
              setUser({
                ...user,
                email: '', name: '',
                password: '', repeatPassword: ''
              });
              dispatch({
                type: 'setErrors',
                errors: {success: 'You successfuly registered, please verify email to continue'}
              })
            } else if (res.email) {
              setUser({
                ...user,
                email: ''
              });
              dispatch({type: 'setErrors', errors: res})
              setLoading(true);
              setBackdrop(true);
            } else if (res.password) {
              setUser({
                ...user,
                password: '', repeatPassword: ''
              });
              dispatch({type: 'setErrors', errors: res})
              setLoading(true);
              setBackdrop(true);
            }
          })
        }
    }

    const hideModal = () => {
      dispatch({type: 'setErrors', errors:''});
      dispatch({type: 'setModal', isRegisterVisible: false});
    }
    return (
        <>
          <Modal
            centered
            show={modalVisible.isRegisterVisible}
            size="md"
            dialogClassName="modal-style"
            keyboard={false}
            backdrop={backdrop}
            onHide={() => hideModal() }
          >
            <div className="container p-md-5 p-sm-2  p-2">
              <div className="row div-big">
                <div className="col div-regular">
                  <p className="p-small" style={{color:"#FFFFFF"}} onClick={handleShowLogin}>{t("navbar.login")}</p>
                </div>
                <div className="col div-white">
                  <p className="p-small" >{t("login.register")}</p>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                  <div className="form-label-group">
                      <input type='email'
                             style={{width:'300px'}}
                             id="email"
                             className="form-beez"
                             placeholder="Email address"
                             required autoFocus
                             name="email"
                             value={user.email}
                             onChange={(e) => changeState(e)}
                      />
                      <label className="text-center" htmlFor="email">{t("register.email")}</label>
                  </div>

                  <div className="form-label-group">
                      <input
                             id="name"
                             className="form-beez"
                             placeholder="Your name"
                             required
                             name="name"
                             value={user.name}
                             onChange={(e) => changeState(e)}
                      />
                      <label className="text-center" htmlFor="name">{t("register.name")}</label>
                  </div>

                  <div className="form-label-group">
                      <input type={type}
                             style={{width:'300px'}}
                             id="password"
                             name="password"
                             className="form-beez"
                             placeholder="Password"
                             value={user.password}
                             onChange={(e) => changeStatePassword(e)}
                             required
                      />
                      <label className="text-center" htmlFor="password">{t("register.password")}</label>
                      <CIcon className="eye-icon-position" content={freeSet.cilLowVision} onClick={handleClickEye}/>
                  </div>
                {loading?
                  (
                    <div className="text-center">
                      <button
                        className="btn btn-login text-uppercase font-weight-bold"
                        type="submit">{t("register.sign_up")}
                      </button>
                    </div>
                  ):(
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" variant="warning" />
                    </div>
                  )
                }
                {errorState.errors['email'] && <CFormText className="help-block text-center">{errorState.errors['email'][0]}</CFormText>}
                {errorState.errors['password'] && <CFormText className="help-block text-center">{errorState.errors['password'][0]}</CFormText>}
                { errorState.errors['success'] && <CFormText className="success-block text-center">{errorState.errors['success']}</CFormText> }
              </form>
            </div>
          </Modal>
        </>
    )
}
export default RegisterModal;
