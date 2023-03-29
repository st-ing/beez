import redMarkerIcon from '@BeesImages/WildBeehiveLocation.png';
import blueMarkerIcon from '@BeesImages/BeehiveLocation.png';
import markerShadow from '@BeesImages/marker-shadow.png';
import React, {useEffect} from "react";

//click outside hook
export const useOnClickOutside = (data, handler) => {
  let {isOpen, domNode} = data;
  useEffect(
    () => {
      let listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (isOpen && domNode.current && !domNode.current.contains(event.target)) {
          handler();
        }
      };
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    },
    [data, handler]
  );
}
//decode base64 image from database
export const getImage = (data) => {
  const byteCharacters = atob(data.image);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'image/jpeg'});
  return URL.createObjectURL(blob);
}

export const getPosition = (data) => {
    if(data.length === 1) {
        return [data[0].latitude,data[0].longitude]
    }else if(data.length === 0){
        return [0.000000,0.000000]
    }
    else
    {

        let x = 0;
        let y = 0;
        let z = 0;

        data.map((item) => {
            let latitude = item.latitude * Math.PI / 180;
            let longitude = item.longitude * Math.PI / 180;

            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        });

        let total = data.length;

        x = x / total;
        y = y / total;
        z = z / total;

        let centralLongitude = Math.atan2(y, x);
        let centralSquareRoot = Math.sqrt(x * x + y * y);
        let centralLatitude = Math.atan2(z, centralSquareRoot);

        return[centralLatitude * 180 / Math.PI,centralLongitude * 180 / Math.PI]
    }
}

export const getPositionOfPolygons = (data) => {
    if(data.length === 1) {
        return getPolygonCenter(data[0].area.coordinates[0]);
    }else if(data.length === 0){
        return [0.000000,0.000000]
    }
    else
    {

        let x = 0;
        let y = 0;
        let z = 0;

        data.map((item) => {
            if(item.area) {
              let PolygonCords = getPolygonCenter(item.area.coordinates[0]);

              let latitude = PolygonCords[0] * Math.PI / 180;
              let longitude = PolygonCords[1] * Math.PI / 180;

              x += Math.cos(latitude) * Math.cos(longitude);
              y += Math.cos(latitude) * Math.sin(longitude);
              z += Math.sin(latitude);
            }
        });

        let total = data.length;

        x = x / total;
        y = y / total;
        z = z / total;

        let centralLongitude = Math.atan2(y, x);
        let centralSquareRoot = Math.sqrt(x * x + y * y);
        let centralLatitude = Math.atan2(z, centralSquareRoot);

        return[centralLatitude * 180 / Math.PI,centralLongitude * 180 / Math.PI]
    }
}

export const getPolygonCenter = (data) => {
    if(data.length === 1) {
        return [data[0][1],data[0][0]]
    }else if(data.length === 0){
        return [0.000000,0.000000]
    }
    else
    {

        let x = 0;
        let y = 0;
        let z = 0;

        data.map((item) => {
            let latitude = item[1] * Math.PI / 180;
            let longitude = item[0] * Math.PI / 180;

            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        });

        let total = data.length;

        x = x / total;
        y = y / total;
        z = z / total;

        let centralLongitude = Math.atan2(y, x);
        let centralSquareRoot = Math.sqrt(x * x + y * y);
        let centralLatitude = Math.atan2(z, centralSquareRoot);

        return[centralLatitude * 180 / Math.PI,centralLongitude * 180 / Math.PI]
    }
}

export const redIcon = () => {
    return new L.Icon({
        iconUrl: redMarkerIcon,
        iconSize: [27, 27],
    });
}

export const blueIcon = () => {
  return new L.Icon({
    iconUrl: blueMarkerIcon,
    iconSize: [40, 40],
  });
}
export const offset = (el) => {
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

export const getSetting = (key,settings,id) => {
  let userSetting;
  let systemSetting;
  for (let i = 0; i < settings.length; i++) {
    if(settings[i].key===key && settings[i].scope===id) {
      userSetting = settings[i].value;
    }
    if (settings[i].key === key && settings[i].scope === null) {
      systemSetting = settings[i].value;
    }
  }
  if(userSetting) return userSetting; else return systemSetting;
}
