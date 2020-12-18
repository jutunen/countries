import './App.css';
import * as cloneDeep from 'lodash.clonedeep';
import {ALL_REGIONS_SELECTED, UNCATEGORIZED_REGION} from "./App.js";

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

  if(rval === null || !regionMatches) {
    return false;
  }

  return true;
}

function TableRow(props) {
  return (
    <div className="countryline" onClick={() => window.location.hash = props.code}>
      <div className="countrydetail flag">
        <img src={props.flag} alt={""} height={50} />
        {/*<img src='https://restcountries.eu/data/afg.svg' alt={""} height={50} />*/}
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

function TableHeader(props) {

  function sortByCountryName() {
    let allCountriesClone = cloneDeep(props.allCountries);
    allCountriesClone.sort((a,b) => {
      if(a.name < b.name) { return (props.sortBool ? 1 : -1) }
      if(a.name > b.name) { return (props.sortBool ? -1 : 1) }
      return 0;
    });
    props.setAllCountries(allCountriesClone);
    props.setSortBool(!props.sortBool);
  }

  function sortByRegion() {
    let allCountriesClone = cloneDeep(props.allCountries);
    allCountriesClone.sort((a,b) => {
      if(a.subregion < b.subregion) { return (props.sortBool ? 1 : -1) }
      if(a.subregion > b.subregion) { return (props.sortBool ? -1 : 1) }
      return 0;
    });
    props.setAllCountries(allCountriesClone);
    props.setSortBool(!props.sortBool);
  }

  function sortByPopulation() {
    let allCountriesClone = cloneDeep(props.allCountries);
    allCountriesClone.sort((a,b) => { return (props.sortBool ? a.population - b.population : b.population - a.population) } );
    props.setAllCountries(allCountriesClone);
    props.setSortBool(!props.sortBool);
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

export function Table(props) {

  return (
    <div id="tableContainer">
      <TableHeader
        allCountries={props.allCountries}
        setAllCountries={props.setAllCountries}
        sortBool={props.sortBool}
        setSortBool={props.setSortBool}
      />
      <div id="tableBody">
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
              />
            )
          })
        }
      </div>
    </div>
  )
}
