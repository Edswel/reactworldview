import { useState, useEffect, createContext, useContext, useReducer } from "react";

const BASE_URL = 'http://localhost:5050';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ''
}

function reducer(state, action) {
  switch(action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
        currentCity: {}
      }
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      throw new Error('Action unknown');
  }
}

function CitiesProvider({children}) {
  const [{cities, isLoading, error, currentCity}, dispatch] = useReducer(reducer, initialState);

  useEffect(function() {
    async function fetchCities() {
      dispatch({type: 'loading'});
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: 'cities/loaded', payload: data});
      } catch (error) {
        dispatch({type: 'rejected', payload: 'An error occurred fetching data'});
      } 
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({type: 'loading'});
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({type: 'city/loaded', payload: data})
      } catch (error) {
        dispatch({type: 'rejected', payload: 'An error occurred fetching city'});
      } 
    }

    async function createCity(newCity) {
      dispatch({type: 'loading'});
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: 'POST',
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        dispatch({type: 'city/created', payload: data})
      } catch (error) {
        dispatch({type: 'rejected', payload: 'An error occurred creating city'});
      } 
    }

    async function deleteCity(id) {
      dispatch({type: 'loading'});
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: 'DELETE'
        });
      
        dispatch({type: 'city/deleted', payload: id});
      } catch (error) {
        dispatch({type: 'rejected', payload: 'An error occurred deleting city'});
      } 
    }

  return (
    <CitiesContext.Provider value={{
      cities, isLoading, currentCity, error, getCity, createCity, deleteCity
    }}>{children}</CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error('Context is being used wrong');
  return context;
}

export {CitiesProvider, useCities};