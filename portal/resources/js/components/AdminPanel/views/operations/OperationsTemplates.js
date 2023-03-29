import React, {useState, useEffect} from 'react'
import {
  CCardBody,
  CCol,
  CFormGroup,
  CFormText,
  CNav,
  CRow, CTabs,
}
  from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {useDispatch, useSelector} from "react-redux";
import ModalComponent from "../../../Modal";
import {useTranslation} from "react-i18next";
import {
  addOperation,
  deleteOperation, getAllPlannedOperations,
  getTemplates, initializeOperation,
  updateOperation
} from "../../../../endpoints/OperationFunctions";
import DeleteModal from "../../../DeleteModal";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import {getAllPlans, getAllPlanTemplates} from "../../../../endpoints/PlanFunctions";
import NotifyToaster from "../../../NotifyToaster";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import {
  DeleteButton,
  DetailButton, GreyButton,
  InitializeButton, OrangeButton,
  PrimaryButton,
  UpdateButton
} from "../../../buttons/Buttons";

import * as PropTypes from "prop-types";
import PrimaryInput, {PrimaryLabel, PrimaryTextarea} from "../../../inputs/Inputs";
import PrimarySelect from "../../../select/Select";
import {
  GreyLeftTab,
  GreyNoRadiusTab,
  GreyRightTab,
  OrangeLeftTab,
  OrangeNoRadiusTab,
  OrangeRightTab
} from "../../../tabs/Tabs";
import {
  AddIcon,
  DeleteIcon,
  DetailedIcon,
  InitializeBigIcon,
  InitializeIcon,
  UpdateIcon
} from "../../assets/icons/icons";

function BeezReset(props) {
  return null;
}

