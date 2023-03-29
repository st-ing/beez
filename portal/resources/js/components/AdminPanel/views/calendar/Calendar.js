import React, {useEffect, useState} from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import './index.css'
import {
  addOperation,
  getAllOngoingOperations,
  getAllPlannedOperations,
  updateOperation
} from "../../../../endpoints/OperationFunctions";
import {addPlan, getAllPlans, updatePlan} from "../../../../endpoints/PlanFunctions";
import {useDispatch, useSelector} from "react-redux";
import {
  CCardBody,
  CCol,
  CFormGroup,
  CFormText,
  CNav,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import ModalComponent from "../../../Modal";
import {useTranslation} from "react-i18next";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import fetchCalendar from "../../../actions/fetchCalendar";
import NotifyToaster from "../../../NotifyToaster";
import styled from "styled-components";
import ApiaryImg from '@BeesImages/BeehiveLocation.png';
import BeehiveImg from '@BeesImages/BeehiveCalendar.png';
import PrimaryInput, {DateInput, PrimaryLabel, PrimaryTextarea} from "../../../inputs/Inputs";
import {GreyButton, OrangeButton} from "../../../buttons/Buttons";
import PrimarySelect from "../../../select/Select";
import PrimaryTab, {
  GreyLeftTab, GreyNoRadiusTab,
  GreyPrimaryTab, GreyRightTab,
  OrangeLeftTab, OrangeNoRadiusTab, OrangeRightTab,
  OrangeSecondaryTab,
  SecondaryTab
} from "../../../tabs/Tabs";
import {OperationsTemplateIcon, TemplateIcon} from "../../assets/icons/icons";


const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar);
const now = new Date()

