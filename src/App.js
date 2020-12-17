import {useState, useEffect, useRef} from "react";
import './App.css';
import axios from 'axios';
import COUNTRIES from './all_countries.json';
import * as cloneDeep from 'lodash.clonedeep';

// https://restcountries.eu/rest/v2/all

function App() {

  const ALL_REGIONS_SELECTED = "All";
  const UNCATEGORIZED_REGION = "Uncategorized";
  const [searchStr,setSearchStr] = useState("");
  const [selectedRegion,setSelectedRegion] = useState(ALL_REGIONS_SELECTED);
  const [allCountries,setAllCountries] = useState(COUNTRIES);
  const [sortBool,setSortBool] = useState(false);

  /*
  let allCountriesClone = cloneDeep(allCountries);
  let fixedCountries = allCountries.map( x => {
    if( x.subregion === "" ) {
      return {
        ...x,
        subregion: UNCATEGORIZED_REGION
      }
    }
  });
  setAllCountries(fixedCountries);
  */

  let regionsSet = new Set(allCountries.map(y => y.subregion));
  let regions = Array.from(regionsSet);
  regions.push(ALL_REGIONS_SELECTED);
  let indexOfEmptyValue = regions.indexOf("");
  regions[indexOfEmptyValue] = UNCATEGORIZED_REGION;
  regions.sort();

  //console.log(allCountries);

  function handleCountry(event) {
    setSearchStr(event.target.value);
  }

  function changeRegion(event) {
    setSelectedRegion(event.target.value);
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
          {/*<img src={props.flag} alt={""} height={50} width={100} />*/}
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

  function TableHeader() {

    function sortByCountryName() {
      let allCountriesClone = cloneDeep(allCountries);
      allCountriesClone.sort((a,b) => {
        if(a.name < b.name) { return (sortBool ? 1 : -1) }
        if(a.name > b.name) { return (sortBool ? -1 : 1) }
        return 0;
      });
      setAllCountries(allCountriesClone);
      setSortBool(!sortBool);
    }

    function sortByRegion() {
      let allCountriesClone = cloneDeep(allCountries);
      allCountriesClone.sort((a,b) => {
        if(a.subregion < b.subregion) { return (sortBool ? 1 : -1) }
        if(a.subregion > b.subregion) { return (sortBool ? -1 : 1) }
        return 0;
      });
      setAllCountries(allCountriesClone);
      setSortBool(!sortBool);
    }

    function sortByPopulation() {
      let allCountriesClone = cloneDeep(allCountries);
      allCountriesClone.sort((a,b) => { return (sortBool ? a.population - b.population : b.population - a.population) } );
      setAllCountries(allCountriesClone);
      setSortBool(!sortBool);
    }

    return (
      <div id="tableHeader" className="countryline">
        <div className="tableHeaderCell flag">

        </div>
        <div className="tableHeaderCell name" onClick={sortByCountryName}>
          Country
        </div>
        <div className="tableHeaderCell subregion" onClick={sortByRegion}>
          Region
        </div>
        <div className="tableHeaderCell population" onClick={sortByPopulation}>
          Population
        </div>
      </div>
    )
  }

  function Table(props) {

    return (
      <div id="tableContainer">
        <TableHeader />
        <div id="tableBody">
          {/*{props.allCountries.slice(0, props.allCountries.length).map( x =>*/}
          {props.allCountries.filter( x => filterFunction(x.name, x.subregion, props.searchStr, props.selectedRegion) ).map( x =>
            {
              return (
                <TableRow
                  key={x.name}
                  flag={x.flag}
                  name={x.name}
                  subregion={x.subregion === "" ? UNCATEGORIZED_REGION : x.subregion}
                  population={x.population}>
                </TableRow>
              )
            })
          }
        </div>
      </div>
    )
  }

  return (
    <div id="mainContainer">
      <div className="controls">
        <div class="control_container">
          Search for country by name:
          <input
            type="text"
            value={searchStr}
            onChange={ev => handleCountry(ev)}
            placeholder="enter country name here"
          />
        </div>
        <div class="control_container">
          Select region:
          <select
            value={selectedRegion}
            onChange={ev => changeRegion(ev)}
          >
            {regions.map( region => <option key={region} value={region}>{region}</option> )}
          </select>
        </div>
      </div>
      <div>
        <Table
          allCountries={allCountries}
          searchStr={searchStr}
          selectedRegion={selectedRegion}
        >
        </Table>
      </div>
    </div>
  );
}

export default App;
