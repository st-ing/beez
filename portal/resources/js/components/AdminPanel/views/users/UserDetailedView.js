import React, {useEffect, useState} from 'react'
import { CCard, CCol, CRow } from '@coreui/react'
import '../plans/index.css';
import {getSelectedUser, restoreUser} from "../../../../endpoints/UserFunctions";
import {Spinner} from "react-bootstrap";
import moment from "moment";

const UserDetailedView = (props) => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [user,setUser] = useState();
  //get selected user
  useEffect(()=> {
      const id = props.match.params.id;
      getSelectedUser(id).then(res => {
          setUser(res);
          setLoadingPage(true);
      })
  },[])

  return (
    <>
    {loadingPage? (
      <>
        <h4 className='py-3'>{user?.name}</h4>
      <CCard className='details-card'>
        <CRow className='px-3 py-3'>
          <CCol>
            <h4>Details</h4>
            <div className='text-muted'>ID</div>
            <div className='details-card-text'>{user?.id}</div>
            <div className='text-muted'>Address</div>
            <div className='details-card-text'>{user?.address}</div>
            <div className='text-muted'>Email</div>
            <div className='details-card-text'>{user?.email}</div>
            <div className='text-muted'>Role</div>
            <div className='details-card-text'>{user?.role}</div>
          </CCol>
          <CCol>
            <h4>Dates</h4>
            <div className='text-muted'>Created at</div>
            <div className='details-card-text' >{moment(user?.created_at).isValid()? moment(user?.created_at).format("YYYY-MM-DD") : ""}</div>
            <div className='text-muted'>Updated at</div>
            <div className='details-card-text' >{moment(user?.updated_at).isValid() ? moment(user?.updated_at).format("YYYY-MM-DD") : ""}</div>
            <div className='text-muted'>Email verified at</div>
            <div className='details-card-text' >{moment(user?.email_verified_at).isValid() ? moment(user?.email_verified_at).format("YYYY-MM-DD") : ""}</div>
            { user?.deleted_at &&
            (  <CRow className='float-left'>
              <CCol>
                <div className='text-muted'>Deleted at</div>
                <div className='details-card-text' >{moment(user?.deleted_at).isValid() ? moment(user?.deleted_at).format("YYYY-MM-DD") : ""}</div>
              </CCol>
            <button onClick={() => restoreUser(user?.id)}
                    className={(user?.deleted_at)?'btn btn-outline-info mr-1':'btn btn-outline-secondary mr-1'}
                    disabled={!(user?.deleted_at)}
            > Restore User </button>
        </CRow> )}

          </CCol>
            </CRow>
      </CCard>
      </>
        ):
        (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="warning" />
            </div>
        )
    }
   </>
  )
 }

export default UserDetailedView
