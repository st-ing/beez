import React from 'react'

import './index.css';
import TheHeader from "../TheHeader/TheHeader";
import TheFooter from "../TheFooter";
import TheContent from "../TheContent";
import TheSidebar from "../TheSidebar";

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body bg-white">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
