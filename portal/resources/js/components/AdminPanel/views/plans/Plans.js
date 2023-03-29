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
import {useDispatch, useSelector} from "react-redux";
import {
  addPlan,
  updatePlan,
  deletePlan,
  getAllPlans,
  getAllPlanTemplates,

} from "../../../../endpoints/PlanFunctions";
import ModalComponent from "../../../Modal";
import {useTranslation} from "react-i18next";
import DeleteModal from "../../../DeleteModal";
import NotifyToaster from "../../../NotifyToaster";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import "../plans/index.css";
import {
  DeleteButton,
  DetailButton, GreyButton, OrangeButton,
  PrimaryButton,
  SecondaryButton,
  UpdateButton
} from "../../../buttons/Buttons";
import PrimaryInput, {
  DateInput,
  PrimaryLabel,
  PrimaryTextarea
} from "../../../inputs/Inputs";
import {AddIcon, DeleteIcon, DetailedIcon, SelectIcon, SelectTemplateIcon, UpdateIcon} from "../../assets/icons/icons";
import dateFnsFormat from "date-fns/format";
import moment from "moment";
import {SelectPlanTemplateCard} from "../../../Cards";

const Plans = () => {
  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.userLogged)
  const errorState = useSelector(state => state.errorState);
  const plans = useSelector(state => state.planState.plans)
  const plansTemplates = useSelector(state => state.planState.plansTemplates);
  const fetched = useSelector(state => state.planState.fetched)
  const plansTemplatesFetched = useSelector(state => state.planState.plansTemplatesFetched)
  const [toasts, setToasts] = useState([])
  const [showTemplate,setShowTemplate] = useState(false);
  const [show,setShow] = useState(false);
  const [loadingModal,setLoadingModal] = useState(false);
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
    user_id: ''
  });

  //DataTable fields
  const fields = [
    { key: 'title', label: t('plan.title') },
    { key: 'description', label: t('plan.description') },
    { key: 'start_date', label: t('plan.start_date') },
    { key: 'stop_date', label: t('plan.stop_date'),},
    { key: 'actions', label: t('plan.actions'),_style: { width: '120px' },sorter: false ,filter: false},
  ]

  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }

  const addSelectedStyle = id => {
    const newList = plans.map((item) => {
      if (item.id === id) {
        item._classes = 'bg-warning'
        return item;
      }
      return item;
    });
    dispatch({type: 'setPlans', plans: newList})
  }

  //remove Selected Style
  const removeSelectedStyle = id => {
    const newList = plans.map((item) => {
      if (item.id === id) {
        item._classes = ''
        return item;
      }
      return item;
    });
    dispatch({type: 'setPlans', plans: newList})
  }

  useEffect(() => {

    //if plans operations are not fetched fetch them and store in redux plans
    if (!plansTemplatesFetched) {
      getAllPlanTemplates().then(data => {
        dispatch({type: 'setPlans', plansTemplates: Object.values(data), plansTemplatesFetched: true})
      })
    }
    if (!fetched) {
      getAllPlans().then(data => {
        dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
      })
    }
  }, [])


  //CREATE PLAN FUNCTIONS


  //create blank modal for plans
  const createModal = () => {
    setCurrent({
      id: '',
      title: '',
      description: '',
      start_date: '',
      stop_date: '',
      user_id: ''
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
      user_id: ''
    });
    dispatch({type: 'setErrors', errors:''})
  }

  //adding new plan, if true add plan to redux state, if not show errors
  const createPlan = () => {
    setLoadingModal(true);
    var currentApiary = {...current};
    currentApiary.user_id = loggedUser.id;
    currentApiary.template=false;
    setCurrent(currentApiary);
    addPlan(currentApiary).then(res => {
      if(res.data){
        const newList = plans.concat([res.data]);
        dispatch({type: 'setPlans',plans:newList})
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
    var plan = plans.filter(item => item.id === id)
    setCurrent({
      ...plan[0],
    });
  }

  //reset form when editing plan, initial state without changes
  const resetForm = (id) => {
    var plan = plans.filter(item => item.id === id)
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
          getAllPlans(loggedUser.id).then(data => {
            dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
            setLoadingModal(false);
            setShow(false);
            dispatch({type: 'setErrors', errors: ''})
            addToast(
              <p>
                <label className='pr-1'>We got you the latest changes, update your plans now!</label>
              </p>
            );
          })
        }else {
          const newList = plans.map((item) => {
            if (item.id === id) {
              return res.data;
            }
            return item;
          });
          dispatch({type: 'setPlans', plans: newList})
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
      id: current.id,
      text: current.title
    });
  };

  //delete plan with selected id and close popUp
  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      const newItems = (plans.filter(item => item.id !== popup.id));
      dispatch({type: 'setPlans',plans:newItems})
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
                <SecondaryButton
                  onClick={()=> setShowTemplate(true)} icon={<SelectIcon/>}>
                      {t('select.from_templates')}
                </SecondaryButton>
                <PrimaryButton
                  onClick={createModal}
                  id='addPlan' icon={<AddIcon/>}>
                    {t('plan.table.add')}
                  </PrimaryButton>
              </div>
            <div>
              <BeezDataTable
                items={plans}
                fields={fields}
                fetched={fetched && plansTemplatesFetched}
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
                        <a href={`#/plans/${item.id}`}>
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
        title={current.id ? t('plan.model_update_title') : t('plan.model_create_title' )}
        icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/>)}
        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {current.id && removeSelectedStyle(current.id); setShow(false); resetFormCreate();}} >
              {t('plan.model_cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}} >
                {t('plan.model_reset')}
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
                  id='start'
                  name="start_date"
                  value={current.start_date}
                  onChange={(e) => handleDayChange(e,'start_date')} />
                {errorState.errors['start_date']?<CFormText className="help-block">{errorState.errors['start_date'][0]}</CFormText>:null}

            </CCol>
            <CCol xs="6" md="6">
              <DateInput
                      id='stop'
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
          setShowTemplate(false);
        }}
        loading={false}
        actions={
          <>
            <GreyButton
              onClick={() => {setShowTemplate(false);}} >
              {t('user.cancel')}
            </GreyButton>
          </>
        }
        title={t('select.template')}
        icon={<SelectTemplateIcon/>}
      >

        <CCardBody>
          <CRow>
            {plansTemplates.map((x,i) =>
              <div className='col-xl-6' key= {i} onClick={()=>{setCurrent({ id: '', title: x.title,description: x.description, start_date: x.start_date, stop_date:x.stop_date}); setShowTemplate(false); setShow(true);}}>
                <SelectPlanTemplateCard x={x}/>
              </div>
            )}
          </CRow>
        </CCardBody>

      </ModalComponent>

      <DeleteModal
        text={popup.text}
        type={t('type.plan')}
        handleDeleteTrue={handleDeleteTrue}
        handleDeleteFalse={handleDeleteFalse}
        show={popup.show}
      />

      <NotifyToaster toasts={toasts} header='You had changes in your plans'/>
    </>
  )
}
export default Plans
