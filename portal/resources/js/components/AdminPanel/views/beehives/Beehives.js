import React, {useEffect, useState} from 'react'
import {
  CCardBody,
  CCol,
  CFormGroup,
  CFormText,
  CInput,
  CTabContent,
  CTabPane,
  CTabs,
} from '@coreui/react'
import {addBeehive, deleteBeehive, getBeehives, updateBeehive} from "../../../../endpoints/BeehiveFunctions";
import CIcon from "@coreui/icons-react";
import {useDispatch, useSelector} from "react-redux";
import {Map, Marker, Polygon, TileLayer} from "react-leaflet";
import Search from "react-leaflet-search";
import {useTranslation} from "react-i18next";
import {blueIcon, getPosition, redIcon} from "../../../Utilities/helpers";
import ModalComponent from "../../../Modal";
import DeleteModal from "../../../DeleteModal";
import {getApiaries} from "../../../../endpoints/ApiaryFunctions";
import NotifyToaster from "../../../NotifyToaster";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import QueenSvg from "./QueenSvg";
import {
  DeleteButton,
  DetailButton, GreyButton, OrangeButton,
  PrimaryButton,
  SecondaryButton,
  UpdateButton
} from "../../../buttons/Buttons";
import PrimaryInput, {DateInput, PrimaryLabel, PrimaryTextarea} from "../../../inputs/Inputs";
import {BeehiveMap} from "../../../BeezMap";
import {AddIcon, DeleteIcon, DetailedIcon, MapIcon, UpdateIcon} from "../../assets/icons/icons";
import PrimarySelect from "../../../select/Select";
import dateFnsFormat from "date-fns/format";
import moment from "moment";


