import React, {useEffect, useState} from "react";
import {getBeehive, getBeehiveHistory, getBeehiveOperations, getBeehives} from "../../../../endpoints/BeehiveFunctions";
import {
  CBadge,
  CCard,
  CCol,
  CRow,
} from "@coreui/react";

import {Map, Marker, TileLayer} from "react-leaflet";
import {blueIcon} from "../../../Utilities/helpers";
import Search from "react-leaflet-search";
import {Spinner} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {getAllPlans} from "../../../../endpoints/PlanFunctions";
import {DetailedDataTable} from "../../../BeezDataTable/BeezDataTable";
import WidgetTop from "../../../WidgetTop";
import DetailsCardBeehive from "../../../DetailsCardBeehive";
import {useSelector} from "react-redux";
import {AirGraph, TelemetryGraph} from "../graphs/Graphs";
import {getData, getNode} from "../../../../endpoints/NodeFunctions";

const BeehiveDetailedView = (props) => {
  const {t,i18n} = useTranslation();
  const [loading,setLoading] = useState(false);
  const beehivesFetched = useSelector(state => state.beehiveState.fetched)
  const beehives = useSelector(state => state.beehiveState.beehives)
  const [operations,setOperations] = useState([]);
  const [plans,setPlans] = useState([]);
  const [currentNodes,setCurrentNodes] = useState([]);
  const [influxData,setInfluxData] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false)
  const [currentBeehive,setCurrentBeehive] = useState({
    id: '',
    name: '',
    description: '',
    type: '',
    longitude:0.000000,
    latitude:0.000000,
    altitude:'',
    num_honey_frames: '',
    num_pollen_frames: '',
    num_brood_frames: '',
    num_empty_frames: '',
    source_of_swarm: '',
    installation_date: '',
    queen_color: '',
    created_at: '',
    updated_at: '',
    apiary_id: ''
  });
  const [items,setItems] = useState([]);

  const [forecast,setForecast] = useState();

  const temperature = influxData.filter(t => t._field === 'temperature');

  const humidity = influxData.filter(h => h._field === 'humidity');

  const battery = influxData.filter(b => b._field === 'battery');

  const operationsPlanned = operations.filter(o => o.status === 'planned');

  const history_fields = [
    { key: 'apiary_id', label: t('beehive-history.apiary') },
    { key: 'beehive_id', label: t('beehive-history.beehive') },
    { key: 'from', label: t('beehive-history.from') },
    { key: 'until', label: t('beehive-history.until') },
  ]

  const operation_fields = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'planned_date', label: 'Planned Date'},
    { key: 'type', label: t('Type'),},
    { key: 'plan_id', label: t('Plan'),},
  ]

  useEffect(()=> {
    const id = props.match.params.id;
    getBeehive(id).then(res => {
      getBeehiveOperations(id).then(res => {
        setOperations(res);
      })
      getAllPlans().then(plans => {
        setPlans(Object.values(plans));
      })
      setCurrentBeehive(res);
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/proxy/weather/forecast?lat=${res.latitude}&lon=${res.longitude}&units=metric`
      fetch(url)
        .then(res => res.json())
        .then(result => {
          setForecast(result);
          setLoadingPage(true);
        });
    })
    getNode(id).then(data => {
      setCurrentNodes(Object.values(data))
    })
    getData(id).then(data => {
      setInfluxData(Object.values(data))
    })
    getBeehiveHistory(id).then(res => {
      setItems(res);
      setLoading(true)
    })
    if (!beehivesFetched) {
      getBeehives(id).then(data => {
        dispatch({type: 'setBeehives', beehives: Object.values(data), fetched: true})
      })
    }
  },[])

  const loadMap = (event) => {
    event.target._map.invalidateSize(true);
  }

  return(
    <>
      {loadingPage && beehivesFetched?
        (
          <>
            <CRow>
              {temperature.map( temp =>
                <>
                  {humidity.map( hum =>
                    <>
                      {temp.position === 'ambient' && hum.position === 'ambient' &&
                      <CCol xs="12" sm="6" lg="3">
                        <WidgetTop text={'Ambient'} header={'🌡️' + temp._value + '°C ' + '💧' + hum._value + '%'} textColor='#F2994A' iconName="sun-icon"/>
                      </CCol>
                      }
                      {temp.position === 'top' && hum.position === 'top' &&
                      <CCol xs="12" sm="6" lg="3">
                        <WidgetTop text={'Top'} header={'🌡️' + temp._value + '°C ' + '💧' + hum._value + '%'} textColor='#F2994A' iconName="sun-icon"/>
                      </CCol>
                      }
                      {temp.position === 'bottom' && hum.position === 'bottom' &&
                      <CCol xs="12" sm="6" lg="3">
                        <WidgetTop text={'Brood'} header={'🌡️' + temp._value + '°C ' + '💧' + hum._value + '%'} textColor='#F2994A' iconName="sun-icon"/>
                      </CCol>
                      }
                    </>
                  )}
                </>
              )}
              {battery.map( bat =>
                <CCol xs="12" sm="6" lg="3">
                  <WidgetTop text={'Battery'} header={bat._value} textColor="#219653" iconName="cil-battery-full"/>
                </CCol>
              )}
            </CRow>
            {currentNodes.length === 0 &&
            <>
              <CRow>
                <CCol xs="12" sm="6" lg="3">
                  <WidgetTop text={'Ambient'} header={'/'} textColor='#F2994A' iconName="sun-icon"/>
                </CCol>
                <CCol xs="12" sm="6" lg="3">
                  <WidgetTop text={'Top'} header={'/'} textColor='#F2994A' iconName="sun-icon"/>
                </CCol>
                <CCol xs="12" sm="6" lg="3">
                  <WidgetTop text={'Brood'} header={'/'} textColor='#F2994A' iconName="sun-icon"/>
                </CCol>
                <CCol xs="12" sm="6" lg="3">
                  <WidgetTop text={'Battery'} header={'/'} textColor="#219653" iconName="cil-battery-full"/>
                </CCol>
              </CRow>
            </>
            }
            <CRow>
              <CCol xs="12" sm="6" lg="3"/>
              <CCol xs="12" sm="6" lg="3">
                <WidgetTop text={'Pending operations'} header={(operationsPlanned.length).toString()} iconName="cil-clock" textColor="#2F80ED"/>
              </CCol>
              <CCol>
                <WidgetTop text={t('beehive.card.queen_color')} header={<CBadge style={{backgroundColor:currentBeehive.queen_color,width:'21px',height:'21px',borderRadius:'100%'}}>{" "}</CBadge>} textColor='#EB5757' iconName="palette-icon"/>
              </CCol>
              <CCol xs="12" sm="6" lg="3">
                <WidgetTop text={t('card.inspection')} header={currentBeehive.installation_date} textColor="#2F80ED" iconName="calendar-icon"/>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <h4 className='py-3'>{currentBeehive.name}</h4>
                <DetailsCardBeehive currentBeehive={currentBeehive}/>
              </CCol>
              <CCol className='mb-4'>
                <h4 className='py-3'>Map</h4>
                <Map
                  center={[currentBeehive.latitude,currentBeehive.longitude]}
                  zoom={17}
                  style={{height:'88%',borderRadius:'6px',border:'none'}}
                >
                  <TileLayer
                    onLoad={loadMap}
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                  />
                  {beehives.map(item => (
                    <Marker
                      icon={blueIcon()}
                      key={item.id}
                      position={[
                        item.latitude,
                        item.longitude
                      ]}
                    />)
                  )
                  }
                  <Search
                    position="topright"
                    inputPlaceholder="Location..."
                    showMarker={false}
                    zoom={13}
                    closeResultsOnClick={true}
                    openSearchOnLoad={false}
                  />
                </Map>
              </CCol>
            </CRow>
            {
              currentNodes.map(node => (
                  currentNodes.length !== 0 &&
                  <>
                    <CRow>
                      <AirGraph id={node.id}/>
                    </CRow>
                    <CRow>
                      <TelemetryGraph id={node.id}/>
                    </CRow>
                  </>
                )
              )
            }
            <CRow>
              <h4 className='col-12 py-3'>Location History</h4>
              <CCard className="col-12" style={{borderRadius:'6px',border:'none'}}>
                <DetailedDataTable
                  items={items}
                  fields={history_fields}
                  fetched={loading}
                  scopedSlots={{
                    'apiary_id':
                      (item) => (
                        <td>
                          {item.name}
                        </td>
                      ),
                    'beehive_id':
                      () => (
                        <td>
                          {currentBeehive.name}
                        </td>
                      ),
                    'from':
                      (item) => (
                        <td>
                          {item.pivot.from}
                        </td>
                      ),
                    'until':
                      (item) => (
                        <td>
                          {item.pivot.until}
                        </td>
                      )
                  }}
                />
              </CCard>
            </CRow>
            <CRow>
              <h4 className='col-12 py-3'>Operations</h4>
              <CCard className="col-12" style={{borderRadius:'6px',border:'none'}}>
                <DetailedDataTable
                  items={operations}
                  fields={operation_fields}
                  fetched={loading}
                  scopedSlots={{
                    'description':
                      (item)=> (
                        <td>
                          <p className="pl-1 d-inline-block">{item.description?item.description:''}</p>
                        </td>
                      ),
                    'plan_id':
                      (item)=> (
                        <td>
                          <p className="pl-1 d-inline-block">{plans.find(plan => plan.id === item.plan_id)?plans.find(plan => plan.id === item.plan_id).title : ''}</p>
                        </td>
                      )
                  }}
                />
              </CCard>
            </CRow>
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
export default BeehiveDetailedView
