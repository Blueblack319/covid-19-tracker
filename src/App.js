import React, { useState, useEffect } from "react";
import { Card } from "@material-ui/core";

import "./App.css";

import axios from "axios";
import Header from "./components/Header/Header";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import LineGraph from "./components/LineGraph/LineGraph";

const BASE_URL = "https://disease.sh";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [infoData, setInfoData] = useState({});
  const [mapCenter, setMapCenter] = useState([37, 127]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [casesType, setCasesType] = useState("cases");

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
          cases: country.cases,
        });
      });
      setCountries(countries);
      setMapCountries(res.data);
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${BASE_URL}/v3/covid-19/historical/all?lastdays=120`,
    }).then((res) => {
      setGraphData(res.data[casesType]);
    });
  }, [casesType]);

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
      if (country !== "Worldwide") {
        setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
        setMapZoom(4);
      }
    });
  }, [country]);

  const handleDropdownSelected = (event) => {
    setCountry(event.target.value);
  };

  const handleInfoBoxClicked = (type) => {
    setCasesType(type);
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
          clicked={handleInfoBoxClicked.bind(this, "cases")}
          casesType='cases'
          active={casesType === "cases"}
        />
        <InfoBox
          cases={infoData.todayRecovered}
          total={infoData.recovered}
          title='Recovered cases'
          clicked={handleInfoBoxClicked.bind(this, "recovered")}
          casesType='recovered'
          active={casesType === "recovered"}
        />
        <InfoBox
          cases={infoData.todayDeaths}
          total={infoData.deaths}
          title='Death cases'
          clicked={handleInfoBoxClicked.bind(this, "deaths")}
          casesType='deaths'
          active={casesType === "deaths"}
        />
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className='app__right'>
        <Table countries={countries} />
        <LineGraph graphData={graphData} casesType={casesType} />
      </Card>
    </div>
  );
}

export default App;
