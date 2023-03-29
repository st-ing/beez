import React, {useEffect, useState} from 'react'
import {
  CCardBody,
  CCol,
  CFormGroup,
  CFormText,
  CSwitch,
  CTabContent,
  CTabPane,
  CTabs,
} from '@coreui/react'
import {addApiary, deleteApiary, getApiaries, updateApiary} from '../../../../endpoints/ApiaryFunctions';
import CIcon from '@coreui/icons-react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import ModalComponent from "../../../Modal";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable"
import {FeatureGroup, Map, Polygon, TileLayer} from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import Search from "react-leaflet-search";
import {getPolygonCenter, getPositionOfPolygons} from "../../../Utilities/helpers";
import DeleteModal from "../../../DeleteModal";
import NotifyToaster from "../../../NotifyToaster";
import {getBeehives} from "../../../../endpoints/BeehiveFunctions";
import {
  DeleteButton,
  DetailButton, GreyButton, OrangeButton,
  PrimaryButton,
  SecondaryButton,
  UpdateButton
} from "../../../buttons/Buttons";
import PrimaryInput, {PrimaryLabel, PrimaryTextarea} from "../../../inputs/Inputs";
import {ApiaryMap} from "../../../BeezMap";
import {AddIcon, DeleteIcon, DetailedIcon, MapIcon, UpdateIcon} from "../../assets/icons/icons";
import PrimarySelect from "../../../select/Select";
const Apiaries = () => {
  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const loggedUser = useSelector(state => state.userLogged)
  const apiaries = useSelector(state => state.apiaryState.apiaries)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const fetched = useSelector(state => state.apiaryState.fetched)
  const errorState = useSelector(state => state.errorState)
  const [loadingModal,setLoadingModal] = useState(false);
  const [active, setActive] = useState(0)
  const [position,setPosition] = useState([0,0]);
  const [show,setShow] = useState(false);
  const [editableFG, setEditableFG] = useState(null);
  const [current,setCurrent] = useState({
    id: '',
    name: '',
    migrate: '',
    owner_id: '',
    address: '',
    area: null,
    db_shape:'',
    altitude: '',
    description: '',
    type_of_env: '',
    flora_type: '',
    sun_exposure: '',
    created_at: '',
    updated_at: ''
  });
  const [popup, setPopup] = useState({
    show: false,
    id: null,
    text:'',
  });
  const [toasts, setToasts] = useState([])

  //Add selected style
  const addSelectedStyle = id => {
    const newList = apiaries.map((item) => {
      if (item.id === id) {
        item._classes = 'bg-warning'
        return item;
      }
      return item;
    });
    dispatch({type: 'setApiaries',apiaries:newList})
  }

  //remove Selected Style
  const removeSelectedStyle = id => {
    const newList = apiaries.map((item) => {
      if (item.id === id) {
        item._classes = ''
        return item;
      }
      return item;
    });
    dispatch({type: 'setApiaries',apiaries:newList})
  }

  //returns translated sun exposure based on language
  const getSunExposure = exposure => {
    switch (exposure) {
      case 'low': return t('apiary.sun_exposure_low')
      case 'medium': return t('apiary.sun_exposure_medium')
      case 'high': return t('apiary.sun_exposure_high')
    }
  }

  //returns translated env type based on language
  const getEnvType = env => {
    switch (env) {
      case 'natural': return t('apiary.natural')
      case 'urban': return t('apiary.urban')
      case 'agriculture': return t('apiary.agriculture')
      case 'other': return t('apiary.other')
    }
  }

  //adding new toast with given parameters
  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:false, closeButton:true, fade:true,content:data}
    ])
  }

  //DataTable fields
  const fields = [
    { key: 'name', label: t('apiary.name') },
    { key: 'address', label: t('apiary.address') },
    { key: 'description', label: t('apiary.description')},
    { key: 'migrate', label: t('apiary.migrate') },
    { key: 'flora_type', label: t('apiary.flora_type') },
    { key: 'sun_exposure', label: t('apiary.sun_exposure') },
    { key: 'type_of_env', label: t('apiary.type_of_env') },
    { key: 'actions', label: t('apiary.actions'), _style: {width:'120px'}, sorter: false ,filter: false },
  ]

  const optionsEnv = [
    { value: 'natural', label: t('apiary.natural'),name:'type_of_env'},
    { value: 'urban', label: t('apiary.urban'),name:'type_of_env'},
    { value: 'agriculture', label: t('apiary.agriculture'),name:'type_of_env'},
    { value: 'other', label: t('apiary.other'),name:'type_of_env'},
  ]

  const optionsSunExposure = [
    { value: 'low', label: t('apiary.sun_exposure_low'),name:'sun_exposure'},
    { value: 'medium', label: t('apiary.sun_exposure_medium'),name:'sun_exposure'},
    { value: 'high', label: t('apiary.sun_exposure_high'),name:'sun_exposure'},
  ]

  useEffect(() => {
    //if apiaries are not fetched fetch them and store in redux apiaries
    if(!fetched) {
      getApiaries(loggedUser.id).then(data => {
        dispatch({type: 'setApiaries', apiaries: Object.values(data), fetched: true})
        setPosition(getPositionOfPolygons(Object.values(data)));
      })
    }
    setPosition(getPositionOfPolygons(apiaries));
    if (!beehivesFetched) {
      getBeehives(loggedUser.id).then(data => {
        dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
      })
    }
  } ,[])

  //DELETE APIARY FUNCTIONS

  //open popUp for delete
  const handleDelete = (current) => {
    addSelectedStyle(current.id);
    setPopup({
      show: true,
      id:current.id,
      text:current.name
    });
  };

  //delete apiary with selected id and close popUp
  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      const newItems = (apiaries.filter(item => item.id !== popup.id));
      dispatch({type: 'setApiaries',apiaries:newItems})
      deleteApiary(popup.id);
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

  //EDIT APIARY FUNCTIONS

  //update apiary, if successful either add apiary or show toaster that table is not synced.
  //if not show errors for missing fields
  const changeApiary = id => {
    setLoadingModal(true);
    updateApiary(current,id).then(res => {
      if(res.data) {
        if(res.data === 404){
          getApiaries(loggedUser.id).then(data => {
            dispatch({type: 'setApiaries', apiaries: Object.values(data), fetched: true})
            setPosition(getPositionOfPolygons(Object.values(data)));
            setLoadingModal(false);
            setShow(false);
            dispatch({type: 'setErrors', errors:''})
            addToast(
              <p>
                <label className='pr-1'>We got you the latest changes, update your apiary now!</label>
              </p>
            );
          })
        }else{
          const newList = apiaries.map((item) => {
            if (item.id === id) {
              return res.data;
            }
            return item;
          });
          dispatch({type: 'setApiaries',apiaries:newList})
          setLoadingModal(false);
          setShow(false);
          dispatch({type: 'setErrors', errors:''})
        }
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  //open modal for editing of selected apiary
  const showModal = id => {
    addSelectedStyle(id)
    setShow(true);
    var apiary = apiaries.filter(item => item.id === id)
    let db_shape = JSON.stringify(apiary[0].area);
    setCurrent({
      ...apiary[0],
      db_shape: db_shape
    });
  }

  //change state of input fields
  const changeState = (e) => {
    var { name, value} = e.target;
    setCurrent({
      ...current,
      [name]:value
    });
  }
  const changeStateSelect = (e) => {
    setCurrent({
      ...current,
      [e.name]:e.value
    });
  }


  //change state of checkbox fields
  const changeCheckBox = (e) => {
    var { name, value ,type , checked } = e.target;
    const checkbox = type === 'checkbox' ? checked : value;
    setCurrent({
      ...current,
      [name]:checkbox
    });
  }

  //CREATE APIARY FUNCTIONS

  //open blank modal for creating new apiary
  const createModal = () => {
    setCurrent({
      id: '',
      name: '',
      migrate: false,
      owner_id: '',
      address: '',
      area: null,
      db_shape:null,
      altitude: '',
      description: '',
      type_of_env: 'natural',
      flora_type: '',
      sun_exposure: 'low',
      created_at: '',
      updated_at: ''
    });
    setShow(true);
  }

  //adding new apiary, if true add apiary to redux state, if not show errors
  const createApiary = () => {
    setLoadingModal(true);
    var currentApiary = {...current};
    currentApiary.owner_id = loggedUser.id;
    setCurrent(currentApiary);
    addApiary(currentApiary).then(res => {
      if(res.data){
        const newList = apiaries.concat([res.data]);
        dispatch({type: 'setApiaries',apiaries:newList})
        setLoadingModal(false);
        setShow(false);
        dispatch({type: 'setErrors', errors:''})
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingModal(false);
      }
    })
  }

  //reset form when editing apiary, initial state without changes
  const resetForm = (id) => {
    var apiary = apiaries.filter(item => item.id === id)
    setCurrent(apiary[0]);
    dispatch({type: 'setErrors', errors:''})
  }

  //reset form when creating apiary
  const resetFormCreate = (id) => {
    setCurrent({
      id: '',
      name: '',
      migrate: false,
      owner_id: '',
      address: '',
      area: {},
      db_shape:'',
      altitude: '',
      description: '',
      type_of_env: 'natural',
      flora_type: '',
      sun_exposure: 'low',
      created_at: '',
      updated_at: ''
    });
    dispatch({type: 'setErrors', errors:''})
  }

  const loadMap = (event) => {
    event.target._map.invalidateSize(true);
  }

  //function to delete current layer when new is created
  const deleteLayer = () => {
    if(editableFG) {
      const drawnItems = editableFG.leafletElement._layers;
      if (Object.keys(drawnItems).length > 1) {
        Object.keys(drawnItems).forEach((layerid, index) => {
          if (index > 0) return;
          const layer = drawnItems[layerid];
          editableFG.leafletElement.removeLayer(layer);
        });
      }
    }
  }

  //editing apiary on miniMap
  const _onEditedMiniMap = (e) => {
    e.layers.eachLayer((layer) => {
      let area = layer.toGeoJSON();
      let db_shape = JSON.stringify(area);
      setCurrent({
        ...current,
        area: area.geometry,
        db_shape: db_shape
      })
    })
  }

  //creating new apiary on miniMap
  const _onCreatedMiniMap = (e) => {
    let layer = e.layer;
    let area = layer.toGeoJSON()
    let db_shape = JSON.stringify(area);
    setCurrent({
      ...current,
      area: area.geometry,
      db_shape: db_shape
    })
    deleteLayer();
  }

  //grouping all apiaries layers for easier manipulation
  const onFeatureGroupReady = reactFGref => {
    if(reactFGref)
    {
      setEditableFG(reactFGref);
    }
  }
  const getCenter = () => {
    if(current.area)
      return getPolygonCenter(current.area.coordinates[0])
    else
      return position
  }
  return (
    <>
      <CTabs activeTab={active} onActiveTabChange={idx => setActive(idx)} className='c-body'>
        <CTabContent className='c-body'>
          <CTabPane >
            <div className='my-3' >
              <div className='d-flex justify-content-end my-3'>
                  <SecondaryButton
                    onClick={()=>setActive(1)} icon={<MapIcon/>}>
                      {t('map.view')}
                  </SecondaryButton>
                  <PrimaryButton
                    id={'addNew'}
                    onClick={createModal} icon={<AddIcon/>}>
                       {t('apiary.add')}
                  </PrimaryButton>
              </div>
              <div>
                <BeezDataTable
                  items={apiaries}
                  fields={fields}
                  fetched={fetched}
                  scopedSlots={{
                    'name' :
                      (item) => (
                        <td>
                          {item.name}
                        </td>
                      ),
                    'address':
                      (item) => (
                        <td>
                          {item.address}
                        </td>
                      ),
                    'description':
                      (item) => (
                        // item.id===current.id?
                        // (
                        //   <td style={{backgroundColor:"blue"}}>
                        //     {item.description?`${item.description.slice(0, 20)}...`:""}
                        //   </td>
                        // ):
                        // (
                          <td>
                            {item.description?`${item.description.slice(0, 20)}...`:""}
                          </td>
                        // )
                      ),
                    'sun_exposure':
                      (item)=>(
                        <td>
                          {getSunExposure(item.sun_exposure)}
                        </td>
                      ),
                    'type_of_env':
                      (item)=>(
                        <td>
                          {getEnvType(item.type_of_env)}
                        </td>
                      ),
                    'migrate':
                      (item)=>(
                        <td>
                          {item.migrate ? t('apiary.yes') : t('apiary.no')}
                        </td>
                      ),
                    'actions':
                      (item)=>(
                        <td style={{verticalAlign:'middle'}}>
                          <a href={`#/apiaries/${item.id}`}>
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
          <CTabPane className='c-body' >
            {active === 1 && (
              <div className='c-body'>
                <ApiaryMap
                  position={position}
                  current={current}
                  apiaries={apiaries}
                  beehives={beehives}
                  apiaryActive={true}
                  beehiveActive={false}
                  createModal={createModal}
                  resetFormCreate={resetFormCreate}
                  showModal={showModal}
                  handleDelete={handleDelete}
                  setCurrent={setCurrent}
                  setTableView={()=>setActive(0)}
                />
            </div>
            )}
          </CTabPane>
        </CTabContent>
      </CTabs>

      <DeleteModal
        text={popup.text}
        type= {t('type.apiary')}
        handleDeleteTrue={handleDeleteTrue}
        handleDeleteFalse={handleDeleteFalse}
        show={popup.show}
      />

      <ModalComponent
        show={show}
        corner={true}
        onHide={() => {
          setShow(false);
          resetFormCreate();
        }}
        title={current.id ? t('apiary.model_update_title'): t('apiary.model_create_title' )}
        icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/> ) }

        loading={loadingModal}
        actions={
          <>
            <GreyButton
              onClick={() => {current.id && removeSelectedStyle(current.id); setShow(false); resetFormCreate(); }}>
              {t('apiary.model_cancel')}
            </GreyButton>
            <GreyButton
              onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}} >
                {t('apiary.model_reset')}
            </GreyButton>
            <OrangeButton
              id={'submit'}
              onClick={() => {current.id ? changeApiary(current.id) : createApiary()}} >
              {t('apiary.model_submit')}
            </OrangeButton>
          </>
        }
      >
        <CCardBody>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='name'>{t('apiary.name')}</PrimaryLabel>
            </CCol>
            <CCol xs='12'>
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
            <CCol md='9'>
              <PrimaryLabel htmlFor='address'>{t('apiary.address')}</PrimaryLabel>
            </CCol>
            <CCol md='3'>
              <PrimaryLabel htmlFor='altitude'>{t('apiary.altitude')}</PrimaryLabel>
            </CCol>
            <CCol xs='9' >
              <PrimaryInput
                 id='address'
                 name='address'
                 value={current.address !== null ? current.address : ''}
                 onChange={(e) => changeState(e)}
              />
              {errorState.errors['address']?<CFormText className="help-block">{errorState.errors['address'][0]}</CFormText>:null}
            </CCol>
            <CCol xs='3'>
              <PrimaryInput id='altitude'
                      name='altitude'
                      type='number'
                      value={current.altitude !== null ? current.altitude : ''}
                      onChange={(e) => changeState(e)}
              />
              {errorState.errors['altitude']?<CFormText className="help-block">{errorState.errors['altitude'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='12'>
              <PrimaryLabel htmlFor='description'>{t('apiary.description')}</PrimaryLabel>
            </CCol>
            <CCol xs='12' md='12'>
              <PrimaryTextarea
                name='description'
                id='description'
                rows='3'
                value={current.description !== null ? current.description : ''}
                onChange={(e) => changeState(e)}
              />
              {errorState.errors['description']?<CFormText className="help-block">{errorState.errors['description'][0]}</CFormText>:null}
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol md='6'>
                <CFormGroup row>
                <CCol md='12'>
                  <PrimaryLabel htmlFor='flora_type'>{t('apiary.flora_type')}</PrimaryLabel>
                </CCol>
                <CCol md='12'>
                  <PrimaryInput id='flora_type'
                          name='flora_type'
                          value={current.flora_type !== null ? current.flora_type : ''}
                          onChange={(e) => changeState(e)}
                  />
                  {errorState.errors['flora_type']?<CFormText className="help-block">{errorState.errors['flora_type'][0]}</CFormText>:null}
                </CCol>
                </CFormGroup>
                <CFormGroup row>
                <CCol md='12'>
                  <PrimaryLabel htmlFor='type_of_env'>{t('apiary.type_of_env')}</PrimaryLabel>
                </CCol>
                <CCol md='12'>
                  <PrimarySelect
                    classNamePrefix='styles'
                    id='type_of_env'
                    name='type_of_env'
                    value={_.find(optionsEnv, ['value', current.type_of_env])}
                    onChange={(e) => changeStateSelect(e)}
                    options={optionsEnv}
                  >
                  </PrimarySelect>
                  {errorState.errors['type_of_env']?<CFormText className="help-block">{errorState.errors['type_of_env'][0]}</CFormText>:null}
                </CCol>
                </CFormGroup>
                <CFormGroup row>
                <CCol md='12'>
                  <PrimaryLabel htmlFor='sun_exposure'>{t('apiary.sun_exposure')}</PrimaryLabel>
                </CCol>
                <CCol md='12'>
                  <PrimarySelect
                    classNamePrefix='styles'
                    id='sun_exposure'
                    name='sun_exposure'
                    value={_.find(optionsSunExposure, ['value', current.sun_exposure])}
                    onChange={(e) => changeStateSelect(e)}
                    options={optionsSunExposure}
                  >
                  </PrimarySelect>
                  {errorState.errors['sun_exposure']?<CFormText className="help-block">{errorState.errors['sun_exposure'][0]}</CFormText>:null}
                </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='12'>
                    <PrimaryLabel htmlFor='migrate'>{t('apiary.migrate')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='12' md='12'>
                    <CSwitch className={'mx-1'}
                             shape={'pill'}
                             color={'warning'}
                             name='migrate'
                             checked={current.migrate}
                             onChange={(e) => changeCheckBox(e)}
                    />
                    {errorState.errors['migrate']?<CFormText className="help-block">{errorState.errors['migrate'][0]}</CFormText>:null}
                  </CCol>
                </CFormGroup>
            </CCol>
            <CCol md='6'>
              <Map
                center={current.id? getCenter():position}
                zoom={14}
                style={{borderRadius:'12px',height:'100%'}}
                doubleClickZoom={false}
              >
                <TileLayer
                  onLoad={loadMap}
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <FeatureGroup ref={featureGroupRef => {
                  onFeatureGroupReady(featureGroupRef);
                }}>
                  <EditControl
                    position='topleft'
                    onEdited={_onEditedMiniMap}
                    onCreated={_onCreatedMiniMap}
                    draw={{
                      rectangle: false,
                      polyline:false,
                      circle:false,
                      circlemarker:false,
                      marker: false,
                    }}
                    edit={{
                      remove: false,
                    }}
                  />
                  {current.area?.coordinates && <Polygon positions={current.area.coordinates[0].map(cord => [cord[1], cord[0]])} key={Math.random()} color='red' />}
                </FeatureGroup>
                {apiaries.map((apiary) =>
                  (apiary.id !== current.id ) &&
                  apiary.area && (<Polygon color='#F6BD60' positions={apiary.area.coordinates[0].map(cord => [cord[1], cord[0]])} key={apiary.id}/>)
                )}
                <Search
                  position="topright"
                  inputPlaceholder="Location..."
                  showMarker={false}
                  zoom={13}
                  closeResultsOnClick={true}
                  openSearchOnLoad={false}
                />
              </Map>
              {errorState.errors['db_shape']?<CFormText className="help-block">Please draw your apiary area</CFormText>:null}
            </CCol>
          </CFormGroup>
        </CCardBody>
      </ModalComponent>

      <NotifyToaster toasts={toasts} header='You had changes in your apiaries'/>
    </>
  )
}

export default Apiaries
