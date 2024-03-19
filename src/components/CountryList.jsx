import React from 'react';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';
import CountryItem from './CountryItem';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
  const {cities, isLoading} = useCities();

  if (isLoading) return <Spinner />

  if (!cities.length) return <Message message='No city listing yet, kindly add some' />

  const countries = cities.reduce((arr, city) => {
    if (!arr.map(el => el.country).includes(city.country))
    return [...arr, {country: city.country, emoji: city.emoji}]
    else return arr;
    }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  )
}

export default CountryList;