const Beehives = () => {
    const dispatch = useDispatch();
    const errorState = useSelector(state => state.errorState);
    const loggedUser = useSelector(state => state.userLogged);
    const apiaries = useSelector(state => state.apiaryState.apiaries)
    const beehives = useSelector(state => state.beehiveState.beehives)
    const apiariesFetched = useSelector(state => state.apiaryState.fetched)
    const beehivesFetched = useSelector(state => state.beehiveState.fetched)
    const {t,i18n} = useTranslation();
    const [loadingModal,setLoadingModal] = useState(false);
    const [active, setActive] = useState(0);
    const [show,setShow] = useState(false);
    const [position,setPosition] = useState([0,0]);
    const [clicked, setClicked] = useState(0);
    const [popup, setPopup] = useState({
      show: false,
      id: null,
    });
    const [current,setCurrent] = useState({
        id: '',
        name: '',
        description: '',
        type: '',
        longitude:0.000000,
        latitude:0.000000,
        altitude:'',
        num_honey_frames: '',
        num_pollen_frames: '',
        num_brood_frames: '',
        num_empty_frames: '',
        source_of_swarm: '',
        installation_date: '',
        queen_color: '',
        created_at: '',
        updated_at: '',
        apiary_id: ''
    });
    const [toasts, setToasts] = useState([])
    const [selectApiaries,setSelectApiaries] = useState([])

    //Add selected style
    const addSelectedStyle = id => {
      const newList = beehives.map((item) => {
        if (item.id === id) {
          item._classes = 'bg-warning'
          return item;
        }
        return item;
      });
      dispatch({type: 'setBeehives',beehives:newList})
    }

    //remove Selected Style
    const removeSelectedStyle = id => {
      const newList = beehives.map((item) => {
        if (item.id === id) {
          item._classes = ''
          return item;
        }
        return item;
      });
      dispatch({type: 'setBeehives',beehives:newList})
    }


    const addToast = (data) => {
      setToasts([
        ...toasts,
        { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
      ])
    }

    //DataTable fields
    const fields = [
        { key: 'name', label: t('beehive.name') },
        { key: 'description', label: t('beehive.description')},
        { key: 'type', label: t('beehive.type') },
        { key: 'installation_date', label: t('beehive.installation_date')},
        { key: 'queen_color', label: t('beehive.queen_color')},
        { key: 'actions', label: t('beehive.actions'), _style: {width:'120px'},sorter: false ,filter: false},
    ]

    const apiariesOptions = (apiaries) => {
      let data = []
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
          setPosition(getPosition(Object.values(data)));
        })
      }
      setPosition(getPosition(beehives));
    }, []);

    //DELETE BEEHIVES FUNCTIONS

    //open popUp for delete
    const handleDelete = (current) => {
      addSelectedStyle(current.id);
      setPopup({
        show: true,
        id: current.id,
        text: current.name,
      });
    };

    //delete beehive with selected id and close popUp
    const handleDeleteTrue = () => {
      if (popup.show && popup.id) {
        const newItems = (beehives.filter(item => item.id !== popup.id));
        dispatch({type: 'setBeehives',beehives:newItems})
        deleteBeehive(popup.id);
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
      removeSelectedStyle(popup.id)
      setPopup({
        show: false,
        id: null,
        text:''
      });
    };

    //EDIT BEEHIVE FUNCTIONS

    //update beehive, if successful either add beehive or show toaster that table is not synced.
    //if not show errors for missing fields
    const changeBeehive = id => {
        setLoadingModal(true);
        updateBeehive(current,id).then(res => {
            if(res.data) {
              if(res.data === 404){
                getBeehives(loggedUser.id).then(data => {
                  dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
                  setPosition(getPosition(Object.values(data)));
                  setLoadingModal(false);
                  setShow(false);
                  dispatch({type: 'setErrors', errors: ''})
                  addToast(
                    <p>
                      <label className='pr-1'>We got you the latest changes, update your beehive now!</label>
                    </p>
                  );
                })
              }else {
                const newList = beehives.map((item) => {
                  if (item.id === id) {
                    return res.data;
                  }
                  return item;
                });
                dispatch({type: 'setBeehives', beehives: newList})
                resetFormCreate();
                setLoadingModal(false);
                setShow(false);
                dispatch({type: 'setErrors', errors: ''})
              }
            }else{
                dispatch({type: 'setErrors', errors:res})
                setLoadingModal(false);
            }
        })
    }

    //open modal for editing of selected beehive
    const showModal = id => {
        addSelectedStyle(id)
        setShow(true);
        var beehive = beehives.filter(item => item.id === id)
        if(beehive[0].altitude===null){
            setCurrent({
                ...beehive[0],
                altitude:'',
            });
        }else {
            setCurrent(beehive[0]);
        }
    }

    //change state of input fields
    const changeState = (e) => {
        var { name, value} = e.target;
        setCurrent({
            ...current,
            [name]:value
        });
    }

    //change value and parse it to Integer
    const changeStateSelect = (e) => {
      setCurrent({
        ...current,
        [e.name]:parseInt(e.value)
      });
    }

    //CREATE BEEHIVE FUNCTIONS

    //open modal for creating new beehive with given lat and long
    const createModal = (lat,long) => {
        if(lat && long){
            setCurrent({
                id: '',
                name: '',
                description: '',
                type: '',
                latitude: lat,
                longitude: long,
                altitude:'',
                num_honey_frames: '0',
                num_pollen_frames: '0',
                num_brood_frames: '0',
                num_empty_frames: '0',
                source_of_swarm: '',
                installation_date: '',
                queen_color: '#000000',
                created_at: '',
                updated_at: '',
                apiary_id: apiaries[0].id,
            });
        } else {
            setCurrent({
                id: '',
                name: '',
                description: '',
                type: '',
                longitude:0.000000,
                latitude:0.000000,
                altitude:'',
                num_honey_frames: '0',
                num_pollen_frames: '0',
                num_brood_frames: '0',
                num_empty_frames: '0',
                source_of_swarm: '',
                installation_date: '',
                queen_color: '#000000',
                created_at: '',
                updated_at: '',
                apiary_id: apiaries[0].id,
            });
        }
        setShow(true);
    }

    //adding new beehive, if true add beehive to redux state, if not show errors
    const createBeehive = () => {
        setLoadingModal(true);
        var currentBeehive = {...current};
        currentBeehive.owner_id = loggedUser.id;
        setCurrent(currentBeehive);
        addBeehive(currentBeehive).then(res => {
            if(res.data) {
                const newList = beehives.concat([res.data]);
                dispatch({type: 'setBeehives',beehives:newList})
                resetFormCreate();
                setLoadingModal(false);
                setShow(false);
                dispatch({type: 'setErrors', errors:''})
            }
            else{
                dispatch({type: 'setErrors', errors:res})
                setLoadingModal(false);
            }
        })
    }

    //reset form when editing beehive, initial state without changes
    const resetForm = (id) => {
        var beehive = beehives.filter(item => item.id === id)
        setCurrent(beehive[0]);
        dispatch({type: 'setErrors', errors:''})
    }

    //reset form when creating beehive
    const resetFormCreate = (id) => {
        setCurrent({
            id: '',
            name: '',
            description: '',
            type: '',
            latitude: 0.000000,
            longitude: 0.000000,
            altitude:'',
            num_honey_frames: '0',
            num_pollen_frames: '0',
            num_brood_frames: '0',
            num_empty_frames: '0',
            source_of_swarm: '',
            installation_date: `${dateFnsFormat(new Date(),"yyyy-MM-dd" )}`,
            queen_color: '#000000',
            created_at: '',
            updated_at: '',
            apiary_id: apiaries[0].id,
        });
        dispatch({type: 'setErrors', errors:''})
    }

    const loadMap = (event) => {
        event.target._map.invalidateSize(true);
    }

    //if u click on map twice (timeout 300 before reset) create model with lang lat
    const handleClick = (e) => {
        setClicked(clicked+1);
        setTimeout(function(){
            if(clicked === 1){
                createModal(e.latlng.lat,e.latlng.lng)
                setClicked(0);
            }
            setClicked(0);
        }, 300);
    }

    //same as handleClick just for minimap (doesnt open new modal, but changes marker on map)
    const handleClickMiniMap = (e) => {
            setClicked(clicked + 1);
            setTimeout(function () {
                if (clicked === 1) {
                    setCurrent({
                        ...current,
                        latitude:e.latlng.lat,
                        longitude:e.latlng.lng
                    });
                    setClicked(0);
                }
                setClicked(0);
            }, 300);
    }

    //when dragging marker gets lat and lng and sets it
    const updateMarker = (e) => {
        const latLng = e.target.getLatLng();
        const latitude = latLng.lat;
        const longitude = latLng.lng;
        setCurrent({
            ...current,
            latitude:latitude,
            longitude:longitude
        });
    }
    const handleDayChange = (day,name) => {
      setCurrent({
        ...current,
        [name]:moment(day).format("YYYY-MM-DD"),
      });
    }

    return (
        <>
            <CTabs activeTab={active} onActiveTabChange={idx => setActive(idx)} className='c-body'>
            <CTabContent className='c-body'>
                <CTabPane>
                    <div className='my-3'>
                        <div className="d-flex justify-content-end my-3">
                          <SecondaryButton
                            onClick={()=>setActive(1)} icon={<MapIcon/>}>
                               {t('map.view')}
                          </SecondaryButton>
                          <PrimaryButton
                            id={'addNew'}
                            onClick={createModal} icon={<AddIcon/>}>
                             {t('beehive.add')}
                          </PrimaryButton>
                        </div>
                        <div>
                           <BeezDataTable
                             items={beehives}
                             fields={fields}
                             fetched={apiariesFetched && beehivesFetched}
                             scopedSlots={{
                               'queen_color':
                                 (item) => (
                                   <td>
                                     <QueenSvg color={item.queen_color} />
                                   </td>
                                 ),
                               'actions':
                                 (item) => (
                                   <td>
                                     <a href={`#/beehives/${item.id}`}>
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
                </CTabPane>
                <CTabPane className='c-body'>
                    {active === 1 && (
                      <BeehiveMap
                        handleClick={handleClick}
                        position={position}
                        current={current}
                        apiaries={apiaries}
                        beehives={beehives}
                        apiaryActive={false}
                        beehiveActive={true}
                        createModal={createModal}
                        resetFormCreate={resetFormCreate}
                        showModal={showModal}
                        handleDelete={handleDelete}
                        setCurrent={setCurrent}
                        showTable={()=>setActive(0)}
                      />
                    )}
                </CTabPane>
            </CTabContent>
            </CTabs>
            <ModalComponent
                show={show}
                onHide={() => {
                    setShow(false);
                    dispatch({type: 'setErrors', errors:''});
                    resetFormCreate();
                }}
                title={current.id ? t('beehive.modal.update_title'): t('beehive.modal.create_title')}
                icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/> ) }
                loading={loadingModal}
                actions={
                    <>
                      <GreyButton
                        onClick={() => {current.id && removeSelectedStyle(current.id); setShow(false); resetFormCreate();}}>
                        {t('beehive.modal.cancel')}
                      </GreyButton>
                      <GreyButton
                        onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}}>
                          {t('beehive.modal.reset')}
                      </GreyButton>
                      <OrangeButton
                        id={'submit'}
                        onClick={() => {current.id ? changeBeehive(current.id) : createBeehive()}}>
                        {t('beehive.modal.submit')}
                      </OrangeButton>
                    </>
                }
            >
                <CCardBody>
                    <CFormGroup row>
                      <CCol md="12">
                        <PrimaryLabel htmlFor="apiary_id">{t('modal.beehive.apiary')}</PrimaryLabel>
                      </CCol>
                      <CCol xs="12" md="12">
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
                        <CCol md="12">
                            <PrimaryLabel htmlFor="name">{t('modal.beehive.name')}</PrimaryLabel>
                        </CCol>
                        <CCol xs="12" md="12">
                            <PrimaryInput
                                id="name"
                                name="name"
                                value={current.name !== null ? current.name : ''}
                                onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['name']?<CFormText className="help-block">{errorState.errors['name'][0]}</CFormText>:null}
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                          <CCol md='4'>
                              <PrimaryLabel htmlFor='longitude'>{t('modal.beehive.longitude')}</PrimaryLabel>
                          </CCol>
                          <CCol md='4'>
                            <PrimaryLabel htmlFor='latitude'>{t('modal.beehive.latitude')}</PrimaryLabel>
                          </CCol>
                          <CCol md='4'>
                            <PrimaryLabel htmlFor='altitude'>{t('modal.beehive.altitude')}</PrimaryLabel>
                          </CCol>
                          <CCol xs='4' md='4'>
                              <PrimaryInput id='longitude'
                                      name='longitude'
                                      type='number'
                                      value={current.longitude}
                                      onChange={(e) => changeState(e)}
                              />
                              {errorState.errors['longitude']?<CFormText className="help-block">{errorState.errors['longitude'][0]}</CFormText>:null}
                          </CCol>
                          <CCol xs='4' md='4'>
                              <PrimaryInput id='latitude'
                                      name='latitude'
                                      type='number'
                                      value={current.latitude}
                                      onChange={(e) => changeState(e)}
                              />
                              {errorState.errors['latitude']?<CFormText className="help-block">{errorState.errors['latitude'][0]}</CFormText>:null}
                          </CCol>
                          <CCol xs='4' md='4'>
                              <PrimaryInput id='altitude'
                                      name='altitude'
                                      type='number'
                                      value={current.altitude}
                                      onChange={(e) => changeState(e)}
                              />
                              {errorState.errors['altitude']?<CFormText className="help-block">{errorState.errors['altitude'][0]}</CFormText>:null}
                          </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='12'>
                            <PrimaryLabel htmlFor='description'>{t('modal.beehive.description')}</PrimaryLabel>
                        </CCol>
                        <CCol xs='12' md='12'>
                            <PrimaryTextarea
                                name='description'
                                id='description'
                                rows='5'
                                value={current.description !== null ? current.description : ''}
                                onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol md='6'>
                        <CFormGroup row>
                          <CCol md="12">
                            <PrimaryLabel htmlFor="num_honey_frames">{t('modal.beehive.honey_frames')}</PrimaryLabel>
                          </CCol>
                          <CCol xs="12" md="12">
                            <PrimaryInput
                              id="num_honey_frames"
                              name="num_honey_frames"
                              type = "number"
                              value={current.num_honey_frames !== null ? current.num_honey_frames : ''}
                              onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['num_honey_frames']?<CFormText className="help-block">{errorState.errors['num_honey_frames'][0]}</CFormText>:null}
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol md="12">
                            <PrimaryLabel htmlFor="num_pollen_frames">{t('modal.beehive.pollen_frames')}</PrimaryLabel>
                          </CCol>
                          <CCol xs="12" md="12">
                            <PrimaryInput
                              id="num_pollen_frames"
                              name="num_pollen_frames"
                              type = "number"
                              value={current.num_pollen_frames !== null ? current.num_pollen_frames : ''}
                              onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['num_pollen_frames']?<CFormText className="help-block">{errorState.errors['num_pollen_frames'][0]}</CFormText>:null}
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol md="12">
                            <PrimaryLabel htmlFor="num_brood_frames">{t('modal.beehive.brood_frames')}</PrimaryLabel>
                          </CCol>
                          <CCol xs="12" md="12">
                            <PrimaryInput
                              id="num_brood_frames"
                              name="num_brood_frames"
                              type = "number"
                              value={current.num_brood_frames !== null ? current.num_brood_frames : ''}
                              onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['num_brood_frames']?<CFormText className="help-block">{errorState.errors['num_brood_frames'][0]}</CFormText>:null}
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol md="12">
                            <PrimaryLabel htmlFor="num_empty_frames">{t('modal.beehive.empty_frames')}</PrimaryLabel>
                          </CCol>
                          <CCol xs="12" md="12">
                            <PrimaryInput
                              id="num_empty_frames"
                              name="num_empty_frames"
                              type = "number"
                              value={current.num_empty_frames !== null ? current.num_empty_frames : ''}
                              onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['num_empty_frames']?<CFormText className="help-block">{errorState.errors['num_empty_frames'][0]}</CFormText>:null}
                          </CCol>
                        </CFormGroup>
                      </CCol>
                      <CCol md='6'>
                          <CCol md='12'>
                            <PrimaryLabel htmlFor='altitude'>Select Location</PrimaryLabel>
                          </CCol>
                          <CCol style={{height:'100%'}} md='12'>
                              <Map
                                  center={current.latitude?[current.latitude,current.longitude]:position}
                                  zoom={17}
                                  style={{zIndex:0,borderRadius:'12px',height:'88%'}}
                                  doubleClickZoom={false}
                                  onClick={(e) => handleClickMiniMap(e)}
                              >
                                  <TileLayer
                                      onLoad={loadMap}
                                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                  />
                                  {beehives.map( item => item.id !== current.id &&(
                                      <Marker
                                          icon={apiaries[item.apiary_id]?.type_of_env==='urban'?blueIcon():redIcon()}
                                          key={item.id}
                                          position={[
                                              item.latitude,
                                              item.longitude
                                          ]}
                                      />)
                                  )}
                                  <Marker
                                      icon={apiaries[current.apiary_id]?.type_of_env==='urban'?blueIcon():redIcon()}
                                      draggable={true}
                                      key={current.id}
                                      position={[
                                          current.latitude,
                                          current.longitude
                                      ]}
                                      onDragend={(e) => updateMarker(e)}
                                  />
                                  {apiaries.map(apiary => apiary.id !== current.apiary_id && (
                                      apiary.area && <Polygon positions={apiary.area.coordinates[0].map(cord => [cord[1], cord[0]])} key={apiary.id} color='#F6BD60'/>
                                  ))}
                                  {apiaries.map(apiary => apiary.id === current.apiary_id && (
                                      apiary.area && <Polygon positions={apiary.area.coordinates[0].map(cord => [cord[1], cord[0]])} key={apiary.id} color="red"/>
                                  ))}
                                  <Search
                                      position="topright"
                                      inputPlaceholder="Location..."
                                      showMarker={false}
                                      zoom={13}
                                      closeResultsOnClick={true}
                                      openSearchOnLoad={false}
                                  />
                              </Map>
                          </CCol>
                      </CCol>
                      </CFormGroup>
                    <CFormGroup row>
                        <CCol md="12">
                            <PrimaryLabel htmlFor="type">{t('modal.beehive.type')}</PrimaryLabel>
                        </CCol>
                        <CCol xs="12" md="12">
                            <PrimaryInput
                                id="type"
                                name="type"
                                value={current.type !== null ? current.type : ''}
                                onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['type']?<CFormText className="help-block">{errorState.errors['type'][0]}</CFormText>:null}
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="12">
                            <PrimaryLabel htmlFor="source_of_swarm">{t('modal.beehive.source_of_swarm')}</PrimaryLabel>
                        </CCol>
                        <CCol xs="12" md="12">
                            <PrimaryInput
                                id="source_of_swarm"
                                name="source_of_swarm"
                                value={current.source_of_swarm !== null ? current.source_of_swarm : ''}
                                onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['source_of_swarm']?<CFormText className="help-block">{errorState.errors['source_of_swarm'][0]}</CFormText>:null}
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="6">
                          <PrimaryLabel htmlFor="queen_color">{t('modal.beehive.queen_color')}</PrimaryLabel>
                        </CCol>
                        <CCol md="6">
                          <PrimaryLabel htmlFor="installation_date">{t('modal.beehive.installation_date')}</PrimaryLabel>
                        </CCol>
                        <CCol xs="6" md="6">
                            <CInput type="color"
                                    id="queen_color"
                                    name="queen_color"
                                    value={current.queen_color}
                                    onChange={(e) => changeState(e)}
                            />
                            {errorState.errors['queen_color']?<CFormText className="help-block">{errorState.errors['queen_color'][0]}</CFormText>:null}
                        </CCol>
                        <CCol xs="6" md="6">
                            <DateInput
                                    id="installation_date"
                                    name="installation_date"
                                    value={current.installation_date}
                                    onChange={(e) => handleDayChange(e,'installation_date')}
                            />
                            {errorState.errors['installation_date']?<CFormText className="help-block">{errorState.errors['installation_date'][0]}</CFormText>:null}
                        </CCol>
                    </CFormGroup>
                </CCardBody>
            </ModalComponent>

            <DeleteModal
              text={popup.text}
              type={t('type.beehive')}
              handleDeleteTrue={handleDeleteTrue}
              handleDeleteFalse={handleDeleteFalse}
              show={popup.show}
            />

            <NotifyToaster toasts={toasts} header='You had changes in your beehives'/>
        </>
    )
}

export default Beehives
