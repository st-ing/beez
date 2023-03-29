import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getPlanOperation, getPlanTemplate} from "../../../../endpoints/PlanFunctions";
import {Spinner} from "react-bootstrap";
import "../plans/index.css";
import {
  CCard,
  CCol,
} from "@coreui/react";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
const PlanTemplateDetailedView = (props) => {
  const {t,i18n} = useTranslation();
  const [loadingPage,setLoadingPage] = useState(false);
  const [currentPlan,setCurrentPlan] = useState({});
  const [operations,setOperations] = useState([]);

  const fields = [
    { key: 'name', label: t('operation.name') },
    { key: 'description', label: t('operation.description') },
    { key: 'type', label: t('operation.type'),},
    { key: 'beehive_id', label: t('sidebar.beehives'),},
    { key: 'apiary_id', label: t('sidebar.apiaries'),},
  ]

  useEffect(()=> {
    const id = props.match.params.id;
    getPlanTemplate(id).then(res => {
      setCurrentPlan(res);
      getPlanOperation(id).then(res => {
        setOperations(res);
      });

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
                  <CCol>
                    <h4  className='details-card h4'>{t('plan.description')}</h4>
                    <div className='text-muted'>{t('plan.description')}</div>
                    <div className='details-card-text'>{currentPlan.description}</div>
                  </CCol>
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
export default PlanTemplateDetailedView
