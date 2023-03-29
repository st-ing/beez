import React, {useEffect} from 'react'
import {
  CCol,
  CRow,
}
  from "@coreui/react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getAllFinishedOperations} from "../../../../endpoints/OperationFunctions";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import {getAllPlans} from "../../../../endpoints/PlanFunctions";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import {DetailButton} from "../../../buttons/Buttons";
import {DetailedIcon} from "../../assets/icons/icons";

const FinishedOperations = () => {
  const dispatch = useDispatch();
  const{t,i18n} = useTranslation();
  const loggedUser = useSelector(state => state.userLogged)
  const finishedOperations = useSelector(state => state.operationState.finished)
  const finishedFetched = useSelector(state => state.operationState.finishedFetched)
  const plans = useSelector(state => state.planState.plans)
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const plansFetched = useSelector(state => state.planState.fetched)
  const apiariesFetched = useSelector(state => state.apiaryState.fetched)
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)

  //DataTable fields
  const fields = [
    { key: 'name', label:  t('operation.name') },
    { key: 'description', label:  t('operation.description') },
    { key: 'status', label:  t('operation.status') },
    { key: 'executed_date', label: t('operation.executed')},
    { key: 'type', label: t('operation.type'),},
    { key: 'plan_id', label: t('operation.in_plan'),},
    { key: 'beehive_id', label: t('sidebar.beehives'),},
    { key: 'apiary_id', label: t('sidebar.apiaries'),},
    { key: 'actions', label: t('plan.actions'),_style: { width: '5%' },sorter: false ,filter: false},
  ]

  useEffect(() => {
    //if finished operations are not fetched fetch them and store in redux finished
    if (!finishedFetched) {
      getAllFinishedOperations().then(data => {
        dispatch({type: 'setOperations', finished: Object.values(data), finishedFetched: true})
      })
    }
    //if apiaries operations are not fetched fetch them and store in redux apiaries
    if (!apiariesFetched) {
      getApiaries(loggedUser.id).then(data => {
        dispatch({type: 'setApiaries', apiaries: Object.values(data), fetched: true})
      })
    }
    //if beehives operations are not fetched fetch them and store in redux beehives
    if (!beehivesFetched) {
      getBeehives(loggedUser.id).then(data => {
        dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
      })
    }
    //if plans operations are not fetched fetch them and store in redux plans
    if (!plansFetched) {
      getAllPlans().then(data => {
        dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
      })
    }
  }, [])

  return(
    <>
      <CRow>
        <CCol>
            <div>
              <BeezDataTable
                items={finishedOperations}
                fields={fields}
                fetched={finishedFetched && apiariesFetched && beehivesFetched && plansFetched}
                scopedSlots={{
                  'description':
                    (item)=> (
                      <td>
                        <p>{item.description?item.description:''}</p>
                      </td>
                    ),
                  'plan_id':
                    (item)=> (
                      <td>
                        <p>{plans.find(plan => plan.id === item.plan_id)?plans.find(plan => plan.id === item.plan_id).title : 'No plan'}</p>
                      </td>
                    ),
                  'apiary_id':
                    (item)=> (
                      <td>
                        <p>{apiaries.find(apiary => apiary.id === item.apiary_id)?apiaries.find(apiary => apiary.id === item.apiary_id).name : ''}</p>
                      </td>
                    ),
                  'beehive_id':
                    (item)=> (
                      <td>
                        <p>{beehives.find(beehive => beehive.id === item.beehive_id)?beehives.find(beehive => beehive.id === item.beehive_id).name : ''}</p>
                      </td>
                    ),
                  'actions':
                    (item) => (
                      <td>
                        <a href={`#/operations/${item.id}`}>
                          <DetailButton
                            title='Detailed view' icon={<DetailedIcon/>}>
                          </DetailButton>
                        </a>
                      </td>
                    )
                }}
                />
            </div>
        </CCol>
      </CRow>
    </>
  )
}
export default FinishedOperations
