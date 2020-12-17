import {useState, useEffect} from "react";
import './App.css';
import axios from 'axios';
import countries from './all_countries.json';

// https://restcountries.eu/rest/v2/all

function App() {

  const [country,setCountry] = useState("");

  function handleCountry(event) {
    setCountry(event.target.value);
  }

  function filterFunction(country, searchStr) {

    if(!searchStr) {
      return false;
    }

    let regex;

    if(searchStr.length === 1) {
      regex = new RegExp("^" + searchStr, "gi");
    } else {
      regex = new RegExp(searchStr, "gi");
    }

    let rval = country.match(regex);

    if(rval === null) {
      return false;
    }

    return true;
  }

  function TableRow(props) {
    return (
      <div className="countryline">
        <div className="countrydetail flag">
          <img src={""} alt={""} height={50} width={100} />
        </div>
        <div className="countrydetail name">
          {props.name}
        </div>
        <div className="countrydetail subregion">
          {props.subregion}
        </div>
        <div className="countrydetail population">
          {props.population}
        </div>
      </div>
    )
  }

  function Table(props) {
    return (
      <div id="table">
        {/*{props.countries.slice(0, props.countries.length).map( x =>*/}
        {props.countries.filter( x => filterFunction(x.name, props.searchStr) ).map( x =>
          {
            return (
              <TableRow
                key={x.name}
                flag={x.flag}
                name={x.name}
                subregion={x.subregion}
                population={x.population}>
              </TableRow>
            )
          })
        }
      </div>
    )
  }

  return (
    <>
      <div className="controls">
        <input
          type="text"
          value={country}
          onChange={ev => handleCountry(ev)}
        />
      </div>
      <div>
        <Table
          countries={countries}
          searchStr={country}
        >
        </Table>
      </div>
    </>
  );
}

export default App;
