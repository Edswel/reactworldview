import React from 'react';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';

function CityList({cities, isLoading}) {

  if (isLoading) return <Spinner />

  if (!cities.length) return <Message message='No city listing yet, kindly add some' />

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  )
}

export default CityList;