import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getPlan} from "../../../../endpoints/PlanFunctions";
import {Spinner} from "react-bootstrap";
import {
  CCol,
  CRow,
  CCard,
} from "@coreui/react";
import "../plans/index.css";
import {getOperation} from "../../../../endpoints/OperationFunctions";
import {getApiary} from "../../../../endpoints/ApiaryFunctions";
import WidgetTop from "../../../WidgetTop";
import OperationsDetailsCard from "../../../Cards";
const OperationDetailedView = (props) => {

  const {t,i18n} = useTranslation();
  const [loadingPage,setLoadingPage] = useState(false);
  const [currentOperation,setCurrentOperation] = useState({
  });
  const [apiary,setApiary] = useState({});
  const [plan,setPlan] = useState({});

  useEffect(()=> {
    const id = props.match.params.id;
    getOperation(id).then(res => {
      setCurrentOperation(res);
      getApiary(res.apiary_id).then(res => {
        setApiary(res);
      })
      getPlan(res.plan_id).then(res => {
        setPlan(res);
      })
      setLoadingPage(true);
    });
  },[])


  return(
    <>
      {loadingPage ?
        (
          <>
            <CRow>
              <CCol>
                <WidgetTop text={t('operation.status')} header={currentOperation.status} textColor='#EB5757' iconName="status-icon"/>
              </CCol>
              <CCol xs="12" sm="6" lg="3">
                <WidgetTop  text= {t('operation.type')} header={currentOperation.type}  textColor='#F2994A' iconName="analysis-icon"/>
              </CCol>
              {currentOperation.status === 'done'?
                (
              <CCol xs="12" sm="6" lg="3">
                <WidgetTop text={t('operation.executed')} header={currentOperation.executed_date} textColor="#2F80ED" iconName="calendar-icon"/>
              </CCol>):
                (
                  <CCol xs="12" sm="6" lg="3">
                    <WidgetTop text={t('operation.in_plan')} header={plan.title?plan.title:'No plan'} textColor="#2F80ED" iconName="calendar-icon"/>
                  </CCol>
                )}
              <CCol xs="12" sm="6" lg="3">
                <WidgetTop text={t('card.notifications')} header="15" textColor="#219653" iconName="bell-icon"/>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <h4 className='py-3'>{currentOperation.name} </h4>
                <OperationsDetailsCard currentOperation={currentOperation}/>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <h4 className='py-3'>{t('plan.comments')}</h4>
                <CCard className='details-card'>
                <CCol className='p-1'>
                  <div className='planning-comment m-3'>
                  <div className='text-muted'>{currentOperation.planned_date}</div>
                  <div className='details-card-text'>{currentOperation.planning_comments}</div>
                  </div>
                </CCol>
                </CCard>
              </CCol>
              <CCol>
                <h4 className='py-3'>{t('plan.execution.comments')}</h4>
                <CCard className='details-card'>
                  <CCol className='p-1'>
                    <div className='planning-comment m-3'>
                    <div className='text-muted'>{currentOperation.executed_date}</div>
                    <div className='details-card-text'>{currentOperation.execution_comments}</div>
                    </div>
                  </CCol>
                </CCard>
              </CCol>

            </CRow>
          </>
        ):
        (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="warning" />
          </div>
        )
      }

    </>

  )
}

export default OperationDetailedView



