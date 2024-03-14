import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import CityList from './components/CityList';
import { useEffect, useState } from 'react';
import CountryList from './components/CountryList';
import City from './components/City';

const BASE_URL = 'http://localhost:5050';

function App() {

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function() {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert('Error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='product' element={<Product />} />
          <Route path='pricing' element={<Pricing />} />
          <Route path='login' element={<Login />} />
          <Route path='app' element={<AppLayout />}>
            <Route index element={<CityList cities={cities} isLoading={isLoading} />} />
            <Route path='cities' element={<CityList cities={cities} isLoading={isLoading}  />} />
            <Route path='cities/:id' element={<City cities={cities} isLoading={isLoading}  />} />
            <Route path='countries' element={<CountryList cities={cities} isLoading={isLoading} />} />
            <Route path='form' element={<p>Form</p>} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <h1>World View</h1>
      <p>The world through my lens</p>
    </>
  )
}

export default App;