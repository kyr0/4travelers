import config from "@config/config.json";
import dateFormat from "@lib/utils/dateFormat";
import { humanize, slugify } from "@lib/utils/textConverter";
import Fuse from "fuse.js";
import 'mapbox-gl/dist/mapbox-gl.css'
import MapGL, { ControlPosition, useControl, Marker, GeolocateControl, FullscreenControl, NavigationControl, ScaleControl } from 'react-map-gl'
import './MapPlanner.css'
import { Ref, useEffect, useRef, useState } from "preact/compat";
const { styleUrl, token } = config.mapbox;

//import mapboxgl, { Map } from 'mapbox-gl';

import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface Props {

}

export interface GeoCoderProps {
  position: ControlPosition
}

export const GeoCoderControl = ({ position }: GeoCoderProps) => {
  const [marker, setMarker] = useState<any>(null);
  const geocoder = useControl(() => {
    const ctrl = new MapboxGeocoder({
        marker: false,
        accessToken: token
      });
      ctrl.on('result', evt => {

        const {result} = evt;
        const location =
          result &&
          (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
        if (location) {
          setMarker(<Marker longitude={location[0]} latitude={location[1]} />);
        } else {
          setMarker(null);
        }
      });
      return ctrl;
  },
  {
    position
  })
  return marker
}

export interface DirectionsControl {
  position: ControlPosition
  mapRef: Ref<any>
}

/*
export const DirectionsControl = ({ position, mapRef }: DirectionsControl) => {
  useEffect(() => {
    if (!mapRef) return;
    const map = mapRef.current.getMap()
    if (!map) return;
    const directions = new MapboxDirections({
      accessToken: token,
      unit: 'metric',
      controls: {
        profileSwitcher: false,
        instructions: false,
      },
      profile: 'mapbox/walking',
      alternatives: true,
    });
    map.addControl(directions, position);
    return () => {
      map.removeControl(directions)
    }
  }, [mapRef, position])

  return <></>
}
*/

interface PersonPosition {

    a: string, // address
    d: string, // date
    lat: number,
    lng: number,
    n: string // nickname
    p: number // accuracy

}

interface CurrentLocation {
  position: Array<PersonPosition>;
  timestamp: string;
}

// https://locshare-pi.vercel.app/api/positions.esm?from=${fromDate}&to=${toDate}

const filterForPerson = (
  position: CurrentLocation["position"],
  n: string
) => position.filter((p) => p.n === n)[0];

export default function MapPlanner({  }: Props) {
  const mapRef = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>();
  const [followPerson, setFollowPerson] = useState('Aron')
  const [lastFollowPersonPosition, setLastFollowPersonPosition] =
    useState<PersonPosition>();

  const [viewState, setViewState] = useState({
      "longitude": 11.660895,
      "latitude": 48.320541,
      "zoom": 16,
      "pitch": 0,
      "bearing": 0,
      "padding": {
          "top": 0,
          "bottom": 0,
          "left": 0,
          "right": 0
      }
  });

  useEffect(() => {

    if (!mapRef || !mapRef.current || !mapRef.current.getMap() || !currentLocation) return

    const map = mapRef.current.getMap();
    const lastFollowPersonPosition = filterForPerson(
      currentLocation.position,
      followPerson
    );

    setLastFollowPersonPosition(lastFollowPersonPosition);

    map.setCenter([lastFollowPersonPosition.lng, lastFollowPersonPosition.lat])

  }, [currentLocation, mapRef, followPerson]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://locshare-pi.vercel.app/api/current-positions"
      );
      const data = await response.json() as any;
      setCurrentLocation(data);
    };

    fetchData(); // fetch the data immediately

    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // fetch the data every 5 minutes

    return () => clearInterval(intervalId); // cleanup function to clear the interval
  }, []);

  return (
    <>
      <h2>{followPerson}'s Position</h2>
      <div className="sidebar">
        {lastFollowPersonPosition &&
          `Last Position Update: ${lastFollowPersonPosition.d} UTC`}
      </div>
      <MapGL
        ref={mapRef}
        initialViewState={viewState}
        style={{ width: "100%", height: "500px" }}
        light={{
          color: "#FFFFE0",
        }}
        projection={"mercator"}
        mapStyle={styleUrl}
        boxZoom={true}
        doubleClickZoom={true}
        scrollZoom={true}
        mapboxAccessToken={token}
        onMove={(e) => setViewState(e.viewState)}
      >
        <GeoCoderControl position="top-left" />
        <GeolocateControl position="top-right" />
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />
        {lastFollowPersonPosition && (
          <Marker
            latitude={lastFollowPersonPosition.lat}
            longitude={lastFollowPersonPosition.lng}
            color="#cc0000"
          />
        )}
        {/*<DirectionsControl position="top-left" mapRef={mapRef} />*/}
      </MapGL>
      <div ref={mapRef} className="map-container"></div>
    </>
  );
}
