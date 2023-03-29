import React, {useState, useEffect} from 'react'
import {
  CCol,
  CRow,
}
  from "@coreui/react";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {
  getAllFinishedOperations,
  getAllOngoingOperations,
  updateOperation
} from "../../../../endpoints/OperationFunctions";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import {getAllPlans} from "../../../../endpoints/PlanFunctions";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import {DetailButton, IconButton} from "../../../buttons/Buttons";
import {CancelOperationIcon, DetailedIcon, FinishIcon, StartIcon} from "../../assets/icons/icons";

const OngoingOperations = () => {

  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.userLogged)
  const ongoingOperations = useSelector(state => state.operationState.ongoing)
  const ongoingFetched = useSelector(state => state.operationState.ongoingFetched)
  const finishedFetched = useSelector(state => state.operationState.finishedFetched)
  const finishedOperations = useSelector(state => state.operationState.finished)
  const plans = useSelector(state => state.planState.plans)
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const plansFetched = useSelector(state => state.planState.fetched)
  const apiariesFetched = useSelector(state => state.apiaryState.fetched)
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const [loadingRequest,setLoadingRequest] = useState(false);
  const [loadingId, setLoadingId] = useState(-1);
  const [toasts, setToasts] = useState([])

  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }

  const fields = [
    { key: 'name', label: t('operation.name') },
    { key: 'description', label: t('operation.description') },
    { key: 'status', label: t('operation.status') },
    { key: 'planned_date', label: t('operation.planned')},
    { key: 'type', label: t('operation.type'),},
    { key: 'plan_id', label: t('operation.in_plan'),},
    { key: 'beehive_id', label: t('sidebar.beehives'),},
    { key: 'apiary_id', label: t('sidebar.apiaries'),},
    { key: 'operation_actions', label: t('operation.control'),_style: { width: '15%' },sorter: false ,filter: false},
    { key: 'actions', label: t('plan.actions'),_style: { width: '5%' },sorter: false ,filter: false},
  ]

  useEffect(() => {
    //if finished operations are not fetched fetch them and store in redux finished
    if (!finishedFetched) {
      getAllFinishedOperations().then(data => {
        dispatch({type: 'setOperations', finished: Object.values(data), finishedFetched: true})
      })
    }

    //if ongoing operations are not fetched fetch them and store in redux ongoing
    if (!ongoingFetched) {
      getAllOngoingOperations().then(data => {
        dispatch({type: 'setOperations', ongoing: _.sortBy(Object.values(data), 'planned_date'), ongoingFetched: true})
      })
    }

    //if apiaries are not fetched fetch them and store in redux apiaries
    if (!apiariesFetched) {
      getApiaries(loggedUser.id).then(data => {
        dispatch({type: 'setApiaries', apiaries: Object.values(data), fetched: true})
      })
    }

    //if beehives are not fetched fetch them and store in redux beehives
    if (!beehivesFetched) {
      getBeehives(loggedUser.id).then(data => {
        dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
      })
    }

    //if plans are not fetched fetch them and store in redux plans
    if (!plansFetched) {
      getAllPlans().then(data => {
        dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
      })
    }

  },[])

  //remove operation from ongoing and move it to finished update state in db
  const finishOperation = (id) => {
    var operation = ongoingOperations.filter(item => item.id === id)
    var currentOperation = operation[0];
    currentOperation.status = 'done';
    currentOperation.executed_date = moment().format("YYYY-MM-DD");
    setLoadingId(id);
    setLoadingRequest(true);
    updateOperation(currentOperation,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllOngoingOperations().then(data => {
            dispatch({type: 'setOperations',
              ongoing: _.sortBy(Object.values(data), 'planned_date'),
              ongoingFetched: true})
            getAllFinishedOperations().then(data => {
              dispatch({
                type: 'setOperations',
                finished: _.sortBy(Object.values(data), 'planned_date'),
                finishedFetched: true
              })
              setLoadingRequest(false);
              dispatch({type: 'setErrors', errors: ''})
              addToast(
                <p>
                  <label className='pr-1'>We got you the latest changes, update your operations now!</label>
                </p>
              );
            })
          })
        }else {
          dispatch({type: 'setErrors', errors: ''})
          const newList = ongoingOperations.filter((item) => item.id !== id);
          dispatch({type: 'setOperations', ongoing: newList})
          const newFinished = finishedOperations.concat([res.data]);
          dispatch({type: 'setOperations', finished: newFinished})
          setLoadingRequest(false);
        }
      }else {
        dispatch({type: 'setErrors', errors:res});
        setLoadingRequest(false);
      }
    })
  }

  //remove operation from ongoing and move it to canceled update state in db
  const cancelOperation = (id) => {
    var operation = ongoingOperations.filter(item => item.id === id)
    var currentOperation = operation[0];
    currentOperation.status = 'canceled';
    setLoadingId(id);
    setLoadingRequest(true);
    updateOperation(currentOperation,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllOngoingOperations().then(data => {
            dispatch({type: 'setOperations',
              ongoing: _.sortBy(Object.values(data), 'planned_date'),
              ongoingFetched: true})
            getAllFinishedOperations().then(data => {
              dispatch({
                type: 'setOperations',
                finished: _.sortBy(Object.values(data), 'planned_date'),
                finishedFetched: true
              })
              setLoadingRequest(false);
              dispatch({type: 'setErrors', errors: ''})
              addToast(
                <p>
                  <label className='pr-1'>We got you the latest changes, update your operations now!</label>
                </p>
              );
            })
          })
        }else {
          const newList = ongoingOperations.filter((item) => item.id !== id);
          dispatch({type: 'setOperations', ongoing: newList})
          dispatch({type: 'setErrors', errors: ''})
          setLoadingRequest(false);
        }
      }else {
        dispatch({type: 'setErrors', errors:res});
        setLoadingRequest(false);
      }
    })
  }

  return(
    <>
      <CRow>
        <CCol>
            <div>
              <BeezDataTable
                items={ongoingOperations}
                fields={fields}
                fetched={ongoingFetched && apiariesFetched && beehivesFetched && plansFetched && finishedFetched}
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
                  'operation_actions':
                    (item) => (
                      (loadingRequest && loadingId) !== item.id ? (
                        <td>
                          <IconButton
                            disabled={item.status!=='planned'}
                            onClick={() => console.log(item.id)}
                            title='Start operation' icon={<StartIcon/>}
                          />
                          <IconButton
                            disabled={item.status!=='started'}
                            onClick={() => finishOperation(item.id)}
                            title='Finish operation' icon={<FinishIcon/>}
                          >
                          </IconButton>

                          <IconButton
                            title='Cancel operation'
                            onClick={() => cancelOperation(item.id)}
                            icon={<CancelOperationIcon/>}
                          >
                          </IconButton>
                        </td>
                      ):(
                        <td>
                          <div className="spinner-border text-warning" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      )
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
export default OngoingOperations
