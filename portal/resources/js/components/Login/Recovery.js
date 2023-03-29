import React, {useState} from 'react';
import './login.css';
import {
  Modal, Spinner,
} from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {reset} from "../../endpoints/UserFunctions";
import { CFormText } from "@coreui/react";


const RecoveryModal = () => {

  const [loading,setLoading] = useState(true);
  const [backdrop,setBackdrop] = useState(true);
  const { t,i18n } = useTranslation();
  const dispatch = useDispatch()
  const modalVisible = useSelector(state => state.modalShow)
  const errorState = useSelector(state => state.errorState)
  const [email, setEmail] = useState(modalVisible.email);

  const hideModalRecovery = () => {
    dispatch({type: 'setErrors', errors:''});
    dispatch({type: 'setModal', isRecoveryVisible: false});
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(false);
    setBackdrop('static');
    const data = {
      'email': email,
      'locale': document.documentElement.lang
    }
    reset(data).then(res => {
      if(!res) {
        setLoading(true);
        setBackdrop(true);
        dispatch({type: 'setErrors', errors: {success:'We have emailed your password reset link!'}})
      }
      else {
        setLoading(true);
        setBackdrop(true);
        dispatch({type: 'setErrors', errors:res})
      }
    })
  }

  return (
    <>
      <Modal
        centered
        show={modalVisible.isRecoveryVisible}
        size="md"
        dialogClassName="modal-style"
        keyboard={false}
        backdrop={backdrop}
        onHide={() => hideModalRecovery()}
      >
        <div className="container p-md-5 p-sm-0  p-0">
          <div className="row div-big text-center">
            <div className="col col-recovery"> {t("recovery.title")} </div>
          </div>
          <form onSubmit={handleSubmit}>
          <div className="form-label-group margin-new">
            <input
              id="email"
              className="form-beez"
              placeholder="Email address"
              required autoFocus
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label className="text-center" htmlFor="email">{t("recovery.email")}</label>
          </div>

            {loading?(
              <div className="text-center">
                <button
                  className="btn btn-recovery text-uppercase font-weight-bold" type="submit">
                  {t("recovery.reset")}
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
export default RecoveryModal;


