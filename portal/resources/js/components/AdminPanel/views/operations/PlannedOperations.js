import React, {useState, useEffect} from 'react'
import {
  CCardBody,
  CCol,
  CFormGroup,
  CFormText,
  CInputGroup,
  CNav,
  CRow,
  CTabContent,
  CTabPane,
  CTabs,
}
  from "@coreui/react";
import CIcon from "@coreui/icons-react";
import moment from "moment";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import {useDispatch, useSelector} from "react-redux";
import ModalComponent from "../../../Modal";
import {useTranslation} from "react-i18next";
import "../plans/index.css";
import {
  addOperation,
  deleteOperation, getAllFinishedOperations,
  getAllOngoingOperations,
  getAllPlannedOperations,
  getTemplates,
  updateOperation
} from "../../../../endpoints/OperationFunctions";
import DeleteModal from "../../../DeleteModal";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import {getAllPlans} from "../../../../endpoints/PlanFunctions";
import NotifyToaster from "../../../NotifyToaster";
import {
  DeleteButton,
  DetailButton, GreyButton, IconButton, OrangeButton,
  PrimaryButton,
  SecondaryButton, UpdateButton
} from "../../../buttons/Buttons";

import PrimaryInput, {
  DateInput,
  PrimaryLabel,
  PrimaryTextarea
} from "../../../inputs/Inputs";
import PrimaryTab, {
  GreyLeftTab,
  GreyNoRadiusTab,
  GreyPrimaryTab, GreyRightTab,
  OrangeLeftTab, OrangeNoRadiusTab, OrangeRightTab,
  OrangeSecondaryTab,
  SecondaryTab
} from "../../../tabs/Tabs";
import * as PropTypes from "prop-types";
import PrimarySelect from "../../../select/Select";
import {
  AddIcon,
  CancelOperationIcon, DeleteIcon,
  DetailedIcon,
  FinishIcon, OperationsTemplateIcon,
  SelectIcon, SelectTemplateIcon,
  StartIcon, TemplateIcon,
  UpdateIcon
} from "../../assets/icons/icons";
import dateFnsFormat from "date-fns/format";
import {SelectOperationTemplateCard} from "../../../Cards";

