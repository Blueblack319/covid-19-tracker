import React, { useState, useEffect } from "react";

import "./App.css";

import axios from "axios";
import Header from "./components/Header/Header";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";

const BASE_URL = "https://disease.sh";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [infoData, setInfoData] = useState({});
  const [mapCenter, setMapCenter] = useState([37, 127]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${BASE_URL}/v3/covid-19/countries`,
    }).then((res) => {
      const countries = [];
      res.data.forEach((country) => {
        countries.push({
          name: country.country,
          code: country.countryInfo.iso2,
        });
      });
      setCountries(countries);
      setMapCountries(res.data);
    });
  }, [countries]);

  useEffect(() => {
    const url =
      country === "Worldwide"
        ? `${BASE_URL}/v3/covid-19/all`
        : `${BASE_URL}/v3/covid-19/countries/${country}`;
    axios({
      method: "GET",
      url,
    }).then((res) => {
      console.log(res.data);
      setInfoData(res.data);
      if (country !== "Worldwide") {
        setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
        setMapZoom(4);
      }
    });
  }, [country]);

  const handleDropdownSelected = (event) => {
    setCountry(event.target.value);
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <Header
          countries={countries}
          country={country}
          selected={handleDropdownSelected}
        />
        <InfoBox
          cases={infoData.todayCases}
          total={infoData.cases}
          title='Coronavirus cases'
        />
        <InfoBox
          cases={infoData.todayRecovered}
          total={infoData.recovered}
          title='Recovered cases'
        />
        <InfoBox
          cases={infoData.todayDeaths}
          total={infoData.deaths}
          title='Death cases'
        />
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType='cases'
        />
      </div>
      <div className='app__right'></div>
    </div>
  );
}

export default App;
