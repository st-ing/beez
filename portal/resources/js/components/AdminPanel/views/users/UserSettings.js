import React, {useState, useEffect} from 'react'
import {
  CCol,
  CFormGroup,
  CInputGroup,
  CCardBody,
  CButton,
  CCard,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CRow,
} from '@coreui/react'
import './users.css';
import {
  changePassword, getAllUsers,
  getSelectedUser,
  updateUser,
  uploadImage
} from "../../../../endpoints/UserFunctions";
import CIcon from "@coreui/icons-react";
import {freeSet} from "@coreui/icons";
import {Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {GreyButton, OrangeButton, SecondaryButton} from "../../../buttons/Buttons";
import PrimaryInput, {
  PrimaryLabel,
  DateInput,
  PasswordInput
} from "../../../inputs/Inputs";
import {getImage, getSetting} from "../../../Utilities/helpers";
import styled from "styled-components";
import ModalComponent from "../../../Modal";
import {getAllSettings} from "../../../../endpoints/SettingFunctions";
const SettingsCard = styled(CCard)`
    background-color: #f8f8fb;
    border-radius: 6px;
    border:none;
  `;
const SettingsRow = styled(CRow)`
    padding-bottom: 1rem;
  `;
const PictureRow = styled(CRow)`
    padding-bottom: 1rem;
    padding-top: 1rem;
  `;
const SettingsInformation = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #3D405B;
    opacity: 0.4;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(61, 64, 91, 0.4);
    margin-bottom: 2rem;
  `
const SettingsHeader = styled.div`
    font-size: 14px;
    color: #3D405B;
    opacity: 0.4;
  `
const UsernameDiv = styled.div`
  font-size: 20px;
  color: #3D405B;
  `
const SettingsText = styled.div`
  font-size: 14px;
  color: #3D405B;
  `
const UserCard = styled.div`
  background: #FFFFFF;
  border-radius: 5px;
  margin: 0.5rem !important;
  // margin-top: 0.5rem !important;
  // margin-bottom: 0.5rem !important;
  position: relative;
  display: flex;
  flex-direction: row;
  min-width: 0;
  background-color: #fff;
`
const ManagementTitle = styled.div`
  font-size: 22px;
  margin: 1.5rem !important;
  color: #3D405B;
  letter-spacing: -0.02em;
`
const ManagementSpan = styled.span`
  color: #3D405B;
  font-size: 14px;
  letter-spacing: -0.02em;
  margin-left: 0.25rem !important
  margin-top: auto !important;
  margin-bottom: auto !important;
`
const UserSettings = () => {
  const{t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const errorState = useSelector(state => state.errorState)
  const loggedUser = useSelector(state => state.userLogged);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_confirm_password: ''
  });
  const [toasts, setToasts] = useState([])
  const [image,setImage] = useState(null);
  const [showChangePassword,setShowChangePassword] = useState(false);
  const [loadingModal,setLoadingModal] = useState(false);
  const [showUserSettings,setShowUserSettings] = useState(false)
  const [setting,setSetting] = useState();
  const toasters = (()=>{
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || []
      toasters[toast.position].push(toast)
      return toasters
    }, {})
  })()

  const toastContent = {
    changePassword: 'Your password is changed successfully',
    changeSettings: 'You are successfully updated your settings'
    ,
  }

  //add toaster with given parameters
  const addToast = (data) => {
    setToasts([
      ...toasts,
      { position:'top-right', autohide:2000, closeButton:true, fade:true,content:data}
    ])
  }

  useEffect(() => {
    getAll();
  }, [])

  //get selected user and image of user
  const getAll = () => {
    getSelectedUser(loggedUser.id).then(data => {
      setCurrent(data);
      setImage(getImage(data));
      getAllUsers().then(data => {
        setUsers(Object.values(data));
      })
      getAllSettings().then(data => {
        setSetting(getSetting('ui.user_communities',Object.values(data),loggedUser.id));
        setLoadingPage(true);
      })
    })

  }

  //change input fields
  const changeState = (e) => {
    var {name, value} = e.target;
    setCurrent({
      ...current,
      [name]: value
    });
  }

  //change password fields
  const changeStatePasswords = (e) => {
    var {name, value} = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  }

  //edit user, change image and add toast for successfully edited
  const changeUser = id => {
    setLoadingModal(true)
    // const fd = new FormData();
    // fd.append('image',selectedFile);
    // uploadImage(fd,id);
    updateUser(current, id).then(res => {
      if (res.data) {
        setCurrent(res.data);
        // let image = getImage(res.data)
        // setImage(image);
        dispatch({
          type: 'setLogin',
          id:res.data.id,
          name: res.data.name,
          email:res.data.email,
          role: res.data.role,
          // image:image,
          address:res.data.address,
          created_at:res.data.created_at,
          updated_at:res.data.updated_at
        });
        addToast(toastContent.changeSettings)
        setLoadingModal(false)
        dispatch({type: 'setErrors', errors: ''});
        setShowUserSettings(false);
      } else {
        dispatch({type: 'setErrors', errors: res})
        setLoadingModal(false);
      }
    })
  }

  //show selected image
  const fileSelectHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      const fd = new FormData();
      fd.append('image',img);
      uploadImage(fd,loggedUser.id).then(res => {
        let image = getImage(res.data)
        setImage(image);
        dispatch({
          type: 'setLogin',
          id:res.data.id,
          name: res.data.name,
          email:res.data.email,
          role: res.data.role,
          image:image,
          address:res.data.address,
          created_at:res.data.created_at,
          updated_at:res.data.updated_at
        });
      });
      // setImage(URL.createObjectURL(img));
    }
  }

  //change password and add toast if it is successful or not
  const ChangePassword = () => {
    setLoading(false);
    changePassword(passwords).then(res => {
      if (res.data) {
        setPasswords({
          current_password: '',
          new_password: '',
          new_confirm_password: ''
        })
        addToast(toastContent.changePassword);
        setLoading(true)
        dispatch({type: 'setErrors', errors: ''});
      } else {
        setLoading(true)
        dispatch({type: 'setErrors', errors: res})
      }
    })
  }

  //collapse password fields and clean them
  const Stop = () => {
    setPasswords({
      current_password: '',
      new_password: '',
      new_confirm_password: ''
    })
    dispatch({type: 'setErrors', errors: ''});
  }

  const ResetCurrentUser = () => {
    setCurrent({
      id: loggedUser.id,
      name: loggedUser.name,
      address: loggedUser.address,
      role: loggedUser.role,
      image:loggedUser.image,
      email: loggedUser.email,
      created_at: loggedUser.created_at,
      updated_at: loggedUser.updated_at
    });
    dispatch({type: 'setErrors', errors:''})
  }

  return (
    <>
      {loadingPage ? (
          <>
            <SettingsCard>
              <CRow className='pl-5 pr-1 py-3'>
                <CCol md='2'>
                  <PictureRow>
                  <div className="avatar-upload">
                    <div className="avatar-edit">
                      <input
                        type="file"
                        name='imageUpload'
                        id='imageUpload'
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => fileSelectHandler(e)}
                      />
                      <label htmlFor="imageUpload">
                        <CIcon content={freeSet.cilPencil}/>
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div id="imagePreview"
                           style= {{backgroundImage: `url(${image})`}}
                      >
                      </div>
                    </div>
                  </div>
                  </PictureRow>
                  <SettingsRow className='justify-content-center'>
                    <UsernameDiv>
                      {loggedUser.name? loggedUser.name : ''}
                    </UsernameDiv>
                  </SettingsRow>
                </CCol>
                <CCol className='pl-5' md='7'>
                  <SettingsInformation>
                    {t('personal.informations')}
                  </SettingsInformation>
                  <SettingsRow>
                    <CCol>
                      <SettingsHeader>
                        {t('user.address')}
                      </SettingsHeader>
                      <SettingsText>
                        {loggedUser.address? loggedUser.address : ''}
                      </SettingsText>
                    </CCol>
                    <CCol>
                      <SettingsHeader>
                        {t('user.email')}
                      </SettingsHeader>
                      <SettingsText>
                        {loggedUser.email? loggedUser.email : ''}
                      </SettingsText>
                    </CCol>
                  </SettingsRow>
                  <SettingsRow>
                    <CCol>
                      <SettingsHeader>
                        {t('user.created')}
                      </SettingsHeader>
                      <SettingsText>
                        {loggedUser.created_at? moment(loggedUser.created_at).format("YYYY-MM-DD") : ''}
                      </SettingsText>
                    </CCol>
                    <CCol>
                      <SettingsHeader>
                        {t('user.updated')}
                      </SettingsHeader>
                      <SettingsText>
                        {loggedUser.updated_at? moment(loggedUser.updated_at).format("YYYY-MM-DD") : ''}
                      </SettingsText>
                    </CCol>
                  </SettingsRow>
                </CCol>
                <CCol md='3'>

                  <SettingsRow className='flex-md-nowrap mr-2'>
                    <SecondaryButton id={'editProfile'} className='m-1' style={{width:'120px'}} onClick={() => setShowUserSettings(true)} > {t('edit.profile')} </SecondaryButton>
                    <SecondaryButton id={'changePassword'} className='m-1' onClick={() => setShowChangePassword(true)} > {t('change.password')} </SecondaryButton>
                  </SettingsRow>
                </CCol>
              </CRow>
            </SettingsCard>
            {
              (setting==='false' || setting==='0' || !setting)?
                (
                  <>
                  </>
                ):
                (
                  <SettingsCard>
                    <ManagementTitle>{t('user.communities')}</ManagementTitle>
                    <CRow className='px-4 py-3'>
                        {users.map(user => (
                          <CCol key={user.id} md='3' className='p-0'>
                            <UserCard>
                              <div className="c-avatar mx-2 my-auto">
                                {user.image ? (
                                  <div id="imagePreview"
                                       style={{backgroundImage: `url(${getImage(user)})`}}
                                  >
                                  </div>
                                ) : (
                                  <div id="imagePreview"
                                       style={{backgroundColor: "#f8f8fb"}}
                                  >
                                  </div>
                                )}
                              </div>
                              <ManagementSpan className='mx-1 my-auto'>{user.name}</ManagementSpan>
                              <CButton className='bg-secondary ml-auto my-2 mr-2' onClick={() => console.log('message')} ><CIcon name='yellow-message-icon'/> </CButton>
                            </UserCard>
                          </CCol>
                        ))
                        }
                    </CRow>
                  </SettingsCard>
                )
            }
            <ModalComponent
              show={showChangePassword}
              size={'md'}
              onHide={() => {
                setShowChangePassword(false);
              }}
              title={t('change.password')}
              icon={<CIcon name='edit-icon' width={20}/>}
              loading={!loading}
              actions={
                <>
                  <GreyButton
                           onClick={() => {setShowChangePassword(false); Stop();}}
                  >
                    {t('apiary.model_cancel')}
                  </GreyButton>
                  <GreyButton
                    onClick={() => Stop()}
                  >
                    {t('apiary.model_reset')}
                  </GreyButton>
                  <OrangeButton
                    id={'submit'}
                    onClick={() => ChangePassword(current)}
                  >
                    {t('apiary.model_submit')}
                  </OrangeButton>
                </>
              }
            >
              <CCardBody>
                <CFormGroup row>
                  <CCol md='12'>
                    <PrimaryLabel htmlFor='current_password'>{t('user.current.password')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='12' md='12'>
                        <PasswordInput type="password"
                                   id="current_password"
                                   name="current_password"
                                   value={passwords.current_password}
                                   onChange={(e) => changeStatePasswords(e)}/>
                    {errorState.errors['current_password'] ?
                      <small className="help-block">{errorState.errors['current_password'][0]}</small> : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='12' >
                    <PrimaryLabel htmlFor='new_password'>{t('user.new.password')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='12' md='12'>
                      <PasswordInput type="password"
                              id="new_password"
                              name="new_password"
                              value={passwords.new_password}
                              onChange={(e) => changeStatePasswords(e)}
                      />
                    {errorState.errors['new_password'] ?
                      <small className="help-block">{errorState.errors['new_password'][0]}</small> : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md='12'>
                    <PrimaryLabel htmlFor='new_confirm_password'>{t('user.confirm.password')}</PrimaryLabel>
                  </CCol>
                  <CCol xs='12' md='12'>
                      <PasswordInput type="password"
                              id="new_confirm_password"
                              name="new_confirm_password"
                              value={passwords.new_confirm_password}
                              onChange={(e) => changeStatePasswords(e)}
                      />

                    {errorState.errors['new_confirm_password'] ? <small className="help-block">{errorState.errors['new_confirm_password'][0]}</small> : null}
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </ModalComponent>
            <ModalComponent
              show={showUserSettings}
              onHide={() => {
                setShowUserSettings(false);
              }}
              title={t('sidebar.user.settings')}
              icon={<CIcon name='edit-icon' width={20}/>}
              loading={loadingModal}
              actions={
                <>
                  <GreyButton
                           onClick={() => {
                             setShowUserSettings(false);
                             ResetCurrentUser();
                             }}
                  >
                    {t('apiary.model_cancel')}
                  </GreyButton>
                  <GreyButton
                           onClick={() => ResetCurrentUser()}
                  >
                    {t('apiary.model_reset')}
                  </GreyButton>
                  <OrangeButton
                    id={'submit'}
                    onClick={() =>
                      changeUser(current.id)
                    }
                  >
                    {t('apiary.model_submit')}
                  </OrangeButton>
                </>
              }
            >
              <CCardBody>
                  <CFormGroup row>
                    <CCol md='6'>
                      <PrimaryLabel htmlFor='name'>{t('user.name')}</PrimaryLabel>
                    </CCol>
                    <CCol md='6'>
                      <PrimaryLabel htmlFor='address'>{t('user.address')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='6' md='6'>
                      <CInputGroup>
                        <PrimaryInput id="name"
                                name="name"
                                value={current.name !== null ? current.name : ''}
                                onChange={(e) => changeState(e)}
                        />
                      </CInputGroup>
                      {errorState.errors['name'] ? <small className="help-block">{errorState.errors['name'][0]}</small> : null}
                    </CCol>
                    <CCol xs='6' md='6'>
                      <CInputGroup>
                        <PrimaryInput id='address'
                                name='address'
                                value={current.address !== null ? current.address : ''}
                                onChange={(e) => changeState(e)}
                        />
                      </CInputGroup>
                      {errorState.errors['address'] ? <small className="help-block">{errorState.errors['address'][0]}</small> : null}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row >
                    <CCol md='12'>
                      <PrimaryLabel htmlFor='email'>{t('user.email')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='12'>
                      <CInputGroup>
                        <PrimaryInput id='email'
                                name='email'
                                value={current.email !== null ? current.email : ''}
                                onChange={(e) => changeState(e)}
                        />
                      </CInputGroup>
                      {errorState.errors['email'] ?
                        <small className="help-block">{errorState.errors['email'][0]}</small> : null}
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md='6' >
                      <PrimaryLabel htmlFor='created_at'>{t('user.created')}</PrimaryLabel>
                    </CCol>
                    <CCol md='6' >
                      <PrimaryLabel  htmlFor='updated_at'>{t('user.updated')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='6'>
                        <DateInput
                                id='created_at'
                                name='created_at'
                                readOnly
                                value={moment(current.created_at).format("YYYY-MM-DD")}
                        />
                    </CCol>
                    <CCol xs='12' md='6'>

                        <DateInput
                                id='updated_at'
                                name='updated_at'
                                readOnly
                                value={moment(current.updated_at).format("YYYY-MM-DD")}
                        />
                    </CCol>
                  </CFormGroup>
              </CCardBody>
            </ModalComponent>
          </>
        ) :
        (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="warning"/>
          </div>
        )
      }
        {Object.keys(toasters).map((toasterKey) => (
        <CToaster
          position={toasterKey}
          key={'toaster' + toasterKey}
        >
          {
            toasters[toasterKey].map((toast, key)=>{
              return(
                <CToast
                  style={{flexBasis: '100px'}}
                  key={'toast' + key}
                  show={true}
                  autohide={toast.autohide}
                  fade={toast.fade}
                >
                  <CToastHeader closeButton={toast.closeButton}>
                    User update
                  </CToastHeader>
                  <CToastBody>
                    {toast.content}
                  </CToastBody>
                </CToast>
              )
            })
          }
        </CToaster>
        ))}
    </>
  )
}

export default UserSettings

