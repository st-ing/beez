import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getPlan, getPlanOperation} from "../../../../endpoints/PlanFunctions";
import {Spinner} from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../DetailsCard/index.css";
import {
  CCard,
  CCol,
  CRow,
} from "@coreui/react";
import {getAllApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
const PlanDetailedView = (props) => {
  const {t,i18n} = useTranslation();
  const [loadingPage,setLoadingPage] = useState(false);
  const [currentPlan,setCurrentPlan] = useState({});
  const [operations,setOperations] = useState([]);
  const [beehives,setBeehives] = useState([]);
  const [apiaries,setApiaries] = useState([]);

  const loggedUser = useSelector(state => state.userLogged);

  const fields = [
    { key: 'name', label: t('operation.name') },
    { key: 'description', label: t('operation.description') },
    { key: 'status', label: t('operation.status') },
    { key: 'planned_date', label: t('operation.planned')},
    { key: 'executed_date', label: t('operation.executed')},
    { key: 'type', label: t('operation.type'),},
    { key: 'beehive_id', label: t('sidebar.beehives'),},
    { key: 'apiary_id', label: t('sidebar.apiaries'),},
  ]

  useEffect(()=> {
    const id = props.match.params.id;
    getPlan(id).then(res => {
      setCurrentPlan(res);
      getPlanOperation(id).then(res => {
        setOperations(res);
      });
      getAllApiaries(loggedUser.id).then(apiaries => {
        setApiaries(Object.values(apiaries));
      })
      getBeehives(loggedUser.id).then(beehives => {
        setBeehives(Object.values(beehives));
      })
        setLoadingPage(true);
    });
  },[])

  return(
    <>
      {loadingPage?
        (
          <>
                <CCol>
                  <h4 className='py-2'>{currentPlan.title}</h4>
                  <CCard className='details-card'>
                    <CRow className='px-3 py-3'>
                    <CCol>
                      <h4  className='details-card h4'>{t('plan.description')}</h4>
                      <div className='text-muted'>{t('plan.description')}</div>
                      <div className='details-card-text'>{currentPlan.description}</div>
                    </CCol>
                      <CCol  className='details-card'>
                        <h4  className='details-card h4'>{t('plan.dates')}</h4>
                        <div className='text-muted'>{t('plan.start_date')}</div>
                        <div className='details-card-text'>{currentPlan.start_date}</div>
                        <div className='text-muted'>{t('plan.stop_date')}</div>
                        <div className='details-card-text'>{currentPlan.stop_date}</div>
                      </CCol>
                    </CRow>
                  </CCard>

            <BeezDataTable
              items={operations}
              fields={fields}
              fetched={loadingPage}
              scopedSlots={{
                'apiary_id':
                  (item)=> (
                    <td>
                      <p className="pl-1 d-inline-block">{apiaries.find(apiary => apiary.id === item.apiary_id)?apiaries.find(apiary => apiary.id === item.apiary_id).name : 'NULL'}</p>
                    </td>
                  ),
                'beehive_id':
                  (item)=> (
                    <td>
                      <p className="pl-1 d-inline-block">{beehives.find(beehive => beehive.id === item.beehive_id)?beehives.find(beehive => beehive.id === item.beehive_id).name : 'NULL'}</p>
                    </td>
                  ),
              }}
            />
              </CCol>
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
export default PlanDetailedView
