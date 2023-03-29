import React from 'react'
import { CFooter } from '@coreui/react'
import ScrollArrow from '../../ScrollTopArrow/ScrollTopArrow'
const TheFooter = () => {
  const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  return (
      <div className='d-flex justify-content-center'>
       <ScrollArrow/>
      </div>
  )
}

export default React.memo(TheFooter)