CInputGroup.propTypes = {children: PropTypes.node};
const PlannedOperations = () => {

  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const [activeType, setActiveType] = useState(0);
  const [loadingId, setLoadingId] = useState(-1);
  const loggedUser = useSelector(state => state.userLogged);
  const errorState = useSelector(state => state.errorState);
  const [show,setShow] = useState(false);
  const [showTemplate,setShowTemplate] = useState(false);
  const [loadingRequest,setLoadingRequest] = useState(false);
  const [loadingModal,setLoadingModal] = useState(false);
  const templates = useSelector(state => state.operationState.templates)
  const templatesFetched = useSelector(state => state.operationState.templatesFetched)
  const plannedOperations = useSelector(state => state.operationState.planned)
  const plannedFetched = useSelector(state => state.operationState.plannedFetched)
  const ongoingOperations = useSelector(state => state.operationState.ongoing)
  const ongoingFetched = useSelector(state => state.operationState.ongoingFetched)
  const plans = useSelector(state => state.planState.plans)
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const plansFetched = useSelector(state => state.planState.fetched)
  const apiariesFetched = useSelector(state => state.apiaryState.fetched)
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const [popup, setPopup] = useState({
    show: false,
    id: null,
  });
  const [current,setCurrent] = useState({
    id: '',
    name: '',
    description: '',
    status: '',
    planning_comments: '',
    execution_comments: '',
    planned_date: null,
    executed_date: null,
    comments: '',
    type: '',
    template: '',
    user_id:'',
    plan_id:'',
    beehive_id:'',
    apiary_id:''
  });

  const [toasts, setToasts] = useState([])

  const [selectApiaries,setSelectApiaries] = useState([])
  const [selectBeehives,setSelectBeehives] = useState([])
  const [selectPlans,setSelectPlans] = useState([])


  const apiariesOptions = (apiaries) => {
    let data = []

    let nullValue = {};
    nullValue.value = null;
    nullValue.label = 'No apiary';
    nullValue.name = 'apiary_id';
    data.push(nullValue)
    apiaries.map(item => {
      let apiary = {};
      apiary.value = item.id;
      apiary.label = item.name;
      apiary.name = 'apiary_id';
      data.push(apiary);
      }
    )
    setSelectApiaries(data);
  }

  const beehivesOptions = (beehives) => {

    let data = []
    let nullValue = {};

    nullValue.value = null;
    nullValue.label = 'No beehive';
    nullValue.name = 'beehive_id';
    data.push(nullValue)
    beehives.map(item => {
      let beehive = {};
      beehive.value = item.id;
      beehive.label = item.name;
      beehive.name = 'beehive_id';
      data.push(beehive);
      }
    )
    setSelectBeehives(data);
  }

  const plansOptions = (plans) => {

    let data = []
    let nullValue = {};
    nullValue.value = null;
    nullValue.label = ' ';
    nullValue.name = 'plan_id';
    data.push(nullValue)

    plans.map(item => {
    let plan = {};
    plan.value = item.id;
    plan.label = item.title;
    plan.name = 'plan_id';
    data.push(plan);
      }
    )
    setSelectPlans(data);
  }

  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }

  //DataTable planned operation fields
  const fields = [
    { key: 'name', label:  t('operation.name') },
    { key: 'description', label:  t('operation.description') },
    { key: 'status', label:  t('operation.status') },
    { key: 'planned_date', label:  t('operation.planned') },
    { key: 'type', label:  t('operation.type') },
    { key: 'plan_id', label:  t('operation.in_plan')},
    { key: 'beehive_id', label:  t('sidebar.beehives')},
    { key: 'apiary_id', label:  t('sidebar.apiaries')},
    { key: 'operation_actions', label:  t('operation.control'),_style: { width: '130px' },sorter: false ,filter: false},
    { key: 'actions', label: t('plan.actions'),_style: { width: '120px' },sorter: false ,filter: false},
  ]

  //DataTable template fields
  const template_fields = [
    { key: 'name', label:  t('user.name') },
    { key: 'description', label:  t('plan.description') },
    { key: 'type', label: t('operation.type'),},
    { key: 'plan_id', label: t('operation.in_plan'),},
    { key: 'beehive_id', label: t('sidebar.beehives')},
    { key: 'apiary_id', label: t('sidebar.apiaries')},
  ]

  const addSelectedStyle = id => {
    const newList = plannedOperations.map((item) => {
      if (item.id === id) {
        item._classes = 'bg-warning'
        return item;
      }
      return item;
    });
    dispatch({type: 'setOperations', planned: newList})
  }

  //remove Selected Style
  const removeSelectedStyle = id => {
    const newList = plannedOperations.map((item) => {
      if (item.id === id) {
        item._classes = ''
        return item;
      }
      return item;
    });
    dispatch({type: 'setOperations', planned: newList})
  }

  useEffect(() => {
    //if templates are not fetched fetch them and store in redux templates
    if (!templatesFetched) {
      getTemplates().then(data => {
        dispatch({type: 'setOperations',templates:Object.values(data), templatesFetched:true})
      })
    }

    //if planned operations are not fetched fetch them and store in redux planned
    if (!plannedFetched){
      getAllPlannedOperations().then(data => {
        dispatch({type: 'setOperations', planned: _.sortBy(Object.values(data), 'planned_date'), plannedFetched: true})
      })
    }

    //if ongoing operations are not fetched fetch them and store in redux ongoing
    if(!ongoingFetched) {
      getAllOngoingOperations().then(data => {
        dispatch({type: 'setOperations', ongoing: _.sortBy(Object.values(data), 'planned_date'), ongoingFetched: true})
      })
    }

    //if apiaries are not fetched fetch them and store in redux apiaries
    if (!apiariesFetched) {
      getApiaries(loggedUser.id).then(data => {
        dispatch({type: 'setApiaries', apiaries: Object.values(data), fetched: true})
        apiariesOptions(Object.values(data))
      })

    }else{

      apiariesOptions(apiaries)

    }

    //if beehives operations are not fetched fetch them and store in redux beehives
    if (!beehivesFetched) {
      getBeehives(loggedUser.id).then(data => {
        dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
        beehivesOptions(Object.values(data))
      })
    }else{

      beehivesOptions(beehives)
    }

    //if plans operations are not fetched fetch them and store in redux plans
    if (!plansFetched) {
      getAllPlans().then(data => {
        dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
        plansOptions(Object.values(data))
      })
    }else{

      plansOptions(plans)
    }

  },[])

  //CREATE OPERATION FUNCTIONS

  //open modal for creating new operation
  const createModal = () => {
    setCurrent({
      id: '',
      name: '',
      description: '',
      status: '',
      planning_comments: '',
      planned_date: null,
      executed_date: null,
      comments: '',
      type: '',
      harvest_honey:'',
      harvest_weight:'',
      harvest_batch_id:'',
      template: '',
      user_id:'',
      plan_id:null,
      beehive_id:null,
      apiary_id:null
    });
    setShow(true);
  }

  //reset modal when creating operation
  const resetFormCreate = () => {
    setCurrent({
      id: '',
      name: '',
      description: '',
      status: '',
      planning_comments: '',
      planned_date: `${dateFnsFormat(new Date(),"yyyy-MM-dd" )}`,
      executed_date: `${dateFnsFormat(new Date(),"yyyy-MM-dd" )}`,
      comments: '',
      type: '',
      template: '',
      user_id:'',
      plan_id:null,
      beehive_id:null,
      apiary_id:null
    });
    dispatch({type: 'setErrors', errors:''})
  }

  //adding new operation, if true add operation to operation store, if not show errors
  const createOperation = () => {
    setLoadingModal(true);
    var currentOperation = {...current};
    currentOperation.user_id = loggedUser.id;
    currentOperation.status = 'planned';
    !currentOperation.planned_date && (currentOperation.planned_date = moment().format("YYYY-MM-DD"));
    currentOperation.template = false;
    setCurrent(currentOperation);
    addOperation(currentOperation).then(res => {
      if(res.data){
        const newList = plannedOperations.concat([res.data]);
        dispatch({type: 'setOperations',planned:newList})
        setLoadingModal(false);
        setShow(false);
        dispatch({type: 'setErrors', errors:''})
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  //EDIT OPERATION FUNCTIONS

  //open modal for editing operation
  const showModal = id => {
    addSelectedStyle(id)
    setShow(true);
    var operation = plannedOperations.filter(item => item.id === id)
    setCurrent({
      ...operation[0],
    });
  }

  //reset form when editing operation, initial state without changes
  const resetForm = (id) => {
    var operation = plannedOperations.filter(item => item.id === id)
    setCurrent(operation[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //update operation, if successful add operation to planned.
  //if not show errors for missing fields
  const changeOperation = id => {
    setLoadingModal(true);
    updateOperation(current,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllPlannedOperations().then(data => {
            dispatch({type: 'setOperations',
              planned: _.sortBy(Object.values(data), 'planned_date'),
              plannedFetched: true})
            getAllOngoingOperations().then(data => {
              dispatch({
                type: 'setOperations',
                ongoing: _.sortBy(Object.values(data), 'planned_date'),
                ongoingFetched: true
              })
              setLoadingModal(false);
              setShow(false);
              dispatch({type: 'setErrors', errors: ''})
              addToast(
                <p>
                  <label className='pr-1'>We got you the latest changes, update your operations now!</label>
                </p>
              );
            })
          })
        }else {
          const newList = plannedOperations.map((item) => {
            if (item.id === id) {
              return res.data;
            }
            return item;
          });
          dispatch({type: 'setOperations', planned: newList})
          setLoadingModal(false);
          setShow(false);
          dispatch({type: 'setErrors', errors: ''})
        }
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  //DELETE OPERATION FUNCTIONS

  //open popUp for delete
  const handleDelete = (current) => {
    addSelectedStyle(current.id);
    setPopup({
      show: true,
      id:current.id,
      text:current.name
    });
  };

  //delete operation with selected id and close popUp
  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      const newItems = (plannedOperations.filter(item => item.id !== popup.id));
      dispatch({type: 'setOperations',planned:newItems})
      deleteOperation(popup.id);
      setPopup({
        show: false,
        id: null,
        text: ''
      });
    }
  };

  //close popUp
  const handleDeleteFalse = () => {
    removeSelectedStyle(popup.id);
    setPopup({
      show: false,
      id: null,
      text:''
    });
  };

  //change state of input fields
  const changeState = (e) => {
    var { name, value} = e.target;
    errorState.errors[name] &&  dispatch({type: 'removeErrors', errors:{[name]:['']}})
    setCurrent({
      ...current,
      [name]: value
    });
  }

  //change state of id and parse integer
  const changeOperationId = (e) => {
    var { name, value} = e.target;
    errorState.errors[name] && dispatch({type: 'removeErrors', errors:{[name]:''}})
    value=parseInt(value)
    setCurrent({
      ...current,
      [name]:value
    });
  }
  const changeStateSelect = (e) => {

    errorState.errors[e.name] && dispatch({type: 'removeErrors', errors:{[e.name]:''}})
    setCurrent({
      ...current,
      [e.name]:parseInt(e.value)
    });

  }

  //OPERATION ACTIONS

  //remove operation from planned and add it to ongoing, update state in db
  const startOperation = (id) => {
    var operation = plannedOperations.filter(item => item.id === id)
    var currentOperation = operation[0];
    setLoadingId(id);
    setLoadingRequest(true);
    currentOperation.status = 'started';
    updateOperation(currentOperation,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllPlannedOperations().then(data => {
            dispatch({
              type: 'setOperations',
              planned: _.sortBy(Object.values(data), 'planned_date'),
              plannedFetched: true
            })
            getAllOngoingOperations().then(data => {
              dispatch({
                type: 'setOperations',
                ongoing: _.sortBy(Object.values(data), 'planned_date'),
                ongoingFetched: true
              })
              getAllFinishedOperations().then(data => {
                dispatch({
                  type: 'setOperations',
                  finished: _.sortBy(Object.values(data), 'planned_date'),
                  finishedFetched: true
                })
                setLoadingModal(false);
                setShow(false);
                dispatch({type: 'setErrors', errors: ''})
                addToast(
                  <p>
                    <label className='pr-1'>We got you the latest changes, update your operations now!</label>
                  </p>
                );
              })
            })
          })
        }else {
          dispatch({type: 'setErrors', errors: ''})
          const newList = plannedOperations.filter((item) => item.id !== id);
          dispatch({type: 'setOperations', planned: newList})
          const newOngoing = ongoingOperations.concat([res.data]);
          dispatch({type: 'setOperations', ongoing: newOngoing})
          setLoadingRequest(false);
        }
      }else {
        dispatch({type: 'setErrors', errors:res});
        setLoadingRequest(false);
      }
    })
  }

  //remove operation from planned and add it to canceled, update state in db
  const cancelOperation = (id) => {
    var operation = plannedOperations.filter(item => item.id === id)
    var currentOperation = operation[0];
    currentOperation.status = 'canceled';
    setLoadingId(id);
    setLoadingRequest(true);
    updateOperation(currentOperation,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllPlannedOperations().then(data => {
            dispatch({
              type: 'setOperations',
              planned: _.sortBy(Object.values(data), 'planned_date'),
              plannedFetched: true
            })
            getAllOngoingOperations().then(data => {
              dispatch({
                type: 'setOperations',
                ongoing: _.sortBy(Object.values(data), 'planned_date'),
                ongoingFetched: true
              })
              getAllFinishedOperations().then(data => {
                dispatch({
                  type: 'setOperations',
                  finished: _.sortBy(Object.values(data), 'planned_date'),
                  finishedFetched: true
                })
                setLoadingModal(false);
                setShow(false);
                dispatch({type: 'setErrors', errors: ''})
                addToast(
                  <p>
                    <label className='pr-1'>We got you the latest changes, update your operations now!</label>
                  </p>
                );
              })
            })
          })
        }else {
          const newList = plannedOperations.filter((item) => item.id !== id);
          dispatch({type: 'setOperations', planned: newList})
          dispatch({type: 'setErrors', errors: ''})
          setLoadingRequest(false);
        }
      }else {
        dispatch({type: 'setErrors', errors:res});
        setLoadingRequest(false);
      }
    })
  }

  const handleDayChange = (day,name) => {
    setCurrent({
      ...current,
      [name]:moment(day).format("YYYY-MM-DD"),
    });
  }

  return(
    <>
      <CRow>
        <CCol>
          <div>
            <div className='d-flex justify-content-between my-3 float-right'>
                <SecondaryButton
                  onClick={()=> setShowTemplate(true)}
                  id='addFromTemplates' icon={<SelectIcon/>}>
                   {t('select.from_templates')}
                </SecondaryButton>
                <PrimaryButton
                  onClick={createModal} id='addPlannedOperation' icon={<AddIcon/>}>
                    {t('operation.add')}
                </PrimaryButton>
            </div>
            <div>
                <BeezDataTable
                  items={plannedOperations}
                  fields={fields}
                  fetched={ongoingFetched && apiariesFetched && beehivesFetched && plansFetched && plannedFetched && templatesFetched}
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
                              onClick={() => startOperation(item.id)}
                              title='Start operation' icon={<StartIcon/>}
                            >
                            </IconButton>
                            <IconButton
                              disabled={item.status!=='started'}
                              onClick={() => console.log(item.id)}
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
                        )
                          :(
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
                            <DetailButton title='Detailed view' icon={<DetailedIcon/>}>
                            </DetailButton>
                          </a>
                          <UpdateButton
                            onClick={() => showModal(item.id)} title='Update' icon={<UpdateIcon/>}>
                          </UpdateButton>
                          <DeleteButton
                            onClick={() => handleDelete(item)} title='Delete' icon={<DeleteIcon/>}>
                          </DeleteButton>
                        </td>
                      )
                  }}
                />
            </div>
          </div>
        </CCol>
      </CRow>

      <ModalComponent
        show={show}
        onHide={() => {
          setShow(false);
          resetFormCreate();
        }}
        title={current.id ? t('operation.update') : t('operation.create')}
        icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/>)}
        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {
                current.id && removeSelectedStyle(current.id);
                setShow(false);
                resetFormCreate();}} >
              {t('user.cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=>{
                current.id ? resetForm(current.id) : resetFormCreate()}}>
                {t('user.reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {
                current.id ? changeOperation(current.id) : createOperation()}}>
              {t('plan.model_submit')}
            </OrangeButton>
          </>
        }
      >
        <CCardBody>
          <CTabs activeTab={active} onActiveTabChange={idx => {setActive(idx) }}>
            <div className="d-flex justify-content-center border-bottom 1px solid grey">
            <CNav>
              {active === 0 ?
                <PrimaryTab icon={<TemplateIcon/>}> {t('operation.general')} </PrimaryTab>
                :
                <GreyPrimaryTab icon={<OperationsTemplateIcon/>}> {t('operation.general')} </GreyPrimaryTab>
              }
              {active === 1 ?
                <OrangeSecondaryTab icon={<TemplateIcon/>}> {t('operation.plan')} </OrangeSecondaryTab>
                :
                <SecondaryTab icon={<OperationsTemplateIcon/>}> {t('operation.plan')} </SecondaryTab>
              }
            </CNav>
            </div>
            <CTabContent>
              <CTabPane className='mt-3'>
                <CFormGroup row>
                  <CCol md='3'>
                    <PrimaryLabel htmlFor='name'>{t('operation.name')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='12' md='12'>
                    <PrimaryInput
                      id='name'
                      name='name'
                      placeholder='Name'
                      value={current.name !== null ? current.name : ''}
                      onChange={(e) => changeState(e)}
                    />
                    {errorState.errors['name']?<CFormText className="help-block">{errorState.errors['name'][0]}</CFormText>:null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='3'>
                    <PrimaryLabel htmlFor='description'>
                      {t('operation.description')}
                    </PrimaryLabel>
                  </CCol>
                  <CCol xs='12' md='12'>
                    <PrimaryTextarea
                      id='description'
                      name='description'
                      rows='10'
                      placeholder={t('plan.description')}
                      value={current.description !== null ? current.description : ''}
                      onChange={(e) => changeState(e)}
                    />
                    {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='6'>
                    <PrimaryLabel htmlFor='apiary_id'>{t('sidebar.apiaries')}</PrimaryLabel>
                  </CCol>
                  <CCol md='6'>
                    <PrimaryLabel htmlFor='beehive_id'>{t('sidebar.beehives')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='6' md='6'>
                      <PrimarySelect
                        classNamePrefix='styles'
                        name="apiary_id"
                        id="apiary_id"
                        value = {_.find(selectApiaries, ['value', current.apiary_id])}
                        onChange={(e) => changeStateSelect(e)}
                        options={selectApiaries}
                      />

                    {errorState.errors['apiary_id']?<CFormText className="help-block">{errorState.errors['apiary_id'][0]}</CFormText>:null}
                  </CCol>
                  <CCol xs='6' md='6'>
                    <PrimarySelect
                      classNamePrefix='styles'
                      name="beehive_id"
                      id="beehive_id"
                      value = {_.find(selectBeehives, ['value', current.beehive_id])}
                      onChange={(e) => changeStateSelect(e)}
                      options={selectBeehives}
                    />
                    {errorState.errors['beehive_id']?<CFormText className="help-block">{errorState.errors['beehive_id'][0]}</CFormText>:null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="12">
                    <PrimaryLabel>{t('operation.type')}</PrimaryLabel>
                  </CCol>
                  <CCol md="1">
                     <CTabs activeTab={activeType} onActiveTabChange={idx => {setActiveType(idx) }}>
                     <CNav>
                     <div className="d-flex justify-content-left">

                      {activeType === 0 ? <OrangeLeftTab id="harvest" name="type" value="harvest"  onClick={(e) => setCurrent({...current, ['type']:'harvest'})}> {t('operation.harvest')} </OrangeLeftTab>
                        :
                        <GreyLeftTab id="harvest" name="type" value="harvest" onClick={(e) => setCurrent({...current, ['type']:'harvest'})}> {t('operation.harvest')} </GreyLeftTab>
                      }
                      {activeType === 1 ? <OrangeNoRadiusTab id="interventions" name="type" value="interventions" onClick={(e) =>setCurrent({...current, ['type']:'interventions'})}> {t('operation.interventions')} </OrangeNoRadiusTab>
                         :
                        <GreyNoRadiusTab id="interventions" name="type" value="interventions" onClick={(e) => setCurrent({...current, ['type']:'interventions'})}> {t('operation.interventions')} </GreyNoRadiusTab>
                      }
                      {activeType === 2 ? <OrangeNoRadiusTab id="analysis" name="type" value="analysis" onClick={(e) =>setCurrent({...current, ['type']:'analysis'})}> {t('operation.analysis')} </OrangeNoRadiusTab>
                        :
                        <GreyNoRadiusTab id="analysis" name="type" value="analysis" onClick={(e) =>setCurrent({...current, ['type']:'analysis'})}> {t('operation.analysis')} </GreyNoRadiusTab>
                      }
                      {activeType === 3 ? <OrangeRightTab id="custom" name="type" value="custom" onClick={(e) => setCurrent({...current, ['type']:'custom'})}> {t('operation.custom')} </OrangeRightTab>
                        :
                        <GreyRightTab id="custom" name="type" value="custom"  onClick={(e) => setCurrent({...current, ['type']:'custom'})}> {t('operation.custom')} </GreyRightTab>
                      }
                      </div>
                      </CNav>
                      </CTabs>
                    {errorState.errors['type']?<CFormText className="help-block">{errorState.errors['type'][0]}</CFormText>:null}
                  </CCol>
                </CFormGroup>
              </CTabPane>
              {activeType === 0 && active ===0 &&
              <>
                <CFormGroup row>
                  <CCol md='4'>
                    <PrimaryLabel htmlFor='harvest_honey'>{t('operation.harvest_honey')}</PrimaryLabel>
                  </CCol>
                  <CCol md='4'>
                    <PrimaryLabel htmlFor='harvest_weight'>{t('operation.harvest_weight')}</PrimaryLabel>
                  </CCol>
                  <CCol md='4'>
                    <PrimaryLabel htmlFor='harvest_weight'>{t('operation.harvest_batch')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='4' md='4'>
                    <PrimaryInput
                      id='harvest_honey'
                      name='harvest_honey'
                      readOnly = {activeType!==0}
                      value={current.harvest_honey !== null ? current.harvest_honey : ''}
                      onChange={(e) => changeState(e)}
                    />
                    {errorState.errors['harvest_honey']?<CFormText className="help-block">{errorState.errors['harvest_honey'][0]}</CFormText>:null}
                  </CCol>
                  <CCol xs='4' md='4'>
                    <PrimaryInput
                      id='harvest_weight'
                      name='harvest_weight'
                      readOnly = {activeType!==1}
                      value={current.harvest_weight !== null ? current.harvest_weight : ''}
                      onChange={(e) => changeState(e)}
                    />
                    {errorState.errors['harvest_weight']?<CFormText className="help-block">{errorState.errors['harvest_weight'][0]}</CFormText>:null}
                  </CCol>
                  <CCol xs='4' md='4'>
                    <PrimaryInput
                      id='harvest_batch_id'
                      name='harvest_batch_id'
                      readOnly = {activeType!==1}
                      value={current.harvest_batch_id !== null ? current.harvest_batch_id : ''}
                      onChange={(e) => changeState(e)}
                    />
                    {errorState.errors['harvest_batch_id']?<CFormText className="help-block">{errorState.errors['harvest_batch_id'][0]}</CFormText>:null}
                  </CCol>
                </CFormGroup>
              </>
              }
              <CTabPane className='mt-3'>
                {active === 1 && (
                  <>
                    <CFormGroup row>
                      <CCol md='12'>
                        <PrimaryLabel htmlFor='name'>{t('plan.title')}</PrimaryLabel>
                      </CCol>
                      <CCol xs='12' md='12'>
                        <PrimaryInput
                          id='name'
                          name='name'
                          placeholder='Name'
                          value={current.name !== null ? current.name : ''}
                          onChange={(e) => changeState(e)}
                        />
                        {errorState.errors['name']?<CFormText className="help-block">{errorState.errors['name'][0]}</CFormText>:null}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md='12'>
                        <PrimaryLabel htmlFor='planning_comments'>{t('plan.comments')}</PrimaryLabel>
                      </CCol>
                      <CCol xs='12' md='12'>
                        <PrimaryTextarea
                          id='planning_comments'
                          name='planning_comments'
                          rows='10'
                          placeholder='Planning comments'
                          value={current.planning_comments !== null ? current.planning_comments : ''}
                          onChange={(e) => changeState(e)}
                        />
                        {errorState.errors['planning_comments']?<CFormText className="help-block">{errorState.errors['planning_comments'][0]}</CFormText>:null}
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md='6'>
                        <PrimaryLabel htmlFor='plan_id'>{t('operation.in_plan')}</PrimaryLabel>
                      </CCol>
                      <CCol md="6">
                        <PrimaryLabel htmlFor="planned_date">{t('operation.planned')}</PrimaryLabel>
                      </CCol>
                      <CCol xs='6' md='6'>
                        <PrimarySelect
                          classNamePrefix='styles'
                          name="plan_id"
                          id="plan_id"
                          value = {_.find(selectPlans, ['value', current.plan_id])}
                          onChange={(e) => changeStateSelect(e)}
                          options={selectPlans}
                        />
                        {errorState.errors['plan_id']?<CFormText className="help-block">{errorState.errors['plan_id'][0]}</CFormText>:null}
                      </CCol>
                      <CCol xs="6" md="6">
                        <DateInput
                                id="planned_date"
                                name="planned_date"
                                value={current.planned_date}
                                onChange={(e) => handleDayChange(e,'planned_date')}
                        />
                        {errorState.errors['planned_date']?<CFormText className="help-block">{errorState.errors['planned_date'][0]}</CFormText>:null}
                      </CCol>
                    </CFormGroup>
                  </>
                )}
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </ModalComponent>

      <ModalComponent
        show={showTemplate}
        onHide={() => {
          setShowTemplate(false);
        }}
        loading={false}
        actions={
          <>
            <GreyButton onClick={() => {setShowTemplate(false);}} >
              {t('user.cancel')}
            </GreyButton>
          </>
        }
        title={t('select.template')}
        icon={<SelectTemplateIcon/>}
      >

        <CCardBody>
          <CRow>
            {templates.map((x, i) =>
              <div className='col-xl-6' key={i} onClick={()=>{setCurrent({ id: '', name: x.name,description: x.description, type: x.type, in_plan: x.in_plan, apiary_id: x.apiary_id, beehive_id: x.beehive_id }); setShowTemplate(false); setShow(true);}}>
                <SelectOperationTemplateCard x={x}/>
              </div>
            )}
          </CRow>
        </CCardBody>
      </ModalComponent>

      <DeleteModal
        type={t('type.operation')}
        text={popup.text}
        handleDeleteTrue={handleDeleteTrue}
        handleDeleteFalse={handleDeleteFalse}
        show={popup.show}
      />

      <NotifyToaster toasts={toasts} header='You had changes in your operations'/>
    </>
  )
}

export default PlannedOperations
