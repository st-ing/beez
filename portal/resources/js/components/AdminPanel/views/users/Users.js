import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CCardBody,
  CCol,
  CButton,
  CFormGroup,
  CFormText,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody
} from '@coreui/react'
import './users.css';
import {addUser, deleteUser, getAllUsers, reset, updateUser, uploadImage} from "../../../../endpoints/UserFunctions";
import CIcon from "@coreui/icons-react";
import {freeSet} from "@coreui/icons";
import {Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import ModalComponent from "../../../Modal";
import {useTranslation} from "react-i18next";
import UserSettings from "./UserSettings";
import DeleteModal from "../../../DeleteModal";
import BeezDataTable from "../../../BeezDataTable/BeezDataTable";

import {
  DeleteButton,
  DetailButton, GreyButton, OrangeButton,
  PrimaryButton,
  UpdateButton
} from "../../../buttons/Buttons";
import {DeleteIcon, DetailedIcon, UpdateIcon, UserIcon} from "../../assets/icons/icons";
import PrimarySelect from "../../../select/Select";
import PrimaryInput, {PrimaryLabel} from "../../../inputs/Inputs";

//checking if user is soft deleted for badge
const getBadge = deleted_at => {
    if (deleted_at) {return 'secondary';}
    else {return 'success';}
}

//checking if user is soft deleted for text
const getText = deleted_at => {
    if (deleted_at) {return 'Inactive';}
    else {return 'Active';}
}

const Users = () => {
    const{t,i18n} = useTranslation();
    const [selectedFile, setSelectedFile] = useState();
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.userLogged);
    const errorState = useSelector(state => state.errorState)
    const [loadingModal,setLoadingModal] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [loading,setLoading] = useState(false);
    const [users,setUsers] = useState([]);
    const [show,setShow] = useState(false);
    const [image,setImage] = useState(null);
    const [popup, setPopup] = useState({
    show: false,
    id: null,
  });
    const [current,setCurrent] = useState({
        id: '',
        name: '',
        email: '',
        address: '',
        password:'',
        role:'regular',
        locale:''
    });
    const [toasts, setToasts] = useState([])

    const optionsRole = [
      { value: 'regular', label: 'Regular',name:'role'},
      { value: 'admin', label: 'Admin',name:'role'},
    ]
    const toasters = (()=>{
      return toasts.reduce((toasters, toast) => {
        toasters[toast.position] = toasters[toast.position] || []
        toasters[toast.position].push(toast)
        return toasters
      }, {})
    })()

    //add toast with given seconds
    const addToast = (data) => {
      setToasts([
        ...toasts,
        { position:'top-right', autohide:2000, closeButton:true, fade:true,content:data}
      ])
    }

    //DataTable fields
    const fields = [
        { key: 'name', label: t('user.name') },
        { key: 'email', label: t('user.email') },
        { key: 'deleted_at', label: t('user.status') },
        { key: 'role', label: t('user.role') },
        { key: 'actions', label: t('user.actions'), _style: {width:'20%'} ,sorter: false ,filter: false},
    ]


    useEffect(() => {
      getAllUsers().then(data => {
        setUsers(Object.values(data));
        setLoadingPage(true);
      })
    }, [])

    //change input fields
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

    //create blank modal for creating user
    const createModal = () => {
        setCurrent({
            id: '',
            name: '',
            email: '',
            address: '',
            password:'',
            role:'regular',
            locale: document.documentElement.lang
        });
        setShow(true);
    }

    //reset form when creating user
    const resetFormCreate = (id) => {
        setCurrent({
            id: '',
            name: '',
            email: '',
            address: '',
            password:'',
            role:'regular',
            locale: document.documentElement.lang
        });
        dispatch({type: 'setErrors', errors:''})
    }

    //create user and add image
    const createUser = () => {
        setLoadingModal(true);
        addUser(current).then(res => {
            if(res.data){
                const fd = new FormData();
                fd.append('image',selectedFile);
                uploadImage(fd,res.data.id).then(res => {
                    const newList = users.concat([res.data]);
                    setUsers(newList);
                    setLoadingModal(false);
                    setShow(false);
                    dispatch({type: 'setErrors', errors:''})
                })
            }else {
                dispatch({type: 'setErrors', errors:res})
                setLoadingModal(false);
            }
        })
    }

    //open selected user modal and show image
    const showModal = id => {
        setShow(true);
        var user = users.filter(item => item.id === id)
        setCurrent({
            ...user[0],
          locale: document.documentElement.lang
        });
        const byteCharacters = atob(user[0].image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'image/jpeg'});
        setImage(URL.createObjectURL(blob));
    }

    //edit user and change image of user
    const changeUser = id => {
        setLoadingModal(true);
        const fd = new FormData();
        fd.append('image',selectedFile);
        uploadImage(fd,id);
        updateUser(current,id).then(res => {
            if(res.data) {
                const newList = users.map((item) => {
                    if (item.id === id) {
                        return res.data;
                    }
                    return item;
                });
                setUsers(newList);
                setLoadingModal(false);
                setShow(false);
                dispatch({type: 'setErrors', errors:''})
            }else {
                dispatch({type: 'setErrors', errors:res})
                setLoadingModal(false);
            }
        })
    }

    //reset fields when editing user
    const resetForm = (id) => {
        var user = users.filter(item => item.id === id)
        setCurrent({...user[0],locale: document.documentElement.lang});
        dispatch({type: 'setErrors', errors:''})
    }

    //show popUp
    const handleDelete = (id) => {
      setPopup({
        show: true,
        id,
      });
    };

    //soft delete user and close popUp
    const handleDeleteTrue = () => {
      if (popup.show && popup.id) {
        deleteUser(popup.id).then(res => {
          if(res.data){
            const newList = users.map((item) => {
              if (item.id === popup.id) {
                return res.data;
              }
              return item;
            });
            setUsers(newList);
          }
        });
        setPopup({
          show: false,
          id: null,
        });
      }
    };

    //close popUP
    const handleDeleteFalse = () => {
      setPopup({
        show: false,
        id: null,
      });
    };

    //show image when it is slected
    const fileSelectHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        if (e.target.files && e.target.files[0]) {
          let img = e.target.files[0];
          setImage(URL.createObjectURL(img));
        }
    }

    //send reset password link
    const handleSubmit = (e) => {
      setLoading(true);
      e.preventDefault();
      const data = {
        'email': current.email,
      }
      reset(data).then(res => {
        if (!res) {
          addToast(`You successfully send link for password reset to ${current.email}`);
          setLoading(false)
        } else {
          addToast(res);
          setLoading(false)
        }
      })
    }

    return (
      <>
        {(loggedUser.role==="admin")? (
          <div className='mt-3'>
            <div className='d-flex justify-content-end my-3'>
              <PrimaryButton id={'addUser'} onClick={createModal} icon={<UserIcon/>}>
                  Add User
              </PrimaryButton>
            </div>
            <div>
              <BeezDataTable
                items={users}
                fields={fields}
                fetched={loadingPage}
                scopedSlots={{
                  'name':
                    (item) => (
                      <td className="w-25">
                        {/*{item.image&&(<img style={{width:'50px'}} className="c-avatar-img" src={`data:image/jpeg;base64,${item.image}`} alt='Profile picture'/>)}*/}
                        <p>{item.name}</p>
                      </td>
                    ),
                  'email':
                    (item) => (
                      <td className="w-25">
                        {item.email} {!item.email_verified_at && (<CIcon
                        content={freeSet.cilWarning}/>)}
                      </td>

                    ),
                  'deleted_at':
                    (item) => (
                      <td>
                        <CBadge color={getBadge(item.deleted_at)}>
                          {getText(item.deleted_at)}
                        </CBadge>
                      </td>
                    ),
                  'role':
                    (item) => (
                      <td>
                        <p>{item.role}</p>
                      </td>
                    ),
                  'actions':
                    (item) => (
                      <td>
                        <a href={`#/users/${item.id}`}>
                          <DetailButton
                            title='Detailed view' icon={<DetailedIcon/>}>
                          </DetailButton>
                        </a>
                        <UpdateButton
                          onClick={() => showModal(item.id)}
                          ariaLabel="Update user"
                          title='Update' icon={<UpdateIcon/>}>
                        </UpdateButton>
                        <DeleteButton
                          onClick={() => handleDelete(item.id)}
                          title='Delete' icon={<DeleteIcon/>}>
                        </DeleteButton>
                      </td>
                    )
                }}
                />
            </div>
          </div>
          ) :
          (
            <div>
              <UserSettings/>
            </div>
          )
        }
        <DeleteModal
          handleDeleteTrue={handleDeleteTrue}
          handleDeleteFalse={handleDeleteFalse}
          show={popup.show}
        />

        <ModalComponent
            show={show}
            onHide={() => {
                setShow(false);
                resetFormCreate();
            }}
            title={current.id ? t('user.change') : t('user.create')}
            icon={current.id?<CIcon name='edit-icon' width={20}/>:(<CIcon name='add-icon-green' width={20}/>)}
            loading={loadingModal}
            actions={
                <>
                <CCol md="12">
                  <GreyButton
                    onClick={() => {setShow(false); resetFormCreate();}}>
                    {t('user.cancel')}
                  </GreyButton>
                  <GreyButton
                    onClick={()=>{current.id ? resetForm(current.id) : resetFormCreate()}}>
                      {t('plan.model_reset')}
                  </GreyButton>
                  <OrangeButton
                    id={'submit'}
                    onClick={() => {current.id ? changeUser(current.id) : createUser()}}>
                    {t('plan.model_submit')}
                  </OrangeButton>
                  </CCol>
                </>
            }
        >
            <CCardBody>
                <CFormGroup row>
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
                </CFormGroup>
                <CFormGroup col>
                    <CCol md='3'>
                        <PrimaryLabel htmlFor='name'>{t('user.name')}</PrimaryLabel>
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
                <CFormGroup col>
                    <CCol md='3'>
                        <PrimaryLabel htmlFor='address'>{t('user.address')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='12'>
                        <PrimaryInput id='address'
                                name='address'
                                value={current.address !== null ? current.address : ''}
                                onChange={(e) => changeState(e)}
                        />
                        {errorState.errors['address']?<CFormText className="help-block">{errorState.errors['address'][0]}</CFormText>:null}
                    </CCol>
                </CFormGroup>
                <CFormGroup col>
                    <CCol md='3'>
                        <PrimaryLabel htmlFor='email'>{t('user.email')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='12'>
                        <PrimaryInput id='email'
                                name='email'
                                value={current.email !== null ? current.email : ''}
                                onChange={(e) => changeState(e)}
                        />
                        {errorState.errors['email']?<CFormText className="help-block">{errorState.errors['email'][0]}</CFormText>:null}
                    </CCol>
                </CFormGroup>
                {current.id ? (
                <CFormGroup col>
                    <CCol md='3'>
                        <PrimaryLabel htmlFor='password'>{t('user.password')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='12'>
                      { !loading?
                        (
                          <CButton
                            className="btn btn-outline-info"
                            aria-label="Reset password"
                            onClick={(e) => handleSubmit(e)}
                          >
                            Reset Password
                          </CButton>
                        ) :
                        (
                          <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="warning"/>
                          </div>
                        )
                      }
                    </CCol>
                </CFormGroup>
                ):(
                  <CFormGroup col>
                    <CCol md='3'>
                      <PrimaryLabel htmlFor='password'>{t('user.password')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='12'>
                      <PrimaryInput
                        type="password"
                        name='password'
                        id='password'
                        value={current.password !== null ? current.password : ''}
                        onChange={(e) => changeState(e)}
                      />
                      {errorState.errors['password']?<CFormText className="help-block">{errorState.errors['password'][0]}</CFormText>:null}
                    </CCol>
                  </CFormGroup>
                )}
                <CFormGroup col>
                    <CCol md='3'>
                        <PrimaryLabel htmlFor='role'>{t('user.role')}</PrimaryLabel>
                    </CCol>
                    <CCol xs='12' md='12'>
                      <PrimarySelect
                        classNamePrefix='styles'
                        id='role'
                        name='role'
                        value={_.find(optionsRole, ['value', current.role])}
                        onChange={(e) => changeStateSelect(e)}
                        options={optionsRole}
                      />
                        {errorState.errors['role']?<CFormText className="help-block">{errorState.errors['role'][0]}</CFormText>:null}
                    </CCol>
                </CFormGroup>
            </CCardBody>
        </ModalComponent>

        <CCol sm="12" lg="6">
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
                      Password reset
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
        </CCol>
      </>
  )
}

export default Users
