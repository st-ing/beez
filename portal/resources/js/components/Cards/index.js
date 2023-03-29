import React from "react";
import {CCard, CCol, CRow} from "@coreui/react";
import '../DetailsCard/index.css';
import {useTranslation} from "react-i18next";
import WidgetTop from "../WidgetTop";

const OperationsDetailsCard = ({currentOperation}) => {
  const {t,i18n} = useTranslation();
  return(
    <CCard className='details-card'>
      <CRow className='p-3'>
        <CCol>
          <h4>{t('operation.details')}</h4>
          <div className='text-muted'>{t('plan.comments')}</div>
          <div className='details-card-text'>{currentOperation.planning_comments}</div>
        </CCol>
        <CCol>
          <h4>{t('operation.description')}</h4>
          <div className='text-muted'>{t('operation.description')}</div>
          <div className='details-card-text'>{currentOperation.description}</div>
        </CCol>
      </CRow>
    </CCard>
  )
}
export default OperationsDetailsCard

export const OperationTemplateDetailsCard = ({currentOperation,plan}) => {
  const {t,i18n} = useTranslation();
  return(
    <>
    <CRow>
      <CCol xs="12" sm="6" lg="3">
        <WidgetTop  text={t('operation.type')} header={currentOperation.type}
                   textColor='#F2994A'
                   iconName="analysis-icon"/>
      </CCol>
      <CCol xs="12" sm="6" lg="3">
        <WidgetTop  text={t('operation.in_plan')} header={plan.title ? plan.title : 'No plan'}
                    textColor="#2F80ED" iconName="calendar-icon"/>
      </CCol>
    </CRow>
  <CRow>
    <CCol>
      <h4 className='py-3' >{currentOperation.name} </h4>
    <CCard className='details-card'>
      <CRow className='p-3'>
        <CCol>
          <h4>{t('operation.details')}</h4>
          <div className='text-muted'>{t('plan.comments')}</div>
          <div className='details-card-text'>{currentOperation.planning_comments}</div>
        </CCol>
        <CCol>
          <h4>{t('operation.description')}</h4>
          <div className='text-muted'>{t('operation.description')}</div>
          <div className='details-card-text'>{currentOperation.description}</div>
        </CCol>
      </CRow>
    </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol>
      <h4 className='py-3'>{t('plan.comments')}</h4>
      <CCard className='details-card'>
        <CCol className='p-1'>
          <div className='planning-comment m-3'>
            <div className='text-muted' >{currentOperation.planned_date}</div>
            <div className='details-card-text' >{currentOperation.planning_comments}</div>
          </div>
        </CCol>
      </CCard>
    </CCol>
  </CRow>
      </>
  )
}

export const SelectPlanTemplateCard = ({x}) => {
  const {t,i18n} = useTranslation();
  return(
    <CCard className='select-card'>
      <h4 className='text-muted-select'>{t('plan.title')}</h4>
      <div className='text-select' > {x.title} </div>
      <h4 className='text-muted-select'>{t('plan.description')}</h4>
      <div className='text-select'> {x.description.length > 50 ?
        `${x.description.substring(0, 50)}...` : x.description} </div>
      <CRow>
        <CCol>
          <h4 className='text-muted-select'>{t('plan.start_date')}</h4>
          <div className='text-select' > {x.start_date} </div>
        </CCol>
        <CCol>
          <h4 className='text-muted-select'>{t('plan.stop_date')}</h4>
          <div className='text-select'> {x.stop_date} </div>
        </CCol>
      </CRow>
    </CCard>
  )
}
export const SelectOperationTemplateCard = ({x,i}) => {
  const {t,i18n} = useTranslation();
  return(
    <CCard className='select-card'>
      <h4 className='text-muted-select'>{t('operation.name')}</h4>
      <div className='text-select' > {x.name} </div>
      <h4 className='text-muted-select d-flex'>{t('operation.description')}</h4>
      <div className='text-select' key={i}> {x.description} </div>
      <CRow>
        <CCol>
          <h4 className='text-muted-select'>{t('operation.type')}</h4>
          <div className='text-select d-flex'> {x.type} </div>
        </CCol>
        <CCol>
          <h4 className='text-muted-select'>{t('operation.in_plan')}</h4>
          <div className='text-select'> {x.in_plan} </div>
        </CCol>
        <CCol>
          <h4 className='text-muted-select'>{t('operation.apiary')}</h4>
          <div className='text-select'> {x.apiary_id} </div>
        </CCol>
        <CCol>
          <h4 className='text-muted-select'>{t('operation.beehive')}</h4>
          <div className='text-select' > {x.beehive_id} </div>
        </CCol>
      </CRow>
    </CCard>
  )
}
