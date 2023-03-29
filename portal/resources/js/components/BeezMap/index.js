import {FeatureGroup, Map, Marker, Polygon, Popup, TileLayer} from "react-leaflet";
import CustomControl from "../CustomControl";
import Control from "react-leaflet-control";
import CIcon from "@coreui/icons-react";
import Search from "react-leaflet-search";
import {blueIcon, redIcon} from "../Utilities/helpers";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {DeleteButton, DetailButton, UpdateButton} from "../buttons/Buttons";
import {PrimaryLabel} from "../inputs/Inputs";
import styled from "styled-components";
import {DeleteIcon, DetailedIcon, UpdateIcon} from "../AdminPanel/assets/icons/icons";
const TextDiv = styled.div`
margin-bottom: 0.5rem;
font-size: 14px;
color: #3D405B;
`
const ShowTable = styled.button`
  background: #E1E2E6;
  border-radius: 5px;
  font-family: Work Sans , sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.02em;
  color: #3D405B;
  margin-right: 3px;
  width:120px;
  height:30px;
  display:flex;
  justify-content: center;
  align-items:center;
  &:hover {
   opacity: 0.6;
  }
`
const loadMap = (event) => {
  event.target._map.invalidateSize(true);
}
export const ApiaryMap = ({position,createModal,apiaries,current,resetFormCreate,showModal,handleDelete,beehives,setCurrent,apiaryActive,beehiveActive,setTableView}) => {
  const {t} = useTranslation();
  const [apiariesActive,setApiariesActive] = useState(apiaryActive);
  const [beehivesActive,setBeehivesActive] = useState(beehiveActive);
  return (
    <Map
      center={position}
      zoom={15}
      style={{height:'100%',borderRadius:'12px'}}
    >
      <TileLayer
        onLoad={loadMap}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <FeatureGroup>
        {/*Controls*/}
        <CustomControl active={apiariesActive} position="topleft" name="apiary" changeView={() => setApiariesActive(!apiariesActive)} destination="40px"/>
        <CustomControl active={beehivesActive} position="topleft" name="beehive" changeView={() => setBeehivesActive(!beehivesActive)} destination="170px"/>
        <Control position="topright" className='leaflet-bar'>
          <ShowTable
            onClick={setTableView}
            className='btn'
          >
            <CIcon className='mr-1' name='cil-inbox' width={24}/>
            {t('table.view')}
          </ShowTable>
        </Control>
        <Control position="topleft" className='leaflet-bar'>
          <a style={{cursor:'pointer'}} onClick={createModal}>
            <CIcon name='add-polygon-icon' width={20} />
          </a>
        </Control>
        <Search
          position="topleft"
          inputPlaceholder="Location..."
          showMarker={false}
          zoom={13}
          closeResultsOnClick={true}
          openSearchOnLoad={false}
        />

        {/*Apiaries*/}
        {apiaries.map((item)=> (
          (item.area && apiariesActive) && <Polygon  color='#ffb42e' positions={item.area.coordinates[0].map(cord => [cord[1], cord[0]])} key={item.id} onClick={() => setCurrent(item)}/>
        ))}
        {current.id && (
          <Popup
            onClose={resetFormCreate}
          >
            <div className='flex'>
              <PrimaryLabel>{t('apiary.name')}</PrimaryLabel>
              <TextDiv>
                {current.name}
              </TextDiv>
              <PrimaryLabel>{t('apiary.description')}</PrimaryLabel>
              <TextDiv>
                {current.description}
              </TextDiv>
              <a href={`#/apiaries/${current.id}`}>
                <DetailButton
                  title='Detailed view'>
                  <DetailedIcon/>
                </DetailButton></a>
              <UpdateButton
                onClick={() => showModal(current.id) && this.closePopup()}
                title='Update'>
                <UpdateIcon/>
              </UpdateButton>
              <DeleteButton
                onClick={() => handleDelete(current)}
                title='Delete'>
                <DeleteIcon/>
              </DeleteButton>
            </div>
          </Popup>
        )
        }
        {/*Beehives*/}
        {beehivesActive && beehives.map( item => (
          <Marker
            icon={apiaries[item.apiary_id]?.type_of_env==='urban'?blueIcon():redIcon()}
            key={item.id}
            position={[
              item.latitude,
              item.longitude
            ]}
          />
        ))}
      </FeatureGroup>
    </Map>
  )
}
export const BeehiveMap = ({handleClick,position,createModal,apiaries,current,resetFormCreate,showModal,handleDelete,beehives,setCurrent,apiaryActive,beehiveActive,showTable}) => {
  const {t} = useTranslation();
  const [apiariesActive,setApiariesActive] = useState(apiaryActive);
  const [beehivesActive,setBeehivesActive] = useState(beehiveActive);
  const loadMap = (event) => {
    event.target._map.invalidateSize(true);
  }
  return (
    <Map
      center={position}
      zoom={15}
      style={{height:'100%',borderRadius:'12px'}}
      doubleClickZoom={false}
      onClick={(e) => handleClick(e)}
    >
      <TileLayer
        onLoad={loadMap}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <FeatureGroup>
        {/*Controls*/}
        <CustomControl active={apiariesActive} position="topleft" name="apiary" changeView={() => setApiariesActive(!apiariesActive)} destination="40px"/>
        <CustomControl active={beehivesActive} position="topleft" name="beehive" changeView={() => setBeehivesActive(!beehivesActive)} destination="170px"/>
        <Control position="topright" className='leaflet-bar'>
        <ShowTable
          onClick={showTable}
          className='btn'
        >
          <CIcon className='mr-1' name='cil-inbox' width={24}/>
          {t('table.view')}
        </ShowTable>
      </Control>
        <Control position="topleft" className='leaflet-bar'>
          <a style={{cursor:'pointer'}} onClick={createModal}>
            <CIcon name='yellow-beehive-icon' width={18} />
          </a>
        </Control>
        <Search
          position="topleft"
          inputPlaceholder="Location..."
          showMarker={false}
          zoom={13}
          closeResultsOnClick={true}
          openSearchOnLoad={false}
        />
        {beehivesActive && beehives.map( item => (
          <Marker
            icon={apiaries[item.apiary_id]?.type_of_env==='urban'?blueIcon():redIcon()}
            key={item.id}
            position={[
              item.latitude,
              item.longitude
            ]}
            onClick={() => setCurrent(item)}
          />
        ))}
        {apiaries.map(apiary => (
          apiary.area && apiariesActive && <Polygon color='#F6BD60' positions={apiary.area.coordinates[0].map(cord => [cord[1], cord[0]])} key={apiary.id}/>
        ))}
        {current.id && (
          <Popup
            position={[current.latitude,current.longitude]}
            onClose={resetFormCreate}
          >
            <div className='flex'>
              <PrimaryLabel>{t('apiary.name')}</PrimaryLabel>
              <TextDiv>
                {current.name}
              </TextDiv>
              <PrimaryLabel>{t('apiary.description')}</PrimaryLabel>
              <TextDiv>
                {current.description}
              </TextDiv>
              <a href={`#/beehives/${current.id}`}>
                <DetailButton
                  title='Detailed view'>
                  <DetailedIcon/>
                </DetailButton></a>
              <UpdateButton
                onClick={() => showModal(current.id) && this.closePopup()}
                title='Update'>
                <UpdateIcon/>
              </UpdateButton>
              <DeleteButton
                onClick={() => handleDelete(current)}
                title='Delete'>
                <DeleteIcon/>
              </DeleteButton>
            </div>
          </Popup>)}
      </FeatureGroup>
    </Map>
  )
}
