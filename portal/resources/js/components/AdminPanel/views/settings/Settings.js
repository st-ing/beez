import React, {useState, useEffect} from 'react'
import {
  CCol,
  CInput,
  CRow,
  CInputGroup,
} from "@coreui/react";
import {Spinner} from "react-bootstrap";
import {addSetting, deleteSetting, getAllSettings, updateSetting} from "../../../../endpoints/SettingFunctions";
import {useDispatch, useSelector} from "react-redux";
import {getAllUsers} from "../../../../endpoints/UserFunctions";
import DeleteModal from "../../../DeleteModal";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";
import {
  CancelButton,
  DeleteButton,
  PrimaryButton,
  UpdateButton
} from "../../../buttons/Buttons";
import {useTranslation} from "react-i18next";
import PrimarySelect from "../../../select/Select";
import {DeleteIcon, SettingsIcon, UpdateIcon, XIcon} from "../../assets/icons/icons";

const Settings = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const errorState = useSelector(state => state.errorState)
  const [loadingRequest,setLoadingRequest] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [settings,setSettings] = useState([]);
  const [users,setUsers] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    id: null,
  });
  const [current,setCurrent] = useState({
    id: '',
    key: '',
    value: '',
    scope: '',
  });
  const [selectScope,setSelectScope] = useState([])

  const scopeOptions = (settings) => {
    let data = []

    let nullValue = {};
    nullValue.value = null;
    nullValue.label = 'System';
    nullValue.name = 'scope';
    data.push(nullValue)

    settings.map(item => {
        let setting = {};
        setting.value = item.id;
        setting.label = item.name;
        setting.name = 'scope';
        data.push(setting);
      }
    )
    setSelectScope(data);
  }

  //DataTable fields
  const fields = [
    { label: t('settings.key'), key: 'key',_style: { width: '40%' }, },
    { label: t('settings.value'), key: 'value' },
    { label: t('settings.scope'), key: 'scope' },
    { label: t('settings.actions'), key: 'actions',_style: { width: '10%' },sorter: false ,filter: false},
  ]

  //get all settings and users
  useEffect(() => {
    getAllSettings().then(data => {
      setSettings(Object.values(data));
      setLoadingPage(true);
    })
    getAllUsers().then(data => {
      setUsers(Object.values(data));
      scopeOptions(Object.values(data));
    })
  }, [])

  //create new row to add setting
  const createSettingRow = () => {
    setCurrent({
      id: '',
      key: '',
      value: '',
      scope: null,
    });
    setSettings(oldArray => [...oldArray, current]);
  }

  //select setting for edit
  const editSettingRow = id => {
    var setting = settings.filter(item => item.id === id)
    setCurrent({
      ...setting[0]
    });
  }

  //change input fields
  const changeState = (e) => {
    var { name, value} = e.target;
    setCurrent({
      ...current,
      [name]:value
    });
  }

  //add setting to db and concat it to list
  const createSetting = () => {
    setLoadingRequest(true);
    addSetting(current).then(res => {
      if (res.data) {
        const newList = settings.filter(item => item.id !== '').concat([res.data]);
        setSettings(newList);
        setLoadingRequest(false);
        dispatch({type: 'setErrors', errors: ''})
      } else {
        dispatch({type: 'setErrors', errors: res})
        setLoadingRequest(false);
      }
    })
  }

  //update selected setting
  const changeSettings = id => {
    setLoadingRequest(true);
    updateSetting(current,id).then(res => {
      if(res.data) {
        const newList = settings.map((item) => {
          if (item.id === id) {
            return current;
          }
          return item;
        });
        setSettings(newList);
        setLoadingRequest(false);
        resetForm();
      }else {
        dispatch({type: 'setErrors', errors:res})
        setLoadingRequest(false);
      }
    })
  }

  //open popUp
  const handleDelete = (id) => {
    setPopup({
      show: true,
      id,
    });
  };

  //remove setting and close popUp
  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      const newItems = (settings.filter(item => item.id !== popup.id));
      setSettings(newItems);
      deleteSetting(popup.id);
      setPopup({
        show: false,
        id: null,
      });
    }
  };

  //close popUp
  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: null,
    });
  };

  //remove row when creating setting
  const resetFormCreate = () => {
    setCurrent({
      id: '',
      key: '',
      value: '',
      scope: null,
    });
    dispatch({type: 'setErrors', errors:''})
    const newItems = (settings.filter(item => item.id !== ''));
    setSettings(newItems);
  }

  //stop changing selected setting
  const resetForm = () => {
    setCurrent({
      id: '',
      key: '',
      value: '',
      scope: null,
    });
    dispatch({type: 'setErrors', errors:''})
  }

  //change setting id and parse int
  const changeStateSelect = (e) => {
    setCurrent({
      ...current,
      [e.name]:parseInt(e.value)
    });
  }

  //return false if 0 and true if 1
  const returnValue = (item) => {
    if(item === '0'){
      return 'false';
    }
    if(item === '1'){
      return 'true';
    }
    return item;
  }

  return(
    <>
      <CRow>
        <CCol>
          <div>
            <div className="d-flex justify-content-end my-3">
              <PrimaryButton
                id={'createSettings'}
                onClick={createSettingRow} icon={<SettingsIcon/>}>
                  Create Settings
              </PrimaryButton>
            </div>
            <div>
              <BeezDataTable
                items={settings}
                fields={fields}
                fetched={loadingPage}
                scopedSlots={{
                  'key':
                    (item)=> (
                      current.id === item.id ?
                        (
                          <td style={{backgroundColor:'rgba(61, 64, 91, 1)'}}>
                            <CInputGroup>
                              <CInput id="key"
                                      name="key"
                                      value={current.id === item.id ?  current.key : item.key}
                                      onChange={(e) => changeState(e)}
                              />
                            </CInputGroup>
                            {errorState.errors['key'] && current.id === item.id ?
                              <small className="help-block">{errorState.errors['key'][0]}</small> : null}
                          </td>
                        ):(
                          <td>
                            <p className="pl-1 d-inline-block">{item.key}</p>
                          </td>
                        )
                    ),
                  'value':
                    (item)=> (
                      current.id === item.id ?
                        (
                          <td style={{backgroundColor:'rgba(61, 64, 91, 1)'}}>
                            <CInputGroup>
                              <CInput id="value"
                                      name="value"
                                      value={current.id === item.id ?  current.value : item.value}
                                      onChange={(e) => changeState(e)}
                              />
                            </CInputGroup>
                            {errorState.errors['value'] && current.id === item.id ?
                              <small className="help-block">{errorState.errors['value'][0]}</small> : null}
                          </td>
                        ):(
                          <td>
                            <p className="pl-1 d-inline-block">{returnValue(item.value)}</p>
                          </td>
                        )
                    ),
                  'scope':
                    (item)=> (
                      current.id === item.id ? (
                        <td style={{backgroundColor:'rgba(61, 64, 91, 1)'}}>
                          <PrimarySelect
                            classNamePrefix='styles'
                            name="scope"
                            id="scope"
                            value = {_.find(selectScope, ['value', current.scope])}
                            onChange={(e) => changeStateSelect(e)}
                            options={selectScope}
                          />
                          {errorState.errors['scope'] && current.id === item.id ?
                            <small className="help-block">{errorState.errors['scope'][0]}</small> : null}
                        </td>
                      ):(
                        <td>
                          <p className="pl-1 d-inline-block">{(users.find(user => user.id === item.scope))?users.find(user => user.id === item.scope).name : 'System'}</p>
                        </td>
                      )
                    ),
                  'actions':
                    (item) => (
                      current.id !== item.id ? (
                        <td>
                          <UpdateButton
                            onClick={() => editSettingRow(item.id)}
                            title='Update' icon={<UpdateIcon/>}>
                          </UpdateButton>
                          <DeleteButton
                            onClick={() => handleDelete(item.id)}
                            title='Delete' icon={<DeleteIcon/>}>
                          </DeleteButton>
                        </td>
                      ):(
                        !loadingRequest ? (
                          <td style={{backgroundColor:'rgba(61, 64, 91, 1)'}}>
                            <UpdateButton
                              onClick={() => current.id ? changeSettings(current.id) : createSetting()}
                              title='Create' icon={<UpdateIcon/>}/>
                            <CancelButton
                              onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}}
                              title='Delete' icon={<XIcon/>}/>
                          </td>
                        ) : (
                          <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="warning"/>
                          </div>
                        )
                      )
                    ),
                }}
                />
            </div>
          </div>
        </CCol>
      </CRow>

      <DeleteModal
        handleDeleteTrue={handleDeleteTrue}
        handleDeleteFalse={handleDeleteFalse}
        show={popup.show}
      />

    </>
  )
}
export default Settings
