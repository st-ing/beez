import React, {useState, useEffect} from 'react'
import {
  CCardBody,
  CCol,
  CFormGroup,
  CFormText,
  CRow,
}
  from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {freeSet} from "@coreui/icons";
import {Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {
  addPlan,
  updatePlan,
  deletePlan,
  getAllPlanTemplates,
  initializePlan, getPlanOperation
} from "../../../../endpoints/PlanFunctions";
import ModalComponent from "../../../Modal";
import {useTranslation} from "react-i18next";
import DeleteModal from "../../../DeleteModal";
import NotifyToaster from "../../../NotifyToaster";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import 'react-dropdown-tree-select/dist/styles.css'
import DropdownContainer from "../../../DropdownContainer/DropdownContainer";
import './index.css'
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import {
  DeleteButton,
  DetailButton, GreyButton,
  InitializeButton, OrangeButton,
  PrimaryButton,
  UpdateButton
} from "../../../buttons/Buttons";
import PrimaryInput, {DateInput, PrimaryLabel, PrimaryTextarea} from "../../../inputs/Inputs";
import {
  AddIcon,
  DeleteIcon,
  DetailedIcon,
  InitializeBigIcon,
  InitializeIcon, SelectTemplateIcon,
  UpdateIcon
} from "../../assets/icons/icons";
import dateFnsFormat from "date-fns/format";
import moment from "moment";

const PlansTemplates = () => {
  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.userLogged)
  const errorState = useSelector(state => state.errorState);
  const plans = useSelector(state => state.planState.plans)
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const apiariesFetched = useSelector(state => state.apiaryState.fetched)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const plannedOperations = useSelector(state => state.operationState.planned)
  const plansTemplates = useSelector(state => state.planState.plansTemplates)
  const plansTemplatesFetched = useSelector(state => state.planState.plansTemplatesFetched)
  const [toasts, setToasts] = useState([])

  const [show,setShow] = useState(false);
  const [showTemplate,setShowTemplate] = useState(false);
  const [showOperation,setShowOperation] = useState(false);

  const [loadingModal,setLoadingModal] = useState(false);
  const [loadingOperations,setLoadingOperations] = useState(true);
  const [data,setData] = useState([]);
  const [planOperations,setPLanOperations] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    id: null,
  });
  const [current,setCurrent] = useState({
    id: '',
    title: '',
    description: '',
    start_date: '',
    stop_date: '',
    user_id: '',
    apiary:false,
    operations:[],
  });
  const [currentOperation,setCurrentOperation]=useState({id:null,})

  const fieldsOperations = [
    { key: 'name', label: t('operation.name') },
    { key: 'description', label: t('operation.description') },
    { key: 'type', label: t('operation.type')},
    { key: 'actions', label: t('operation.details'),_style: {width:'5%'}},
  ]

  //DataTable fields
  const fields = [
    { key: 'title', label: t('plan.title') },
    { key: 'description', label: t('plan.description') },
    { key: 'start_date', label: t('plan.start_date') },
    { key: 'stop_date', label: t('plan.stop_date'),},
    { key: 'actions', label: t('plan.actions'),_style: { width: '15%' },sorter: false ,filter: false},
    { key: 'initialize', label: t('template.initialize'),_style: { width: '5%' },sorter: false ,filter: false},
  ]

  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }
  const addSelectedStyle = id => {
    const newList = plansTemplates.map((item) => {
      if (item.id === id) {
        item._classes = 'bg-warning'
        return item;
      }
      return item;
    });
    dispatch({type: 'setPlans', plansTemplates: newList})
  }

  //remove Selected Style
  const removeSelectedStyle = id => {
    const newList = plansTemplates.map((item) => {
      if (item.id === id) {
        item._classes = ''
        return item;
      }
      return item;
    });
    dispatch({type: 'setPlans', plansTemplates: newList})
  }

  useEffect(() => {

    const promise1 = returnBeehives();
    const promise2 = returnApiaries();
    const promise3 = returnPlansTemplates();

    Promise.all([promise1, promise2, promise3]).then((values) => {
      dispatch({type: 'setApiaries', apiaries: Object.values(values[1]), fetched: true})
      dispatch({type:'setBeehives', beehives:Object.values(values[0]), fetched: true})
      dispatch({type: 'setPlans', plansTemplates: Object.values(values[2]), plansTemplatesFetched: true})

      values[1].map((apiary) => {
        let apiaryData = {label: apiary.name, value: apiary.id, children: [], className:'flag apiary', tagClassName: 'flag apiary'}
        values[0].map((beehive) => {
          if (beehive.apiary_id === apiary.id) {
            let nodeData = {label: beehive.name, value: beehive.id, className: 'flag beehive', tagClassName:'flag beehive'}
            apiaryData.children.push(nodeData);
          }
        })
        data.push(apiaryData);
        setData(data)
      })

    })
  }, [])

  const returnApiaries = () => {
    if (!apiariesFetched) {
      return getApiaries(loggedUser.id);
    }
    {
      return apiaries;
    }
  }

  const returnBeehives = () => {
    if (!beehivesFetched) {
      return getBeehives(loggedUser.id);
    }
    {
      return beehives;
    }
  }

  const returnPlansTemplates = () => {
    if (!plansTemplatesFetched) {
      return getAllPlanTemplates();
    }
    {
      return plansTemplates;
    }
  }

  //CREATE PLAN FUNCTIONS


  //create blank modal for plans
  const createModal = () => {
    setCurrent({
      id: '',
      title: '',
      description: '',
      start_date: '',
      stop_date: '',
      user_id: '',
      apiary:false,
      operations:[],
    });
    setShow(true);
  }

  //reset modal when creating plan
  const resetFormCreate = (id) => {
    setCurrent({
      id: '',
      title: '',
      description: '',
      start_date: `${dateFnsFormat(new Date(),"yyyy-MM-dd" )}`,
      stop_date: `${dateFnsFormat(new Date(),"yyyy-MM-dd" )}`,
      user_id: '',
      apiary:false,
      operations:[],
    });
    dispatch({type: 'setErrors', errors:''})
  }

  //adding new plan, if true add plan to redux state, if not show errors
  const createPlan = () => {
    setLoadingModal(true);
    var currentApiary = {...current};
    currentApiary.user_id = loggedUser.id;
    currentApiary.template = true;
    setCurrent(currentApiary);
    addPlan(currentApiary).then(res => {
      if(res.data){
        const newList = plansTemplates.concat([res.data]);
        dispatch({type: 'setPlans',plansTemplates:newList})
        setLoadingModal(false);
        setShow(false);
        dispatch({type: 'setErrors', errors:''})
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }


  //EDIT PLAN FUNCTIONS


  //open modal for editing plan
  const showModal = id => {
    addSelectedStyle(id)
    setShow(true);
    var plan = plansTemplates.filter(item => item.id === id)
    setCurrent({
      ...plan[0],
      apiary: false,
      operations:[],
    });
  }

  //reset form when editing plan, initial state without changes
  const resetForm = (id) => {
    var plan = plansTemplates.filter(item => item.id === id)
    setCurrent(plan[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //update plan, if successful add plan to operation store.
  //if not show errors for missing fields
  const changePlan = id => {
    setLoadingModal(true);
    updatePlan(current,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllPlanTemplates().then(data => {
            dispatch({type: 'setPlans', plansTemplates: Object.values(data), plansTemplatesFetched: true})
            setLoadingModal(false);
            setShow(false);
            dispatch({type: 'setErrors', errors: ''})
            addToast(
              <p>
                <label className='pr-1'>We got you the latest changes, update your plans now!</label>
              </p>
            );
          })
        }
        else {
          const newList = plansTemplates.map((item) => {
            if (item.id === id) {
              return res.data;
            }
            return item;
          });
          dispatch({type: 'setPlans', plansTemplates: newList})
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

  //DELETE PLAN FUNCTIONS

  //open popUp for delete
  const handleDelete = (current) => {
    addSelectedStyle(current.id);
    setPopup({
      show: true,
      id:current.id,
      text:current.title
    });
  };

  //delete plan with selected id and close popUp
  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      const newItems = (plansTemplates.filter(item => item.id !== popup.id));
      dispatch({type: 'setPlans',plansTemplates:newItems})
      deletePlan(popup.id);
      resetFormCreate();
      setPopup({
        show: false,
        id: null,
        text:''
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

  //open init modal template
  const showModalTemplate = id => {
    setLoadingOperations(true);
    getPlanOperation(id).then(data => {
      setPLanOperations(Object.values(data));
      setLoadingOperations(false);
    })
    setShowTemplate(true);
    var plan = plansTemplates.filter(item => item.id === id)
    setCurrent({
      ...plan[0],
      apiary: false,
      operations:[],
    });
  }

  //reset form when editing plan, initial state without changes
  const resetFormTemplate = (id) => {
    var plan = plansTemplates.filter(item => item.id === id)
    setCurrent(plan[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //initialize plan
  const initPlan = (plan , id) =>{
    setLoadingModal(true);
    planOperations.map((operation) => {
      if (!plan.operations.some(e => e.id === operation.id)) {
        plan.operations.push({id: operation.id, apiaries: [], beehives:[]})
        setCurrent({
          ...current,
          operations: [...plan.operations]
        });
      }
    })
    initializePlan(plan,id).then(res=>{
      if(res){
        const newPlans = plans.concat([res.plan]);
        dispatch({type: 'setPlans',plans:_.sortBy(newPlans, 'start_date')})

        console.log(res.operations)
        const newOperations = plannedOperations.concat(res.operations);
        dispatch({type: 'setOperations',planned:_.sortBy(newOperations, 'planned_date')})
        setLoadingModal(false);
        setShowTemplate(false);
        dispatch({type: 'setErrors', errors:''})
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
        setShowTemplate(false);
      }
    })
  }

  //items specific details
  const openSpecificDetails = (operation) =>{
    setCurrentOperation({...operation})

    data.map(item => {
      item.checked=false;
      item.className = 'flag apiary'
      item.tagClassName= 'flag apiary'
      item.children.map(child => {
        child.checked = false
        child.className = 'flag beehive'
        child.tagClassName= 'flag beehive'
      })
    })

    current.operations.map(op => {
      if(op.id === operation.id){
        data.map(item => {
          op.apiaries.map(apiary =>{
            if(apiary === item.value){
              item.checked = true;
              item.className = 'flag apiary'
              item.tagClassName= 'flag apiary'
            }
          })
          item.children.map(child => {
            op.beehives.map(beehive => {
              if(beehive === child.value){
                child.checked = true;
                child.className = 'flag beehive'
                child.tagClassName= 'flag beehive'
              }
            })
          })
        })
      }
    })

    setShowOperation(true);
  }

  //all details
  const openAllDetails = () => {
    setShowOperation(true);

    //set all to false
    data.map(item => {
      item.checked=false;
      item.children.map(child => {
        child.checked = false
      })
    })

    let numberOfOperations = planOperations.length
    if(numberOfOperations > 0) {
      let apiaryNumber;
      let beehiveNumber;
      apiaries.map(function (apiary, key) {
        apiaryNumber = 0;
        current.operations.map(operation => {
          if (operation.apiaries.includes(apiary.id)) {
            apiaryNumber += 1;
          }
        })
        if (apiaryNumber > 0 && apiaryNumber < numberOfOperations) {
          data[key].className = 'partial';
        }
        if (apiaryNumber === numberOfOperations) {
          data[key].checked = true
        }
      })

      beehives.map(function (beehive, key) {
        beehiveNumber = 0;
        current.operations.map(operation => {
          if (operation.beehives.includes(beehive.id)) {
            beehiveNumber += 1;
          }
        })
        if (beehiveNumber > 0 && beehiveNumber < numberOfOperations) {
          data.map(item => {
            if(item.value === beehive.apiary_id){
              item.children.map(child => {
                if(child.value === beehive.id){
                  child.className = 'partial'
                }
              })
            }
          })
        }
        if (beehiveNumber === numberOfOperations) {
          data.map(item => {
            if(item.value === beehive.apiary_id){
              item.children.map(child => {
                if(child.value === beehive.id){
                  child.checked = true;
                }
              })
            }
          })
        }
      })
    }
    setCurrentOperation({id:null})
  }

  //submit details
  const submitDetails = () => {

    let id = currentOperation.id
    let apiaryData = []
    let beehiveData = []

    data.map((item) => {
      if (item.checked) {
        apiaryData.push(item.value);
      }
    })

    data.map((item) => {
      item.children.map(child => {
        if (child.checked) {
          beehiveData.push(child.value);
        }
      })
    })

    //if id set check if operation exist and change it or add new
    if(id) {
      let operations = current.operations;

      if (operations.some(e => e.id === id)) {
        const newOperations = operations.filter((item) => {
          if (item.id !== id) {
            return item
          }
        })
        newOperations.push({id: id, apiaries: apiaryData, beehives:beehiveData})
        setCurrent({
          ...current,
          operations: [...newOperations]
        });
        setShowOperation(false);
      } else {
        operations.push({id: id, apiaries: apiaryData, beehives: beehiveData})
        setCurrent({
          ...current,
          operations: [...operations]
        });
        setShowOperation(false);
      }
    }
    //if id is not set add global to all operations
    else{
      let newData = [];
      planOperations.map((operation) => {
        newData.push({id:operation.id,apiaries: apiaryData, beehives: beehiveData})
      })
      setCurrent({...current, operations:newData})
      setShowOperation(false);
    }
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
            <div className="d-flex justify-content-between my-3 float-right">
              <PrimaryButton
                id={'addPlanTemplate'}
                onClick={createModal} icon={<AddIcon/>} >
                  {t('plan_template.add')}
              </PrimaryButton>
              </div>
            <div>
              <BeezDataTable
                items={plansTemplates}
                fields={fields}
                fetched={plansTemplatesFetched && apiariesFetched && beehivesFetched}
                scopedSlots={{
                    'title':
                  (item)=> (

                  <td>
                {item.title?item.title:''}
                  </td>
                  ),
                  'description':
                  (item)=> (

                  <td>
                {item.description?item.description:''}
                  </td>
                  ),
                  'start_date':
                  (item)=> (

                  <td>
                {item.start_date?item.start_date:''}
                  </td>
                  ),
                  'stop_date':
                  (item)=> (

                  <td>
                {item.stop_date?item.stop_date:''}
                  </td>
                  ),
                  'actions':
                    (item) => (
                      <td>
                        <a href={`#/templates/plan/${item.id}`}>
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
                  'initialize':
                    (item) => (
                      <td>
                        <InitializeButton
                          onClick={() => {showModalTemplate(item.id)}}
                          title='initialize' icon={<InitializeIcon/>}>
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
        title={current.id ? t('template.model_update_title') : t('template.model_create_title' )}
        icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/>)}
        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {
                current.id && removeSelectedStyle(current.id);
                setShow(false);
                resetFormCreate();
              }}>
              {t('user.cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}}>
                {t('user.reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {current.id ? changePlan(current.id) : createPlan()}} >
              {t('plan.model_submit')}
            </OrangeButton>
          </>
        }
      >
        <CCardBody>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='title'>{t('plan.title')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryInput
                id='title'
                name='title'
                value={current.title !== null ? current.title : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['title']?<CFormText className="help-block">{errorState.errors['title'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='description'>{t('plan.description')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryTextarea
                id='description'
                name='description'
                rows='3'
                value={current.description !== null ? current.description : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="6">
              <PrimaryLabel htmlFor="start_date">{t('plan.start_date')}</PrimaryLabel>
            </CCol>
            <CCol md="6">
              <PrimaryLabel htmlFor="stop_date">{t('plan.stop_date')}</PrimaryLabel>
            </CCol>
            <CCol xs="6" md="6">
              <DateInput
                      id="start_date"
                      name="start_date"
                      value={current.start_date}
                      onChange={(e) => handleDayChange(e,'start_date')}
              />
              {errorState.errors['start_date']?<CFormText className="help-block">{errorState.errors['start_date'][0]}</CFormText>:null}
            </CCol>
            <CCol xs="6" md="6">

              <DateInput
                      id="stop_date"
                      name="stop_date"
                      value={current.stop_date}
                      onChange={(e) => handleDayChange(e,'stop_date')}
              />
             {errorState.errors['stop_date']?<CFormText className="help-block">{errorState.errors['stop_date'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
        </CCardBody>
      </ModalComponent>

      <ModalComponent
        show={showTemplate}
        onHide={() => {
          setShow(false);
          resetFormCreate();
        }}
        title={t('plan.initialize')}
        icon={<InitializeBigIcon/>}
        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {setShowTemplate(false); resetFormCreate();}}>
              {t('user.cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=> {resetFormTemplate(current.id)}}>
                {t('user.reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {initPlan(current,current.id)}}>
              {t('plan.model_submit')}
            </OrangeButton>
          </>
        }
      >
        <CCardBody>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='title'>{t('plan.title')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryInput
                id='title'
                name='title'
                value={current.title !== null ? current.title : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['title']?<CFormText className="help-block">{errorState.errors['title'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='description'>{t('plan.description')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryTextarea
                id='description'
                name='description'
                rows='3'
                value={current.description !== null ? current.description : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md="6">
              <PrimaryLabel htmlFor="start_date">{t('plan.start_date')}</PrimaryLabel>
            </CCol>
            <CCol md="6">
              <PrimaryLabel htmlFor="stop_date">{t('plan.stop_date')}</PrimaryLabel>
            </CCol>
            <CCol xs="6" md="6">
              <DateInput
                            id="start_date"
                            name="start_date"
                            value={current.start_date}
                            onChange={(e) => changeState(e)}
              />
              {errorState.errors['start_date']?<CFormText className="help-block">{errorState.errors['start_date'][0]}</CFormText>:null}
            </CCol>
            <CCol xs="6" md="6">
              <DateInput
                            id="stop_date"
                            name="stop_date"
                            value={current.stop_date}
                            onChange={(e) => changeState(e)}
              />
              {errorState.errors['stop_date']?<CFormText className="help-block">{errorState.errors['stop_date'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          {!loadingOperations?(
            <>
            <CFormGroup
              className='text-right mb-2'
            >
              <DetailButton
                onClick={() => openAllDetails()}
                title='All apiares' icon={ <CIcon content={freeSet.cilApps}/>}
              >
              </DetailButton>
            </CFormGroup>
              <BeezDataTable
                items={planOperations}
                fields={fieldsOperations}
                fetched={plansTemplatesFetched}
                scopedSlots={{
                  'name':
                    (item)=> (

                      <td className="pl-3 text-left">
                        {item.name?item.name:''}
                      </td>
                    ),
                  'description':
                    (item)=> (

                      <td className="pl-3 text-left">
                        {item.description?item.description:''}
                      </td>
                    ),
                  'type':
                    (item)=> (

                      <td className="pl-3 text-left">
                        {item.type?item.type:''}
                      </td>
                    ),
                  'actions':
                    (item) => (
                      <td>
                        <DetailButton
                          onClick={() => openSpecificDetails(item)}
                          title='Details' icon={<CIcon size={'sm'} content={freeSet.cilApps}/>}
                        >
                        </DetailButton>
                      </td>
                    ),
                }}
              />
            </>
          ):(
            <div className="d-flex justify-content-center mb-5">
              <Spinner animation="border" variant="warning"/>
            </div>
          )}
        </CCardBody>
      </ModalComponent>

      <ModalComponent
        show={showOperation}
        onHide={() => {
          setShowOperation(false);
        }}
        title={t('plan.initialize.select')}
        icon={<SelectTemplateIcon/>}
        loading={false}
        actions={
          <>
            <GreyButton
              onClick={() => setShowOperation(false)}>
              {t('user.cancel')}
            </GreyButton>
            <GreyButton  onClick={()=> resetFormTemplate(current.id)}>
                {t('user.reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {submitDetails()}}>
              {t('plan.model_submit')}
            </OrangeButton>
          </>
        }
        size='md'
      >
        <CCardBody style={{height:'400px'}}>
          <DropdownContainer data={data} showDropdown={"always"} mode={"hierarchical"}/>
        </CCardBody>
      </ModalComponent>

      <DeleteModal
        type={t('type.plan')}
        text={popup.text}
        handleDeleteTrue={handleDeleteTrue}
        handleDeleteFalse={handleDeleteFalse}
        show={popup.show}
      />

      <NotifyToaster toasts={toasts} header='You had changes in your plans'/>
    </>
  )
}
export default PlansTemplates
