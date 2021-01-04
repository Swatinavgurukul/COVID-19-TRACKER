import React, { useState, useEffect } from 'react'
import "./App.css"
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Card,CardContent} from '@material-ui/core';

import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import { sortData } from './util'
import LineGraph from './LineGraph'

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  useEffect(() => {
   fetch("https://disease.sh/v3/covid-19/all")
   .then((response)=>response.json())
   .then((data) => {
     setCountryInfo(data);
   })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));

          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries);
        })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =  countryCode === "worldwide" ?
    "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);

    })
  }


  return (
    <div className="app">
      <div className="app_left">

        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              onChange={onCountryChange}
              variant="outlined"
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recoverd" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Map />
      </div>
      <Card className="app_right">
              <CardContent>
                <h4>Live Cases by country</h4>
                <Table countries={tableData} />
                <h4>Worldwide new cases</h4>
                <LineGraph />
              </CardContent>
      </Card>
    </div>
  )
}

export default App