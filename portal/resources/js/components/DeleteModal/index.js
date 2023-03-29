import React from "react";
import {CModal,CButton} from "@coreui/react";
import styled from "styled-components";
import CIcon from "@coreui/icons-react";
import {useTranslation} from "react-i18next";


const CenteredModal = styled(CModal)`
  .modal-dialog {
    max-width: 300px !important;
    top: 50%;
    transform: translate(0, -50%) !important;
  }
  .modal-content{
    border-radius: 10px !important;
  }
`;
const IconHolder = styled.div`
  width: 37px;
  height: 37px;
  background: #F0F0F8; !important;
  border-radius: 100% !important;
  margin-right: 0.5rem;
  display: flex;
  justify-content: center;
`;
const YellowSpan = styled.span`
  color: #F6BD60;
`;
const DeleteHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  color: #3D405B;
`;
const DeleteBody = styled.div`
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  color: #3D405B;
`;
const DeleteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
`;
const DeleteModal = ({ handleDeleteTrue,handleDeleteFalse,show,text,type})  => {
  const{t,i18n} = useTranslation();
  return (
    <CenteredModal show={show} onClose={handleDeleteFalse}>
      <DeleteHeader>
        <IconHolder><CIcon name='delete-icon' width={20}/></IconHolder>
        <h3 className='m-0'> {t('delete.modal')} {type}?</h3>
      </DeleteHeader>
      <DeleteBody>
        <span> {t('delete.question')} {" "} </span><YellowSpan> {text} </YellowSpan>,
      </DeleteBody>
      <DeleteBody>
        {t('cannot.be_undone')}
      </DeleteBody>
      <DeleteFooter>
        <CButton id='deleteYes' onClick={handleDeleteTrue} color="danger" className='px-4'> {t('delete.yes')} </CButton>
        <CButton id='deleteNo' color="secondary" onClick={handleDeleteFalse} className='px-4'> {t('delete.no')} </CButton>
      </DeleteFooter>
    </CenteredModal>
  );
}

export default DeleteModal;
