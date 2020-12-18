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
  const [countryCode,setCountryCode] = useState(undefined); // null = kosovo
  const [regions,setRegions] = useState([]);

  useEffect(() => {
    // subscribe to hash changes
    window.location.hash = "main";
    window.addEventListener("hashchange", router);
    return () => window.removeEventListener("hashchange", router);
  },[]);

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

  useEffect(() => {
    console.log("regions init");
    let regionsSet = new Set(allCountries.map(y => y.subregion));
    let regionsArray = Array.from(regionsSet);
    regionsArray.push(ALL_REGIONS_SELECTED);
    let indexOfEmptyValue = regionsArray.indexOf("");
    regionsArray[indexOfEmptyValue] = UNCATEGORIZED_REGION;
    regionsArray.sort();
    setRegions(regionsArray);
  },[allCountries]);


  function router() {
    const hash = window.location.hash.replace(/^#/, "");
    if(hash !== "main") {
      setCountryCode(hash);
    } else {
      setCountryCode(undefined);
    }
  }

  function handleCountryDetailsClick(code) {
    window.location.hash = code;
  }

  function CountryDetails(props) {

    if(props.code === undefined) {
      return null;
    }

    let countryData = allCountries.find(x => x.numericCode === props.code);

    if(countryData === undefined) {
      window.location.hash = "main";
      return null;
    }

    return (
        <div className="countryDetailsBackground" onClick={ props.closeCb }>
          <div className="countryDetails" onClick={ ev => ev.stopPropagation() }>
            <p> {countryData.name} </p>
            <p> Capital: {countryData.capital} </p>
            <p> Population: {countryData.population} </p>
            <p> Languages: </p>
            {countryData.languages.map( lang => <p key={lang.name}>{lang.name}</p> )}
            <button className="button" type="button" onClick={ props.closeCb }> Close </button>
          </div>
        </div>
    )
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
      <div className="countryline" onClick={() => handleCountryDetailsClick(props.code)}>
        <div className="countrydetail flag">
          {/*<img src={props.flag} alt={""} height={50} width={100} />*/}
          <img src='https://restcountries.eu/data/afg.svg' alt={""} height={50} width={100} />
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
                  population={x.population}
                  code={x.numericCode}
                >
                </TableRow>
              )
            })
          }
        </div>
      </div>
    )
  }

  console.log("Render!");

  return (
    <div id="mainContainer">
      <div className="controls">
        <div className="control_container">
          Search for country by name:
          <div className="control_subcontainer">
            <input
              type="text"
              value={searchStr}
              onChange={ev => setSearchStr(ev.target.value)}
              placeholder="enter country name here"
            />
            <button
              type="button"
              className="button"
              onClick={() => setSearchStr("")}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="control_container">
          Select region:
          <select
            value={selectedRegion}
            onChange={ev => setSelectedRegion(ev.target.value)}
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
      <CountryDetails
        code={countryCode}
        closeCb={() => window.location.hash = "main"}
      >
      </CountryDetails>
    </div>
  );
}

export default App;
