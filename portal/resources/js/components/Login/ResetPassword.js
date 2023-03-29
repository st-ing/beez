import { resetPassword } from "../../endpoints/UserFunctions";
import React, { useState } from 'react';
import './login.css';
import {
  Modal, Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CFormText } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";


const ResetPassword = ({email,token}) => {

  const [loading,setLoading] = useState(true);
  const [backdrop,setBackdrop] = useState(true);
  const { t,i18n } = useTranslation();
  const dispatch = useDispatch()
  const modalVisible = useSelector(state => state.modalShow)
  const errorState = useSelector(state => state.errorState)
  const [type,setType] = useState('password');
  const [password, setPassword] = useState("");

  const hideModalResetPassword = () => {
    dispatch({type: 'setErrors', errors:''});
    dispatch({type: 'setModal', isPasswordResetVisible: false});
  }

  const handleSubmit = (e) => {
    setLoading(false);
    setBackdrop('static');
    e.preventDefault();
    const newPassword = {
      token: token,
      email: email,
      password: password,
      repeatPassword: password
    }
    resetPassword(newPassword).then(res => {
      if(!res) {
        setLoading(true);
        setBackdrop(true);
        dispatch({type: 'setErrors', errors: {success:'You successfuly changed password'}})
      }
      else if (res.email){
        setLoading(true);
        setBackdrop(true);
        dispatch({type: 'setErrors', errors:res})
      }
      else if (res.password){
        setLoading(true);
        setBackdrop(true);
        dispatch({type: 'setErrors', errors:res})
        setPassword('');
      }
    })
  }
  const handleClickEye = () => {
    type === 'password'? setType('text'):setType('password')
  }

  return (
    <>
      <Modal
        centered
        show={modalVisible.isPasswordResetVisible}
        size="md"
        dialogClassName="modal-style"
        keyboard={false}
        backdrop={backdrop}
        onHide={() => hideModalResetPassword()}
      >
        <div className="container p-md-5 p-sm-0 p-0">
          <div className="row div-big text-center">
            <div className="col col-recovery"> Reset Password </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-label-group margin-new">
              <input type={type}
                     style={{width:'300px'}}
                     id="password"
                     name="password"
                     className="form-beez"
                     placeholder="Password"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     required
              />
              <label className="text-center" htmlFor="password">{t("register.password")}</label>
              <CIcon className="eye-icon-position mr-4" content={freeSet.cilLowVision} onClick={handleClickEye}/>
            </div>
            {loading?(
                <div className="text-center">
                  <button
                    className="btn btn-recovery text-uppercase font-weight-bold" type="submit">
                    Reset
                  </button>
                </div>
              ):(
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" variant="warning" />
                </div>
              )
            }
            { errorState.errors['email'] && <CFormText className="help-block text-center">{errorState.errors['email'][0]}</CFormText> }
            { errorState.errors['success'] && <CFormText className="success-block text-center">{errorState.errors['success']}</CFormText> }
          </form>
        </div>
      </Modal>
    </>
  )
}
export default ResetPassword;


