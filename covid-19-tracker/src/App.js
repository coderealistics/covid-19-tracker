import React, {useEffect, useState} from 'react';
import './App.css';
import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";

function App() {
    // useState = How to write a variable in React
    // useEffect = Runs a piece of code based on a given condition
    // https://disease.sh/v3/covid-19/countries
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    // https://disease.sh/v3/covid-19/all

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});

    useEffect(() => {
        // The code inside here will run once when the component loads and not again
        // async -> send a request, wait for it, do something with input

        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {

                    // [item1, item2, item3]
                    // ^^^ item 1 ... -> returning an object in a shape
                    // ^^^ item 2 ... -> returning an object in a shape
                    // ^^^ item 3 ........

                    const countries = data.map((country) => ({
                        name: country.country, // United Kingdom, United States
                        value: country.countryInfo.iso2, // UK, USA, FR
                    }));

                    setCountries(countries);
                });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
            });
    };

    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" onChange={onCountryChange} value={country}>
                            {/*Loop through all the countries and show a dropdown list of the options*/}
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {countries.map((country) => (
                                <MenuItem value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/*Header*/}
                <div className="app__stats">
                    <InfoBox title="Coronavirus title" total={countryInfo.todayCases} cases={countryInfo.cases}/>
                    <InfoBox title="Recovered" total={countryInfo.todayRecovered} cases={countryInfo.recovered}/>
                    <InfoBox title="Deaths" total={countryInfo.todayDeaths} cases={countryInfo.deaths}/>
                </div>

                <Map/>
            </div>
            <Card className="app__right">
                <CardContent>
                    {/*Table*/}
                    <h3>Live Cases by Country</h3>
                    {/*Graph*/}
                    <h3>Worldwide new cases</h3>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
