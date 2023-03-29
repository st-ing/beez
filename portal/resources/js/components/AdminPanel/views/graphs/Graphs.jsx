import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ReferenceArea,
  Legend,
} from "recharts";
import { InfluxDB } from "@influxdata/influxdb-client";
import moment from "moment";
import styled from "styled-components";
import {getSettingKey} from "../../../../endpoints/SettingFunctions";

const baseUrl = window.location.origin;
const url = `${baseUrl}/proxy/graphs`;

const portalVersion = document.querySelector("meta[name='version']").getAttribute("content")
const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

const AirStyled = styled.div`
  background: #f8f8fb;
  border-radius: 6px;
  padding: 10px;
  margin: 15px;
  width: 1290px;
  height: 620px;
`;
const TelemetryStyled = styled.div`
  background: #f8f8fb;
  border-radius: 6px;
  padding: 10px;
  margin: 15px;
  width: 1290px;
  height: 320px;
`;

export const AirGraph = ({ id }) => {
  const [data, setData] = useState(null);
  const [rangeStart, setRangeStart] = useState('1d');

  useEffect(async () => {
    const queryApi = await new InfluxDB({
      url,
      headers: {  
        'User-Agent': `beez-portal/${portalVersion}`,
        'X-CSRF-TOKEN': `${csrfToken}`
      }
    }).getQueryApi('bee•z');
    let rowTable = [];
    await queryApi.queryRows(queryAir, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        rowTable.push(o);
      },
      complete() {
        let airRehartsData = [];
        for (let i = 0; i < rowTable.length; i++) {
          let airArray = {};
          airArray["temperature"] = rowTable[i]["temperature"];
          airArray["humidity"] = rowTable[i]["humidity"];

          airArray["name"] = rowTable[i]["_time"];
          airRehartsData.push(airArray);
        }
        setData(airRehartsData);
      },
      error(error) {
        console.log("query failed- ", error);
      },
    });
    getSettingKey('ui.graphs.number_of_days').then(data => {
      setRangeStart(data.value);
    })
  }, [rangeStart]);

  const queryAir = `from(bucket:"beez")
  |> range(start: -${rangeStart})
  |> filter(fn: (r) => r["_measurement"] == "air")
  |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature")
  |> filter(fn: (r) => r["node"] == "${id}")
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> yield(name: "mean")`;

  return (
    <>
      <h4 className='col-12 py-2'>Air parameters</h4>
      <AirStyled>
       <LineChart
         width={1270}
         height={300}
         data={data}
         syncId="anyId"
         margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
         }}
       >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={timeStr => moment(timeStr).format('DD MMM HH:mm')} minTickGap={30} tickMargin={5}/>
        <YAxis unit=" °C" />
        <Tooltip labelFormatter={timeStr => moment(timeStr).format('DD MMM HH:mm')} />
        <Legend/>
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </LineChart>
      <LineChart
        width={1270}
        height={300}
        data={data}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={timeStr => moment(timeStr).format('DD MMM HH:mm')} minTickGap={30} tickMargin={5}/>
        <YAxis unit=" %" />
        <Tooltip labelFormatter={timeStr => moment(timeStr).format('DD MMM HH:mm')} />
        <Legend/>
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Brush/>
      </LineChart>
    </AirStyled>
   </>
  );
};

