import React from "react";
import CIcon from "@coreui/icons-react";
import './index.css';
const WidgetTop = ({textColor,text,header,iconName}) => {
  return(
  <div className="card widget-wrapper">
    <div className="card-body d-flex align-items-center p-3">
      <div className="card-widget-header mr-3 p-3" style={{color:`${textColor}`}}>
        <CIcon width={24} name={iconName}/>
      </div>
      <div>
        <div className="text-muted widget-text-wrapper">{text}</div>
        <h3 className="text-value widget-header-wrapper">{header}</h3>
      </div>
    </div>
  </div>
  )
}
export default WidgetTop
