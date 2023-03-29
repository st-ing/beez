import CIcon from "@coreui/icons-react";
import React from "react";
import './index.css';
import {useTranslation} from "react-i18next";

const CustomControl = ({ changeView,active,position,name,destination }) => {
  const {t} = useTranslation();
  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }
  const NAME_CLASSES = {
    beehive: t('beehives.map'),
    apiary: t('apiaries.map')
  }
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright
  return (
    <div className={positionClass}>
      <div className={active?"leaflet-control leaflet-custom-control active":"leaflet-control leaflet-custom-control"} style={{left:destination}}>
        <a onClick={changeView}>
          {name === "beehive"?
            (
              active?
                <CIcon className='mr-1' name='black-beehive-icon' width={17}/>
                :
                <CIcon className='mr-1' name='yellow-beehive-icon' width={17}/>
            ):(
              active?
                <CIcon className='mr-1' name='add-polygon-black' width={20}/>
                :
                <CIcon className='mr-1' name='add-polygon-icon' width={20}/>
            )
          }
          <span>{NAME_CLASSES[name]}</span>
        </a>
      </div>
    </div>
  )
}
export default CustomControl