export const TelemetryGraph = ({ id }) => {
  const [data, setData] = useState(null);
  const [rangeStart, setRangeStart] = useState('1d');
  const [initialState, setInitialState] = useState({
    data: [],
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+1",
    bottom: "dataMin-1",
    top2: "dataMax+20",
    bottom2: "dataMin-20",
    animation: true,
  });

  useEffect(async () => {
    const queryApi = await new InfluxDB({
      url,
      headers: {  
        'User-Agent': `beez-portal/${portalVersion}`,
        'X-CSRF-TOKEN': `${csrfToken}`
      }
    }).getQueryApi('bee•z');
    let rowTable = [];
    await queryApi.queryRows(queryTelemetry, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        rowTable.push(o);
      },
      complete() {
        let telemetryRechartsData = [];

        for (let i = 0; i < rowTable.length; i++) {
          let telemeptryArray = {};
          telemeptryArray["battery"] = rowTable[i]["battery"];
          telemeptryArray["rssi"] = rowTable[i]["rssi"];

          telemeptryArray["name"] = rowTable[i]["_time"];
          telemetryRechartsData.push(telemeptryArray);
        }
        setData(telemetryRechartsData);
        setInitialState({
          ...initialState,
          data: telemetryRechartsData,
        });
      },
      error(error) {
        console.log("query failed- ", error);
      },
    });
    getSettingKey('ui.graphs.number_of_days').then(data => {
      setRangeStart(data.value);
    })
  }, [rangeStart]);

  const queryTelemetry = `from(bucket:"beez")
  |> range(start: -${rangeStart})
  |> filter(fn: (r) => r["_measurement"] == "telemetry")
  |> filter(fn: (r) => r["_field"] == "rssi" or r["_field"] == "battery")
  |> filter(fn: (r) => r["node"] == "${id}")
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> yield(name: "median")`;

  const getAxisYDomain = (from, to, ref, offset) => {
    const refData = data.filter(
      (d) => moment(d.name) >= moment(from) && moment(d.name) <= moment(to)
    );
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    console.log(refData);
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset, refData];
  };

  const zoom = () => {
    const { refAreaLeft, refAreaRight } = initialState;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setInitialState(() => ({
        ...initialState,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      const [bottom, top, refData] = getAxisYDomain(
        refAreaRight,
        refAreaLeft,
        "battery",
        1
      );
      const [bottom2, top2] = getAxisYDomain(
        refAreaRight,
        refAreaLeft,
        "rssi",
        10
      );
      setInitialState({
        refAreaLeft: "",
        refAreaRight: "",
        data: refData,
        left: refAreaLeft,
        right: refAreaRight,
        bottom,
        top,
        bottom2,
        top2,
      });
    } else {
      // yAxis domain
      const [bottom, top, refData] = getAxisYDomain(
        refAreaLeft,
        refAreaRight,
        "battery",
        1
      );
      const [bottom2, top2] = getAxisYDomain(
        refAreaLeft,
        refAreaRight,
        "rssi",
        10
      );
      setInitialState({
        refAreaLeft: "",
        refAreaRight: "",
        data: refData,
        left: refAreaLeft,
        right: refAreaRight,
        bottom,
        top,
        bottom2,
        top2,
      });
    }
  };

  const zoomOut = () => {
    setInitialState({
      data: data,
      left: "dataMin",
      right: "dataMax",
      refAreaLeft: "",
      refAreaRight: "",
      top: "dataMax+1",
      bottom: "dataMin-1",
      top2: "dataMax+20",
      bottom2: "dataMin-20",
    });
  };

  return (
    <>
    <h4 className='col-12 py-2' >Telemetry</h4>
     <TelemetryStyled className="highlight-bar-charts" style={{ userSelect: "none" }}>
      <LineChart
        width={1280}
        height={300}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 0,
        }}
        data={initialState.data}
        onMouseDown={(e) =>
          setInitialState({ ...initialState, refAreaLeft: e.activeLabel })
        }
        onMouseMove={(e) =>
          initialState.refAreaLeft &&
          setInitialState({ ...initialState, refAreaRight: e.activeLabel })
        }
        onMouseUp={() => zoom()}
        onMouseLeave={() => zoomOut()}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          allowDataOverflow
          dataKey="name"
          minTickGap={30}
          tickMargin={8}
          tickFormatter={timeStr => moment(timeStr).format('DD MMM HH:mm')}
          domain={[initialState.left, initialState.right]}
        />
        <YAxis
          allowDataOverflow
          domain={[initialState.bottom, initialState.top]}
          yAxisId="1"
          unit=" V"
        />
        <YAxis
          orientation="right"
          allowDataOverflow
          domain={[initialState.bottom2, initialState.top2]}
          yAxisId="2"
          unit=" dB"
        />
        <Tooltip labelFormatter={timeStr => moment(timeStr).format('DD MMM HH:mm')}/>
        <Legend/>
        <Line
          yAxisId="1"
          type="natural"
          dataKey="battery"
          stroke="#8884d8"
          animationDuration={300}
        />
        <Line
          yAxisId="2"
          type="natural"
          dataKey="rssi"
          stroke="#82ca9d"
          animationDuration={300}
        />

        {initialState.refAreaLeft && initialState.refAreaRight ? (
          <ReferenceArea
            yAxisId="1"
            x1={initialState.refAreaLeft}
            x2={initialState.refAreaRight}
            strokeOpacity={0.3}
          />
        ) : null}
      </LineChart>
    </TelemetryStyled>
    </>
  );
};