BeezReset.propTypes = {
  onClick: PropTypes.func,
  buttonStyle: PropTypes.string,
  children: PropTypes.node
};
const OperationsTemplates = () => {
  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.userLogged);
  const errorState = useSelector(state => state.errorState);
  const [activeType, setActiveType] = useState(0);
  const [show,setShow] = useState(false);
  const [showInit,setShowInit] = useState(false);
  const [loadingModal,setLoadingModal] = useState(false);
  const templates = useSelector(state => state.operationState.templates)
  const templatesFetched = useSelector(state => state.operationState.templatesFetched)
  const plansTemplates = useSelector(state => state.planState.plansTemplates)
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const plansTemplatesFetched = useSelector(state => state.planState.plansTemplatesFetched)
  const apiariesFetched = useSelector(state => state.apiaryState.fetched)
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const plannedOperations = useSelector(state => state.operationState.planned)
  const plannedFetched = useSelector(state => state.operationState.plannedFetched)
  const plans = useSelector(state => state.planState.plans)
  const plansFetched = useSelector(state => state.planState.fetched)
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
  const [selectPlansTemplates,setSelectPlansTemplates] = useState([]);

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
    nullValue.label = 'No plan';
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

  const plansTemplatesOptions = (plansTemplates) => {
    let data = []

    let nullValue = {};
    nullValue.value = null;
    nullValue.label = 'No plan';
    nullValue.name = 'plan_id';
    data.push(nullValue)

    plansTemplates.map(item => {
        let plansTemplate = {};
        plansTemplate.value = item.id;
        plansTemplate.label = item.title;
        plansTemplate.name = 'plan_id';
        data.push(plansTemplate);
      }
    )

    setSelectPlansTemplates(data);
  }

  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }

  //DataTable fields
  const fields = [
    { key: 'name', label: t('operation.name') },
    { key: 'description', label: t('operation.description') },
    { key: 'type', label: t('operation.type'),},
    { key: 'plan_id', label: t('operation.in_plan'),},
    { key: 'beehive_id', label: t('operation.beehives'),},
    { key: 'apiary_id', label: t('operation.apiaries'),},
    { key: 'actions', label: t('plan.actions'),_style: { width: '15%' },sorter: false ,filter: false},
    { key: 'initialize', label: t('template.initialize'),_style: { width: '5%' },sorter: false ,filter: false},
  ]

  const addSelectedStyle = id => {
    const newList = templates.map((item) => {
      if (item.id === id) {
        item._classes = 'bg-warning'
        return item;
      }
      return item;
    });
    dispatch({type: 'setOperations',templates:newList})
  }

  //remove Selected Style
  const removeSelectedStyle = id => {
    const newList = templates.map((item) => {
      if (item.id === id) {
        item._classes = ''
        return item;
      }
      return item;
    });
    dispatch({type: 'setOperations',templates:newList})
  }
  useEffect(() => {
    //if templates are not fetched fetch them and store in redux templates
    if (!plansTemplatesFetched) {
      getAllPlanTemplates().then(data => {
        dispatch({type: 'setPlans', plansTemplates: Object.values(data), plansTemplatesFetched: true})
        plansTemplatesOptions(Object.values(data))
      })
    }else{
      plansTemplatesOptions(plansTemplates)
    }

    if (!templatesFetched) {
      getTemplates().then(data => {
        dispatch({type: 'setOperations',templates:Object.values(data), templatesFetched:true})
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

    //if beehives are not fetched fetch them and store in redux beehives
    if (!beehivesFetched) {
      getBeehives(loggedUser.id).then(data => {
        dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
        beehivesOptions(Object.values(data))
      })
    }else{
      beehivesOptions(beehives)
    }

    //if planned operations are not fetched fetch them and store in redux planned
    if (!plannedFetched){
      getAllPlannedOperations().then(data => {
        dispatch({type: 'setOperations', planned: _.sortBy(Object.values(data), 'planned_date'), plannedFetched: true})
      })
    }

    if (!plansFetched) {
      getAllPlans().then(data => {
        dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
        plansOptions(Object.values(data))
      })
    }else{
      plansOptions(plans)
    }

  },[])

  //CREATE TEMPLATE FUNCTIONS

  //open modal for creating new template
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

  //reset modal when creating template
  const resetFormCreate = (id) => {
    setCurrent({
      id: '',
      name: '',
      description: '',
      status: '',
      planning_comments: '',
      planned_date: '',
      executed_date: '',
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

  //adding new template operation, if true add operation to template operation store, if not show errors
  const createOperation = () => {
    setLoadingModal(true);
    var currentOperation = {...current};
    currentOperation.user_id = loggedUser.id;
    currentOperation.template = true;
    setCurrent(currentOperation);
    addOperation(currentOperation).then(res => {
      if(res.data){
        const newList = templates.concat([res.data]);
        dispatch({type: 'setOperations',templates:newList})
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

  //open modal for editing template
  const showModal = id => {
    addSelectedStyle(id)
    setShow(true);
    var operation = templates.filter(item => item.id === id)
    setCurrent({
      ...operation[0],
    });
  }

  //reset form when editing template, initial state without changes
  const resetForm = (id) => {
    var operation = templates.filter(item => item.id === id)
    setCurrent(operation[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //update template, if successful add template to store.
  //if not show errors for missing fields
  const changeOperation = id => {
    setLoadingModal(true);
    updateOperation(current,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getTemplates().then(data => {
            dispatch({type: 'setOperations',templates:Object.values(data), templatesFetched:true})
            setLoadingModal(false);
            setShow(false);
            dispatch({type: 'setErrors', errors: ''})
            addToast(
              <p>
                <label className='pr-1'>We got you the latest changes, update your template now!</label>
              </p>
            );
          })
        }else{
          const newList = templates.map((item) => {
            if (item.id === id) {
              return res.data;
            }
            return item;
          });
          dispatch({type: 'setOperations', templates: newList})
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
      const newItems = (templates.filter(item => item.id !== popup.id));
      dispatch({type: 'setOperations',templates:newItems})
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
    setCurrent({
      ...current,
      [name]:value
    });
  }

  //change state of id and parse integer
  const changeOperationId = (e) => {
    var { name, value} = e.target;
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

  //initialize operation
  const showInitOperation = (id) => {
    setShowInit(true);
    var operation = templates.filter(item => item.id === id)
    setCurrent({
      ...operation[0],
    });
  }
  const initOperation = (id) => {
    setLoadingModal(true);
    initializeOperation(current).then(res => {
      if(res.data){
        const newList = plannedOperations.concat([res.data]);
        dispatch({type: 'setOperations', planned: _.sortBy(newList, 'planned_date')})
        setLoadingModal(false);
        setShowInit(false);
        dispatch({type: 'setErrors', errors:''})
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  return(
    <>
      <CRow>
        <CCol>
          <div>
            <div className="d-flex justify-content-between my-3 float-right">
              <div>
                <PrimaryButton
                  id={'addOperationTemplate'}
                onClick={createModal}
                icon= {<AddIcon/>}
                >
                  {t('operation_template.add')}
                </PrimaryButton>
              </div>
            </div>
            <div>
              <BeezDataTable
                items={templates}
                fields={fields}
                fetched={templatesFetched && apiariesFetched && beehivesFetched && plansTemplatesFetched && plansFetched && plannedFetched}
                scopedSlots={{
                  'name':
                    (item)=> (
                      <td>
                        {item.name?item.name:''}
                      </td>
                    ),
                  'description':
                    (item)=> (
                      <td>
                       {item.description?item.description:''}
                      </td>
                    ),
                  'type':
                    (item)=> (
                      <td>
                        {item.type?item.type:''}
                      </td>
                    ),
                  'plan_id':
                    (item)=> (
                      <td>
                        {plansTemplates.find(plan => plan.id === item.plan_id)?plansTemplates.find(plan => plan.id === item.plan_id).title : 'No plan'}
                      </td>
                    ),
                  'apiary_id':
                    (item)=> (
                      <td>
                        {apiaries.find(apiary => apiary.id === item.apiary_id)?apiaries.find(apiary => apiary.id === item.apiary_id).name : ''}
                      </td>
                    ),
                  'beehive_id':
                    (item)=> (
                      <td>
                        {beehives.find(beehive => beehive.id === item.beehive_id)?beehives.find(beehive => beehive.id === item.beehive_id).name : ''}
                      </td>
                    ),
                  'actions':
                    (item) => (
                      <td>
                        <a href={`#/templates/operation/${item.id}`}>
                          <DetailButton
                            title='Detailed view' icon={<DetailedIcon/>}>
                          </DetailButton>
                          </a>
                        <UpdateButton
                          onClick={() => showModal(item.id)}
                          title='Update' icon={<UpdateIcon/>}>
                        </UpdateButton>
                        <DeleteButton
                          onClick={() => handleDelete(item)}
                          title='Delete' icon={<DeleteIcon/>}>
                        </DeleteButton>
                      </td>
                    ),
                  'initialize': (item) => (
                    <td>
                      <InitializeButton
                        onClick={() => {showInitOperation(item.id)}}
                        title='Initialize' icon={<InitializeIcon/>}>
                      </InitializeButton>
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
        title={current.id ? t('template.model_update_title') : t('template.model_create_title')}
        icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/>)}
        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {
                current.id && removeSelectedStyle(current.id);
                setShow(false);
                resetFormCreate();
              }} >
              {t('user.cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}} >
                {t('user.reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {current.id ? changeOperation(current.id) : createOperation()}} >
              {t('plan.model_submit')}
            </OrangeButton>
          </>
        }
      >
        <CCardBody>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='name'>{t('operation.name')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryInput
                id='name'
                name='name'
                value={current.name !== null ? current.name : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['name']?<CFormText className="help-block">{errorState.errors['name'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='description'>{t('operation.description')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryTextarea
                id='description'
                name='description'
                rows='10'
                value={current.description !== null ? current.description : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='4'>
              <PrimaryLabel htmlFor='apiary_id'>{t('sidebar.apiaries')}</PrimaryLabel>
            </CCol>
            <CCol md='4'>
              <PrimaryLabel htmlFor='beehive_id'>{t('sidebar.beehives')}</PrimaryLabel>
            </CCol>
            <CCol md='4'>
              <PrimaryLabel htmlFor='plan_id'>{t('operation.in_plan')}</PrimaryLabel>
            </CCol>
            <CCol xs='4' md='4'>
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
            <CCol xs='4' md='4'>
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
            <CCol xs='4' md='4'>
              <PrimarySelect
                classNamePrefix='styles'
                styles={{
                  menu: provided => ({ ...provided, zIndex: 9999 }),
                }}
                name="plan_id"
                id="plan_id"
                value = {_.find(selectPlansTemplates, ['value', current.plan_id])}
                onChange={(e) => changeStateSelect(e)}
                options={selectPlansTemplates}
              />
              {errorState.errors['plan_id']?<CFormText className="help-block">{errorState.errors['plan_id'][0]}</CFormText>:null}
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
          {activeType === 0 &&
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
        </CCardBody>
      </ModalComponent>

      <ModalComponent
        show={showInit}
        onHide={() => {
          setShowInit(false);
          resetFormCreate();
        }}
        title= {t('operation.initialize')}
        icon= {<InitializeBigIcon/>}
        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {setShowInit(false); resetFormCreate();}} >
              {t('user.cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=> {resetForm(current.id)}} >
                {t('user.reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {initOperation(current.id) }} > {t('plan.model_submit')}
            </OrangeButton>
          </>
        }
      >
        <CCardBody>
          <CFormGroup row>
            <CCol md='3'>
              <PrimaryLabel htmlFor='name'>{t('operation.name')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='9'>
              <PrimaryInput
                id='name'
                name='name'
                value={current.name !== null ? current.name : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['name']?<CFormText className="help-block">{errorState.errors['name'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='3'>
              <PrimaryLabel htmlFor='description'>{t('operation.description')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='9'>
              <PrimaryTextarea
                id='description'
                name='description'
                rows='10'
                value={current.description !== null ? current.description : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='3'>
              <PrimaryLabel htmlFor='apiary_id'>{t('sidebar.apiaries')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='9'>
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
          </CFormGroup>
          <CFormGroup row>
            <CCol md='3'>
              <PrimaryLabel htmlFor='beehive_id'>{t('sidebar.beehives')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='9'>
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
            <CCol md='3'>
              <PrimaryLabel htmlFor='plan_id'>{t('operation.in_plan')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='9'>
              <PrimarySelect
                classNamePrefix='styles'
                name="plan_id"
                id="plan_id"
                value = {_.find(selectPlans, ['value', null])}
                onChange={(e) => changeStateSelect(e)}
                options={selectPlans}
              />
              {errorState.errors['plan_id']?<CFormText className="help-block">{errorState.errors['plan_id'][0]}</CFormText>:null}
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
          {activeType === 0 &&
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
        </CCardBody>
      </ModalComponent>

      <DeleteModal
        type={t('type.operation')}
        text={popup.text}
        handleDeleteTrue={handleDeleteTrue}
        handleDeleteFalse={handleDeleteFalse}
        show={popup.show}
      />

      <NotifyToaster toasts={toasts} header='You had changes in your templates'/>
    </>
  )
}
export default OperationsTemplates
