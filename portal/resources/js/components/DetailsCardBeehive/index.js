import React from "react";
import {CCard, CCol, CRow, CTabContent, CTabPane} from "@coreui/react";
import '../DetailsCard/index.css';
import {useTranslation} from "react-i18next";
const DetailsCardBeehive = ({currentBeehive}) => {
  const {t,i18n} = useTranslation();
  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
  }
  return(
    <CCard className='details-card'>
      <CRow className='px-5 py-3'>
        <CCol>
          <h4>Details</h4>
          <div className='text-muted'>{t('modal.beehive.name')}</div>
          <div className='details-card-text'>{currentBeehive.name}</div>
          <div className='text-muted'>{t('modal.beehive.type')}</div>
          <div className='details-card-text'>{currentBeehive.type}</div>
        </CCol>
        <CCol>
          <h4>Description</h4>
          <div className='text-muted'>{t('beehive.pane.description')}</div>
          <div className='details-card-text'>{currentBeehive.description}</div>
          <div className='text-muted'>{t('modal.beehive.source_of_swarm')}</div>
          <div className='details-card-text' >{currentBeehive.source_of_swarm}</div>
        </CCol>

      </CRow>
      <CRow className='px-5 py-3'>
        <CCol>
          <h4>Frames</h4>
          <div className='text-muted'>{t('modal.beehive.honey_frames')}</div>
          <div className='details-card-text'>{currentBeehive.num_honey_frames}</div>
          <div className='text-muted'>{t('modal.beehive.pollen_frames')}</div>
          <div className='details-card-text'>{currentBeehive.num_pollen_frames}</div>
          <div className='text-muted'>{t('modal.beehive.brood_frames')}</div>
          <div className='details-card-text'>{currentBeehive.num_brood_frames}</div>
          <div className='text-muted'>{t('modal.beehive.empty_frames')}</div>
          <div className='details-card-text'>{currentBeehive.num_empty_frames}</div>
        </CCol>
        <CCol>
          <h4>Dates</h4>
          <div className='text-muted'>{t('beehive.pane.dates.created')}</div>
          <div className='details-card-text' >{convertUTCDateToLocalDate(new Date(currentBeehive.created_at)).toLocaleDateString()}</div>
          <div className='text-muted'>{t('beehive.pane.dates.updated')}</div>
          <div className='details-card-text' >{convertUTCDateToLocalDate(new Date(currentBeehive.updated_at)).toLocaleDateString()}</div>
          <div className='text-muted'>{t('modal.beehive.installation_date')}</div>
          <div className='details-card-text' >{convertUTCDateToLocalDate(new Date(currentBeehive.installation_date)).toLocaleDateString()}</div>
        </CCol>
      </CRow>
    </CCard>
  )
}
export default DetailsCardBeehive