const StyledCalendar = styled(DnDCalendar)`
  .rbc-addons-dnd .rbc-addons-dnd-resize-ew-anchor {
    position: absolute;
    top: 15px;
    bottom: 0;
  }
  .rbc-day-bg {
    background-color: #F0F0F8;
    opacity: 0.5;
  }
  .rbc-day-bg.rbc-off-range-bg{
    background-color: #F0F0F8;
    opacity: 0.8;
  }
  .rbc-day-bg.rbc-selected-cell{
    background-color: #F0F0F8;
    opacity: 1;
  }
  .rbc-day-bg
  .rbc-header{
    background-color: #F0F0F8 !important;
    padding: 1rem;
  }
  .rbc-month-view{
    border-radius: 10px;
  }
  .rbc-month-row{
    overflow: initial !important;
  }
  .rbc-month-view > .rbc-month-header > .rbc-header:first-child{
    border-radius: 10px 0 0 0px;
  }
  .rbc-month-view > .rbc-month-header > .rbc-header:last-child{
    border-radius: 0 10px 0 0px;
  }
  .rbc-month-view > .rbc-month-row:last-child  > .rbc-row-bg > .rbc-day-bg:first-child,
  .rbc-month-view > .rbc-month-row:last-child  > .rbc-row-bg > .rbc-day-bg:last-child,
   border-radius: 0 10px 10px 0;
  }
  .rbc-custom-toolbar{
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
  }
  .rbc-custom-label{
    flex-grow: 1;
    padding: 0 10px;
    text-align: center;
    font-size: 16px !important;

  }
  .rbc-custom-date{
    font-family: Work Sans,sans-serif;
    margin-right: 3px;
  }
`
const MoreOperationsDiv = styled.div`
  div{
    width: 20px;
    height: 20px;
    background-color: #F0F0F8;
    border-radius: 100%;
    display:flex;
    justify-content: center;
  }
  display: flex;
  justify-content: space-between;
  background: rgba(246, 189, 96, 0.4);
  border-radius: 4px;
  font-family: Work Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  color: #3D405B;
  margin: 2px 5px;
  padding: 5px;
`
let CalendarComponent = () => {

  const{t} = useTranslation();
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.userLogged);
  const errorState = useSelector(state => state.errorState);
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const plannedOperations = useSelector(state => state.operationState.planned)
  const ongoingOperations = useSelector(state => state.operationState.ongoing)
  const calendar = useSelector(state => state.operationState.calendar)
  const plans = useSelector(state => state.planState.plans)
  const plansFetched = useSelector(state => state.planState.fetched)
  const apiariesFetched = useSelector(state => state.apiaryState.fetched)
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const ongoingFetched = useSelector(state => state.operationState.ongoingFetched)
  const plannedFetched = useSelector(state => state.operationState.plannedFetched)
  const [active, setActive] = useState(0);
  const [activeType, setActiveType] = useState(0);
  const [show,setShow] = useState(false);
  const [showPlan,setShowPlan] = useState(false);
  const [loadingModal,setLoadingModal] = useState(false);
  const [view,setView]= useState('month');
  const [draggedEvent,setDraggedEvent] = useState(null);
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
  const [currentPlan,setCurrentPlan] = useState({
    id: '',
    title: '',
    description: '',
    start_date: '',
    stop_date: '',
    user_id: ''
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

  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }

  useEffect(() => {
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

    const promise1 = returnPlans();
    const promise2 = returnOngoing();
    const promise3 = returnPlanned();

    //get plans and operations and fetchCalendar
    Promise.all([promise1, promise2, promise3]).then((values) => {
      dispatch({type: 'setPlans', plans: Object.values(values[0]), fetched: true})
      dispatch({type: 'setOperations', ongoing: _.sortBy(Object.values(values[1]), 'planned_date'), ongoingFetched: true})
      dispatch({type: 'setOperations', planned: _.sortBy(Object.values(values[2]), 'planned_date'), plannedFetched: true})
      dispatch(fetchCalendar(values[0],values[1],values[2]))
      plansOptions(Object.values(values[0]))
    });
},[])

  //return operations if fetched, if not fetch them
  const returnOngoing = () => {
    if (!ongoingFetched) {
      return getAllOngoingOperations();
    }
    {
      return ongoingOperations;
    }
  }

  //return planned operations if fetched, if not fetch them
  const returnPlanned = () => {
    if (!plannedFetched) {
      return getAllPlannedOperations();
    }
    {
      return plannedOperations;
    }
  }

  //return plans if fetched, if not fetch them
  const returnPlans = () => {
    if (!plansFetched) {
      return getAllPlans();
    }
    {
      return plans;
    }
  }

  //CREATE OPERATION FUNCTIONS

  //open modal for creating new operation
  const createModal = (start) => {
    setCurrent({
      id: '',
      name: '',
      description: '',
      status: '',
      planning_comments: '',
      planned_date: moment(start).format("YYYY-MM-DD"),
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

  //adding new operation, if true add operation to operation and calendar state, if not show errors
  const createOperation = () => {
    setLoadingModal(true);
    var currentOperation = {...current};
    currentOperation.user_id = loggedUser.id;
    currentOperation.status = 'planned';
    currentOperation.template = false;
    setCurrent(currentOperation);
    addOperation(currentOperation).then(res => {
      if(res.data){
        var data = res.data
        data.start = new Date(data.planned_date);
        data.end =  new Date(data.planned_date);
        data.plan = false;
        data.id_id = _.uniqueId('operation_');

        const newList = calendar.concat([data]);
        dispatch({type: 'setOperations',calendar:newList})

        const newPlanned = plannedOperations.concat([data]);
        dispatch({type: 'setOperations',planned:newPlanned})

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
  const showModal = event => {
    setShow(true);
    setCurrent(event);
  }

  //reset form when editing operation, initial state without changes
  const resetForm = (id) => {
    var operation = calendar.filter(item => item.id === id)
    setCurrent(operation[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //update operation, if successful add operation to calendar.
  //if not show errors for missing fields
  const changeOperation = id => {
    setLoadingModal(true);
    updateOperation(current,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          const ongoingPromise = getAllOngoingOperations();
          const plannedPromise = getAllPlannedOperations();
          Promise.all([ongoingPromise, plannedPromise]).then((values) => {
            dispatch({type: 'setOperations', ongoing: _.sortBy(Object.values(values[0]), 'planned_date'), ongoingFetched: true})
            dispatch({type: 'setOperations', planned: _.sortBy(Object.values(values[1]), 'planned_date'), plannedFetched: true})
            dispatch(fetchCalendar(plans,values[0],values[1]))

            setLoadingModal(false);
            setShow(false);
            dispatch({type: 'setErrors', errors: ''})
            addToast(
              <p>
                <label className='pr-1'>We got you the latest changes, update your operation now!</label>
              </p>
            );
          });
        }else {
          var value = res.data
          value.id_id = current.id_id;
          value.start = new Date(value.planned_date);
          value.end = new Date(value.planned_date);
          const nextEvents = calendar.map(existingEvent => {
            return existingEvent.id_id === value.id_id
              ? {
                ...existingEvent,
                name: value.name,
                description: value.description,
                status: value.status,
                planning_comments: value.planning_comments,
                planned_date: value.planned_date,
                executed_date: value.executed_date,
                comments: value.comments,
                type: value.type,
                template: value.template,
                user_id: value.user_id,
                plan_id: value.plan_id,
                beehive_id: value.beehive_id,
                apiary_id: value.apiary_id,
                updated_at: value.updated_at,
                created_at: value.created_at,
                start: value.start,
                end: value.end,
              }
              : existingEvent
          })

          dispatch({type: 'setOperations', calendar: nextEvents})

          //if result status is planned data add to redux planned operations else to ongoing operations
          if (res.data.status === 'planned') {
            const newList = plannedOperations.map((item) => {
              if (item.id === res.data.id) {
                return res.data;
              }
              return item;
            });
            dispatch({type: 'setOperations', planned: newList})
          } else {
            const newList = ongoingOperations.map((item) => {
              if (item.id === res.data.id) {
                return res.data;
              }
              return item;
            });
            dispatch({type: 'setOperations', ongoing: newList})
          }
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

  //CALENDAR FUNCTIONS

  //if event is plan update plan, if event is operation update operation
  const updateData = (currentEvent,nextEvents,start,end) => {
    if(currentEvent.plan) {
      currentEvent.start_date = moment(start).format('YYYY-MM-DD')
      currentEvent.stop_date = moment(end).format('YYYY-MM-DD');
      updatePlan(currentEvent, currentEvent.id).then(res => {
        if (res.data) {
          if(res.data === 404){
            getAllPlans().then(data => {
              dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
              dispatch(fetchCalendar(Object.values(data),ongoingOperations,plannedOperations))
              setLoadingModal(false);
              setShowPlan(false);
              dispatch({type: 'setErrors', errors: ''})
              addToast(
                <p>
                  <label className='pr-1'>We got you the latest changes, update your plan now!</label>
                </p>
              );
            })
          }else {
            var value = res.data
            value.id_id = currentEvent.id_id;
            value.start = new Date(value.start_date);
            value.end = new Date(value.stop_date);
            const nextCalendar = calendar.map(existingEvent => {
              return existingEvent.id_id === value.id_id
                ? {
                  ...existingEvent,
                  start_date: value.start_date,
                  stop_date: value.stop_date,
                  updated_at: value.updated_at,
                  created_at: value.created_at,
                  start: value.start,
                  end: value.end,
                }
                : existingEvent
            })

            dispatch({type: 'setOperations', calendar: nextCalendar})

            const newList = plans.map((item) => {
              if (item.id === res.data.id) {
                return res.data;
              }
              return item;
            });
            dispatch({type: 'setPlans', plans: newList})
            dispatch({type: 'setErrors', errors: ''})
          }
        } else {
          dispatch({type: 'setErrors', errors: res});
        }
      })
    }else {
      currentEvent.planned_date = moment(start).format('YYYY-MM-DD')
      updateOperation(currentEvent, currentEvent.id).then(res => {
        if (res.data) {
          if(res.data === 404){
            const ongoingPromise = getAllOngoingOperations();
            const plannedPromise = getAllPlannedOperations();
            Promise.all([ongoingPromise, plannedPromise]).then((values) => {
              dispatch({type: 'setOperations', ongoing: _.sortBy(Object.values(values[0]), 'planned_date'), ongoingFetched: true})
              dispatch({type: 'setOperations', planned: _.sortBy(Object.values(values[1]), 'planned_date'), plannedFetched: true})
              dispatch(fetchCalendar(plans,values[0],values[1]))

              setLoadingModal(false);
              setShow(false);
              dispatch({type: 'setErrors', errors: ''})
              addToast(
                <p>
                  <label className='pr-1'>We got you the latest changes, update your operation now!</label>
                </p>
              );
            });
          }else {
            let value = res.data
            value.id_id = currentEvent.id_id;
            value.start = new Date(value.planned_date);
            value.end = new Date(value.planned_date);
            const nextEvents = calendar.map(existingEvent => {
              return existingEvent.id_id === value.id_id
                ? {
                  ...existingEvent,
                  planned_date: value.planned_date,
                  executed_date: value.executed_date,
                  updated_at: value.updated_at,
                  created_at: value.created_at,
                  start: value.start,
                  end: value.end,
                }
                : existingEvent
            })
            dispatch({type: 'setOperations', calendar: nextEvents})

            //if result status is planned data add to redux planned operations else to ongoing operations
            if (res.data.status === 'planned') {
              const newList = plannedOperations.map((item) => {
                if (item.id === res.data.id) {
                  return res.data;
                }
                return item;
              });
              dispatch({type: 'setOperations', planned: newList})
            } else {
              const newList = ongoingOperations.map((item) => {
                if (item.id === res.data.id) {
                  return res.data;
                }
                return item;
              });
              dispatch({type: 'setOperations', ongoing: newList})
            }
            dispatch({type: 'setErrors', errors: ''})
          }
        } else {
          dispatch({type: 'setErrors', errors: res});
        }
      })
    }
  }

  //set event that is dragged
  const handleDragStart = event => {
    setDraggedEvent(event);
  }

  // return dragged event
  // const dragFromOutsideItem = () => {
  //   return draggedEvent
  // }

  //when event dropped outside return it to original position
  const onDropFromOutside = ({ start, end, allDay }) => {
    const event = draggedEvent;
    const nextEvents = calendar.map(existingEvent => {
      return existingEvent.id_id === event.id_id
        ? { ...existingEvent, start, end }
        : existingEvent
    })
    updateData(event,nextEvents,start,end);
    setDraggedEvent(null);
  }

  //when event moved set new start and end position and call updateData
  const moveEvent = ({ event, start, end }) => {

    const nextEvents = calendar.map(existingEvent => {
      return existingEvent.id_id === event.id_id
        ? { ...existingEvent, start, end }
        : existingEvent
    })
    updateData(event,nextEvents,start,end);
  }

  //when resizing event set new start and end position and updateData
  const resizeEvent = ({ event, start, end }) => {

    const nextEvents = calendar.map(existingEvent => {
      return existingEvent.id_id === event.id_id
        ? { ...existingEvent, start, end }
        : existingEvent
    })
    updateData(event,nextEvents,start,end);
  }

  //when click on map open operation modal if select multiple days create plan modal
  const handleSelect = ({ start, end }) => {
    start.setDate(start.getDate());
    end.setDate(end.getDate() - 1);
    start.getTime()===end.getTime()?
    createModal(start):
    createModalPlan(start,end)
  }

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };

    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate('current');
    };

    const goToMonthView = () => {
      toolbar.onView("month");
    };

    const goToAgendaView = () => {
      toolbar.onView("agenda");
    };

    const returnCurrentDate = () => {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      return (toolbar.date.getMonth() === month && toolbar.date.getFullYear() === year);
    }

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
      );
    };

    return (
      <div className='rbc-custom-toolbar'>
        {toolbar.view === 'month' && (
          <h3>{t('calendar.header')}</h3>
        )
        }
        {toolbar.view === 'agenda' && (
          <h3>{t('calendar.agenda')}</h3>
        )
        }
        <div className='rbc-custom-label'>
          {!returnCurrentDate()?
            <GreyButton onClick={goToCurrent}>{t('calendar.today')}</GreyButton> :
            <OrangeButton onClick={goToCurrent}>{t('calendar.today')}</OrangeButton>
          }
          <GreyButton onClick={goToBack}>&#8249;</GreyButton>
          <label className='rbc-custom-date'> {label()} </label>
          <GreyButton onClick={goToNext}>&#8250;</GreyButton>
        </div>
        <div>
          {toolbar.view === 'month' && (
            <>
              <OrangeButton onClick={goToMonthView}> {t('calendar.month')} </OrangeButton>
              <GreyButton onClick={goToAgendaView}> {t('calendar.agenda')} </GreyButton>
            </>
            )
          }
          {toolbar.view === 'agenda' && (
            <>
              <GreyButton  onClick={goToMonthView}> {t('calendar.month')} </GreyButton>
              <OrangeButton  onClick={goToAgendaView}> {t('calendar.agenda')} </OrangeButton>
            </>
          )
          }
        </div>
      </div >
    );
  };

  //if event is plan show title if event is operation show name
  const Event = ({ event }) => {
    return (
      event.plan?
          (
            <span> {event.title}</span>
          )
          :
          (
            <>
              <div>{event.name}</div>
              {(event.apiary_id || event.beehive_id) &&
                (
                  <div>
                    {event.apiary_id && (
                      <>
                        <img
                          src={ApiaryImg}
                          width="14"
                          height="14"
                          className="d-inline-block align-bottom"
                          alt='Beehive icon'
                        />
                        <span>{apiaries.find(apiary => apiary.id === event.apiary_id)?.name+" "}</span>
                      </>
                      )
                    }
                    {event.beehive_id && (
                      <>
                        <img
                          src={BeehiveImg}
                          width="14"
                          height="14"
                          className="d-inline-block align-bottom"
                          alt='Beehive icon'
                        />
                        <span>{beehives.find(beehive => beehive.id === event.beehive_id)?.name}</span>
                      </>
                    )
                  }
                </div>
              )
              }
            </>
          )
    )
  }

  //in agenda view show and description also
  const EventAgenda = ({ event }) => {
    return (
      <span>
          <strong>{event.name}</strong>
          <p>{event.description}</p>
      </span>
    )
  }

  //styles for plan and operations in calendar
  const eventStyleGetter = (event, start, end, isSelected) => {
    var style = {
      backgroundColor: '#FFFFFF',
      color:'#3D405B',
      borderRadius:'6px',
      fontSize: '12px',
    };
    if(view==='month') {
      if(event.plan){
        style.backgroundColor = "#FFFFFF"
        style.border = '1px solid #F6BD60';
        style.color = '#3D405B';
        style.borderRadius = '6px';
        style.fontSize = '14px';
      }
    }else{
      style.backgroundColor = "#ffffff";
    }
    return {
      style: style
    };
  }

  //set view state on change
  const onChangeView = (view) => {
    setView(view);
  }

  //change state of input fields and remove errors when starting to write new value
  const changeState = (e) => {
    var { name, value} = e.target;
    errorState.errors[name] &&  dispatch({type: 'removeErrors', errors:{[name]:['']}})
    setCurrent({
      ...current,
      [name]:value
    });
  }

  //change value and parse it to Integer
  const changeStateSelect = (e) => {
    errorState.errors[e.name] && dispatch({type: 'removeErrors', errors:{[e.name]:''}})
    setCurrent({
      ...current,
      [e.name]:parseInt(e.value)
    });
  }

  //CREATE PLAN FUNCTIONS

  //create modal for plans with start and end date
  const createModalPlan = (start,end) => {
    setCurrentPlan({
      id: '',
      title: '',
      description: '',
      start_date: moment(start).format("YYYY-MM-DD"),
      stop_date: moment(end).format("YYYY-MM-DD"),
      user_id: ''
    });
    setShowPlan(true);
  }

  //reset modal when creating plan
  const resetFormCreatePlan = (id) => {
    setCurrentPlan({
      id: '',
      title: '',
      description: '',
      start_date: '',
      stop_date: '',
      user_id: ''
    });
    dispatch({type: 'setErrors', errors:''})
  }

  //adding new plan, if true add plan to redux state and calendar state, if not show errors
  const createPlan = () => {
    setLoadingModal(true);
    var plan = {...currentPlan};
    plan.user_id = loggedUser.id;
    plan.template=false;
    setCurrentPlan(plan);
    addPlan(plan).then(res => {
      if(res.data){
        var data = res.data
        data.start = new Date(data.start_date);
        data.end =  new Date(data.stop_date);
        data.plan = true;
        data.id_id = _.uniqueId('plan_');
        const newList = calendar.concat([data]);
        dispatch({type: 'setOperations',calendar:newList})

        const newPlans = plans.concat([data]);
        dispatch({type: 'setPlans',plans:newPlans})

        setLoadingModal(false);
        setShowPlan(false);
        dispatch({type: 'setErrors', errors:''})
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  //EDIT PLAN FUNCTIONS

  //open modal for editing plan
  const showModalPlan = event => {
    setShowPlan(true);
    setCurrentPlan(event);
  }

  //reset form when editing plan, initial state without changes
  const resetFormPlan = (id) => {
    var plan = plans.filter(item => item.id === id)
    setCurrentPlan(plan[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //update plan, if successful add plan to operation store and to calendar store.
  //if not show errors for missing fields
  const changePlan = id => {
    setLoadingModal(true);
    updatePlan(currentPlan,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getAllPlans().then(data => {
            dispatch({type: 'setPlans', plans: Object.values(data), fetched: true})
            dispatch(fetchCalendar(Object.values(data),ongoingOperations,plannedOperations))
            setLoadingModal(false);
            setShowPlan(false);
            dispatch({type: 'setErrors', errors: ''})
            addToast(
              <p>
                <label className='pr-1'>We got you the latest changes, update your plan now!</label>
              </p>
            );
          })
        }else {
          var value = res.data
          value.id_id = currentPlan.id_id;
          value.start = new Date(value.start_date);
          value.end = new Date(value.stop_date);
          const nextEvents = calendar.map(existingEvent => {
            return existingEvent.id_id === value.id_id
              ? {
                ...existingEvent,
                title: value.title,
                description: value.description,
                start_date: value.start_date,
                stop_date: value.stop_date,
                user_id: value.user_id,
                updated_at: value.updated_at,
                created_at: value.created_at,
                start: value.start,
                end: value.end,
              }
              : existingEvent
          })

          dispatch({type: 'setOperations', calendar: nextEvents})

          const newList = plans.map((item) => {
            if (item.id === res.data.id) {
              return res.data;
            }
            return item;
          });
          dispatch({type: 'setPlans', plans: newList})
          setLoadingModal(false);
          setShowPlan(false);
          dispatch({type: 'setErrors', errors: ''})
        }
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  //change state of input fields and remove errors when starting to write new value
  const changeStatePlan = (e) => {
    var { name, value} = e.target;
    errorState.errors[name] &&  dispatch({type: 'removeErrors', errors:{[name]:['']}})
    setCurrentPlan({
      ...currentPlan,
      [name]:value
    });
  }
  const handleDayChange = (day,name) => {
    setCurrentPlan({
      ...currentPlan,
      [name]:moment(day).format("YYYY-MM-DD"),
    });
  }

  return(
    (ongoingFetched && apiariesFetched && beehivesFetched && plansFetched && plannedFetched) && (
      <>
        <StyledCalendar
          resizableAccessor={(event) => event.plan}
          responsive
          selectable
          popup={true}
          events={calendar}
          views={{ month: true, agenda: true }}
          step={60}
          defaultDate={now}
          localizer={localizer}
          hideTimeIndicator
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onDropFromOutside={onDropFromOutside}
          handleDragStart={handleDragStart}
          messages={{ showMore: (target) => <MoreOperationsDiv role="presentation"> <span>{target} Operations</span> <div><CIcon name='up-tick' width={10}/></div></MoreOperationsDiv> }}
          //dragFromOutsideItem={ dragFromOutsideItem }
          onView={onChangeView}
          components={{
            event: Event,
            toolbar: CustomToolbar,
            agenda: {
              event: EventAgenda,
            },
          }}
          eventPropGetter={(eventStyleGetter)}
          onSelectEvent={event => !event.plan?showModal(event):showModalPlan(event)}
          onSelectSlot={handleSelect}
          style={{ height: '100%' }}
        />

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
                       onClick={() => {setShow(false); resetFormCreate();}}
              >
                {t('user.cancel')}
              </GreyButton>
              <GreyButton
                onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}}
              >
                {t('user.reset')}
              </GreyButton>
              <OrangeButton
                id={'submit'}
                       onClick={() => {current.id ? changeOperation(current.id) : createOperation()}}
              >
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
                        placeholder={t('operation.name')}
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
                        placeholder={t('operation.description')}
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
          show={showPlan}
          onHide={() => {
            setShowPlan(false);
            resetFormCreatePlan();
          }}
          title={currentPlan.id ? t('plan.model_update_title') : t('plan.model_create_title' )}
          icon={currentPlan.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/>)}
          loading={loadingModal}
          actions={
            <>
              <GreyButton
                       onClick={() => {setShowPlan(false); resetFormCreatePlan();}}
              >
                {t('plan.model_cancel')}
              </GreyButton>
              <GreyButton
                onClick={()=>{currentPlan.id ? resetFormPlan(currentPlan.id) : resetFormCreatePlan()}}
              >
                {t('plan.model_reset')}
              </GreyButton>
              <OrangeButton
                id={'submit'}
                       onClick={() => {currentPlan.id ? changePlan(currentPlan.id) : createPlan()}}
              >
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
                  placeholder={t('plan.title')}
                  value={currentPlan.title}
                  onChange={(e) => changeStatePlan(e)}
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
                  placeholder={t('plan.description')}
                  value={currentPlan.description}
                  onChange={(e) => changeStatePlan(e)}
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
                  value={currentPlan.start_date}
                  onChange={(e) => handleDayChange(e,'start_date')} />
                {errorState.errors['start_date']?<CFormText className="help-block">{errorState.errors['start_date'][0]}</CFormText>:null}

              </CCol>
              <CCol xs="6" md="6">
                <DateInput
                  id='stop'
                  name="stop_date"
                  value={currentPlan.stop_date}
                  onChange={(e) => handleDayChange(e,'stop_date')}
                />
                {errorState.errors['stop_date']?<CFormText className="help-block">{errorState.errors['stop_date'][0]}</CFormText>:null}
              </CCol>
            </CFormGroup>
          </CCardBody>
        </ModalComponent>

        <NotifyToaster toasts={toasts} header='You had changes in your calendar'/>
      </>
    )
  )
}
export default CalendarComponent
