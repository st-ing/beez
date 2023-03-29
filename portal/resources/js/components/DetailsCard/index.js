import React from "react";
import {CCard, CCol, CRow} from "@coreui/react";
import './index.css';
const DetailsCard = ({currentApiary}) => {
  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
  }
  return(
    <CCard className='details-card'>
      <CRow className='px-3 py-3'>
        <CCol>
          <h4>Details</h4>
          <div className='text-muted'>Apiary Name</div>
          <div className='details-card-text'>{currentApiary.name}</div>
          <div className='text-muted'>Apiary Address</div>
          <div className='details-card-text'>{currentApiary.address}</div>
        </CCol>
        <CCol>
          <h4>Info</h4>
          <div className='text-muted'>Type of Environment</div>
          <div className='details-card-text'>{currentApiary.type_of_env}</div>
          <div className='text-muted'>Flora Type</div>
          <div className='details-card-text'>{currentApiary.flora_type}</div>
          <div className='text-muted'>Sun Exposure</div>
          <div className='details-card-text'>{currentApiary.sun_exposure}</div>
        </CCol>
      </CRow>
      <CRow className='px-3 py-3'>
        <CCol>
          <h4>Description</h4>
          <div className='text-muted'>Description</div>
          <div className='details-card-text'>{currentApiary.description}</div>
          <div className='text-muted'>Apiary Altitude</div>
          <div className='details-card-text' >{Math.round(currentApiary.altitude)}m</div>
          <div className='text-muted'>Migrate</div>
          <div className='details-card-text' >{currentApiary.migrate?'Yes':'No'}</div>
        </CCol>
        <CCol>
          <h4>Dates</h4>
          <div className='text-muted'>Created at</div>
          <div className='details-card-text' >{convertUTCDateToLocalDate(new Date(currentApiary.created_at)).toLocaleDateString()}</div>
          <div className='text-muted'>Updated at</div>
          <div className='details-card-text' >{convertUTCDateToLocalDate(new Date(currentApiary.updated_at)).toLocaleDateString()}</div>
        </CCol>
      </CRow>
    </CCard>
  )
}
export default DetailsCard
