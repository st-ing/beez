import React from "react";
import {CCard} from "@coreui/react";
import BeehiveImg from '@BeesImages/BeehiveLocation.png';
const BeehiveCard = ({currentBeehive}) => {
  return(
  <CCard className='details-card' style={{alignItems:'center'}}>
    <img
      src={BeehiveImg}
      width="60"
      height="60"
      className="d-inline-block align-bottom"
      alt='Beehive icon'
    />
    <h5>{currentBeehive.name}</h5>
    <CCard style={{alignItems:'center',width: '80%',border:'none'}}>
      <div className='text-muted'> Installation Date</div>
      <div className='beehive-card-text'> {currentBeehive.installation_date}</div>
    </CCard>
  </CCard>
  )
}
export default BeehiveCard
