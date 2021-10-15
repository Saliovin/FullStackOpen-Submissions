import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Languages = ({ languages }) => {
  return (
    <ul>
      {Object.values(languages).map(language => <li key={language}>{language}</li>)}
    </ul>
  )
}

const Country = ({ country }) => {
  const [weatherData, setWeatherData] = useState({
    main: { temp: null },
    weather: [{ icon: null, main: null }],
    wind: { speed: null, deg: null }
  })
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`).then(response => {
      setWeatherData(response.data)
    })
  }, [country, api_key])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]} </div>
      <div>region {country.region}</div>
      <h2>Spoken Languages</h2>
      <Languages languages={country.languages} />
      <img src={country.flags.png} alt={`${country.name.common} flag`} height="150" />
      <h2>Weather in {country.name.common}</h2>
      <b>temperature: </b>{weatherData.main.temp}
      <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].main} />
      <b>wind: </b>{`${weatherData.wind.speed} mps degree ${weatherData.wind.deg}`}
    </div>
  )
}

const SearchResults = ({ countries, setSearch }) => {
  const handleClick = event => setSearch(event.target.id)

  if (countries.length === 1) return <Country country={countries[0]} />
  else if (countries.length === 0) return <></>
  else if (countries.length <= 10) {
    return countries.map(country => (
      <div key={country.name.common}>
        <b>{country.name.common}</b>
        <button id={country.name.common} onClick={handleClick}>show</button>
      </div>
    ))
  }
  else if (countries.length > 10) return <div>To many matches, specify another filter</div>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  const countriesToShow = search
    ? countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
    : []

  const handleSearch = event => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      setCountries(response.data)
    })
  }, [])

  return (
    <>
      find countries
      <input value={search} onChange={handleSearch} />
      <SearchResults countries={countriesToShow} setSearch={setSearch} />
    </>
  );
}

export default App;
