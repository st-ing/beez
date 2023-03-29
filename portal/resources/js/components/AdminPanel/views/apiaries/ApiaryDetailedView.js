import React, {useEffect, useState} from "react";
import {getAllApiaries, getApiary, getApiaryOperations} from "../../../../endpoints/ApiaryFunctions";
import {
    CCard,
    CCol,
    CRow,
} from "@coreui/react";
import { getApiaryBeehives } from "../../../../endpoints/BeehiveFunctions";
import {Map, Marker, Polygon, TileLayer} from "react-leaflet";
import {CChartLine} from "@coreui/react-chartjs";
import {blueIcon, getPolygonCenter} from "../../../Utilities/helpers";
import { useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Spinner} from "react-bootstrap";
import {getAllPlans} from "../../../../endpoints/PlanFunctions";
import {DetailedDataTable} from "../../../BeezDataTable/BeezDataTable";
import WidgetTop from "../../../WidgetTop";
import DetailsCard from "../../../DetailsCard";
import BeehiveCard from "../../../BeehiveCard";
const api = {
    key:'b56e3b52c69660fe6b26e296889b9d11',
    base:'https://api.openweathermap.org/data/2.5/'
}
const ApiaryDetailedView = (props) => {
    const [loadingPage, setLoadingPage] = useState(false)
    const [loading,setLoading] = useState(false);
    const [position,setPositon] = useState([0,0]);
    const [currentApiary,setCurrentApiary] = useState({});
    const [operations,setOperations] = useState([]);
    const [plans,setPlans] = useState([]);
    const [items,setItems] = useState([]);
    const [forecast,setForecast] = useState()
    const loggedUser = useSelector(state => state.userLogged);
    const {t,i18n} = useTranslation();

    const operation_fields = [
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' },
      { key: 'planned_date', label: 'Planned'},
      { key: 'type', label: t('Type'),},
      { key: 'plan_id', label: t('Plan'),},
    ]

    useEffect(()=> {
        const id = props.match.params.id;
        getApiary(id).then(res => {
          const ApiaryCenter = getPolygonCenter(res.area.coordinates[0]);
          setPositon(ApiaryCenter);
            getApiaryOperations(id).then(res => {
              setOperations(res);
            })
            getAllPlans().then(plans => {
              setPlans(Object.values(plans));
            })
            setCurrentApiary(res);
            getAllApiaries(loggedUser.id).then(data => {
              const url = `${api.base}forecast?lat=${ApiaryCenter[0]}&lon=${ApiaryCenter[1]}&units=metric&appid=${api.key}`
              fetch(url)
                  .then(res => res.json())
                      .then(result => {
                          setForecast(result);
                          setLoadingPage(true);
                      });
            })
            getApiaryBeehives(res.id).then(result => {
                var elements = Object.values(result);
                setItems(elements)
                setLoading(true);
            })
        })
    },[])

    const loadMap = (event) => {
        event.target._map.invalidateSize(true);
    }

    if (!loadingPage) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="warning" />
        </div>
      )
    }
    return(
      <>
        <CRow>
          <CCol>
            <WidgetTop text={t('beehive.table')} header={(items.length).toString()} textColor='#EB5757' iconName="red-beehive-icon"/>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <WidgetTop text={t('card.temperature')} header={Math.round(forecast?.list[0]?.main?.temp)+'°C'}  textColor='#F2994A' iconName="sun-icon"/>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <WidgetTop text={t('card.inspection')} header="TBD" textColor="#2F80ED" iconName="calendar-icon"/>
          </CCol>
          <CCol xs="12" sm="6" lg="3">
            <WidgetTop text={t('card.notifications')} header="15" textColor="#219653" iconName="bell-icon"/>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <h4 className='py-3'>{currentApiary.name}</h4>
            <DetailsCard currentApiary={currentApiary}/>
          </CCol>
          <CCol className='mb-4'>
            <h4 className='py-3'>Map</h4>
            <Map
              center={position}
              zoom={17}
              style={{height:'88%',borderRadius:'10px',border:'none'}}
            >
            <TileLayer
              onLoad={loadMap}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {currentApiary.area &&
            <Polygon
              color='#F2994A'
              positions={currentApiary.area.coordinates[0].map(cord => [cord[1], cord[0]])}
              key={currentApiary.id}
            />}
            {items.map(item => (
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
            </Map>
          </CCol>
        </CRow>
        <CRow>
          <h4 className='col-12 py-3'>{t('beehive.table')}</h4>
          {
            items.map(item => (
              <CCol key={item.id}>
                <BeehiveCard currentBeehive={item}/>
              </CCol>
              )
            )
          }
        </CRow>
        <CRow>
          <h4 className='col-12 py-3'>Operations</h4>
          <CCard className="col-12" style={{height:'350px',borderRadius:'6px',border:'none'}}>
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
        <CRow>
          <h5 className="col-12 py-3">{forecast?.city?.name} {forecast?.list[0]?.dt_txt} {Math.round(forecast?.list[0]?.main?.temp)}°C </h5>
          <CCard className="col-12" style={{borderRadius:'6px',border:'none',height:'350px'}}>
          <CChartLine
            type="line"
            className='details-card'
            datasets={[
              {
              label: 'Temperature in C',
              backgroundColor: '#F6BD60',
              data: [30, 39, 10, 50, 30, 70, 35]
              },
            ]}
            options={{
              tooltips: {
              enabled: true
              }
            }}
            labels="months"
          />
          </CCard>
        </CRow>
      </>
    )
}
export default ApiaryDetailedView
