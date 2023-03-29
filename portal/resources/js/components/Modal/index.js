import {Modal, Spinner} from "react-bootstrap";
import React from "react";
import styled from "styled-components";
import BeehiveImg from '@BeesImages/BeehiveLocation.png';

const CenteredModal = styled(Modal)`
  .modal-content{
    border-radius: 10px !important;
  }
`;
const TopCorner = styled.div`
  position: absolute;
  top:0;
  right:0;
  border-bottom-left-radius: 80px 70px;
  height: 70px;
  width: 80px;
  background: radial-gradient(50% 50% at 50% 50%, #F6BD60 0%, rgba(246, 189, 96, 0.61) 100%);
  border-top-right-radius: 10px 10px;
  display: flex;
  padding-left: 15px;
`;
const IconHolder = styled.div`
  width: 37px;
  height: 37px;
  background: #F0F0F8; !important;
  border-radius: 100% !important;
  margin-right: 0.5rem;
  padding: 0 8px 0 9px;
  display: flex;

`

const FooterActions = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
`

const ModalComponent = ({title, children, actions, show, onHide, loading, size, icon, corner}) => {
    return (
        <CenteredModal show={show}
               size={size?size:'lg'}
               onHide={onHide}
               keyboard={false}
               backdrop="static"
        >
                  <div className='my-4 mx-2'>
                    {title && (
                      <>
                      <div className="d-flex align-items-center px-3">
                        <IconHolder>
                          {icon}
                        </IconHolder>
                        <h3 className='m-0'>{title}</h3>
                      </div>

                    {corner && <TopCorner>
                      <img
                        src={BeehiveImg}
                        width="60"
                        height="60"
                        className="d-inline-block align-bottom"
                        alt='Beehive icon'
                      />
                    </TopCorner>}
                  </>
                )}
                {children}
                {(actions && !loading)? (
                  <FooterActions>
                        {actions}
                  </FooterActions>
                ):(
                    <div className="d-flex justify-content-center mb-5">
                        <Spinner animation="border" variant="warning"/>
                    </div>
                )
                }
            </div>
        </CenteredModal>
    );
}

export default ModalComponent;
