import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";

import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox";

const BASE_URL = "https://disease.sh";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [infoData, setInfoData] = useState({});

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
      setInfoData(res.data);
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
      </div>
      <div className='app__right'></div>
    </div>
  );
}

export default App;
