import {useState, useEffect} from "react";
import './App.css';
import axios from 'axios';
import countries from './all_countries.json';

// https://restcountries.eu/rest/v2/all

function App() {

  const ALL_REGIONS_SELECTED = "All";
  const UNCATEGORIZED_REGION = "Uncategorized";
  const [country,setCountry] = useState("");
  const [region,setRegion] = useState(ALL_REGIONS_SELECTED);

  let regionsSet = new Set(countries.map(x => x.subregion));
  let regions = Array.from(regionsSet);
  regions.push(ALL_REGIONS_SELECTED);
  let indexOfEmptyValue = regions.indexOf("");
  regions[indexOfEmptyValue] = UNCATEGORIZED_REGION;
  regions.sort();

  function handleCountry(event) {
    setCountry(event.target.value);
  }

  function changeRegion(event) {
    setRegion(event.target.value);
  }

  function filterFunction(countryName, countryRegion, searchStr, selectedRegion) {

    /*
    if(!searchStr) {
      return false;
    }
    */

    if(selectedRegion === UNCATEGORIZED_REGION) {
      selectedRegion = "";
    }

    let regionMatches;

    if(selectedRegion === ALL_REGIONS_SELECTED) {
      regionMatches = true;
    } else if( countryRegion === selectedRegion) {
      regionMatches = true;
    } else {
      regionMatches = false;
    }

    let regex;

    if(searchStr.length < 3) {
      regex = new RegExp("^" + searchStr, "gi");
    } else {
      regex = new RegExp(searchStr, "gi");
    }

    let rval = countryName.match(regex);
    //let rval_2 = nativeName.match(regex);

    if(rval === null || !regionMatches) {
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
        {props.countries.filter( x => filterFunction(x.name, x.subregion, props.searchStr, props.region) ).map( x =>
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
        <select
          value={region}
          onChange={ev => changeRegion(ev)}
        >
          {regions.map( region => <option key={region} value={region}>{region}</option> )}
        </select>
      </div>
      <div>
        <Table
          countries={countries}
          searchStr={country}
          region={region}
        >
        </Table>
      </div>
    </>
  );
}

export default App;
