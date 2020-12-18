import {useState, useEffect, useRef} from "react";
import './App.css';
import axios from 'axios';
import COUNTRIES from './all_countries.json';
import {Table} from "./Table.js";
import format from 'number-format.js';

export const ALL_REGIONS_SELECTED = "all regions";
export const UNCATEGORIZED_REGION = "uncategorized";

function App() {

  const [searchStr,setSearchStr] = useState("");
  const [selectedRegion,setSelectedRegion] = useState(ALL_REGIONS_SELECTED);
  const [allCountries,setAllCountries] = useState([]);
  const [sortBool,setSortBool] = useState(false);
  const [countryCode,setCountryCode] = useState(undefined); // null = kosovo
  const [regions,setRegions] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        //setRequestIsPending(true);
        try {
          const result = await axios.get('https://restcountries.eu/rest/v2/all',
                                          {
                                            timeout: 10000
                                          });
          //console.log(result);
          setAllCountries(result.data);
        } catch (err) {
          console.error(err);
          alert("Data fetching failed.\nPlease try again later.");
          //setRequestIsPending(false);
        }
        //setRequestIsPending(false);
      };
      fetchData();
    }, []);

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
            <img src={countryData.flag} alt={""} width={250} />
            <h3> {countryData.name} </h3>
            <div className="detailsSection">
              <div className="detailsSubSection">
                <p> capital: </p>
                <h4> {countryData.capital} </h4>
              </div>
              <div className="detailsSubSection">
                <p> population: </p>
                <h4>{format('### ###.',countryData.population)}</h4>
              </div>
            </div>
            <div className="detailsSection">
              <div className="detailsSubSection">
                <p> languages: </p>
                {countryData.languages.map( lang => <h4 key={lang.name}>{lang.name}</h4> )}
              </div>
              <div className="detailsSubSection">
                <p> currencies: </p>
                {countryData.currencies.map( curr => <h4 key={curr.name}>{curr.name}</h4> )}
              </div>
            </div>
            <button className="button" type="button" onClick={ props.closeCb }> Close </button>
          </div>
        </div>
    )
  }

  console.log("Render!");

  return (
    <div id="mainContainer">
      <div className="controls">
        <div className="control_container">
          Search from {selectedRegion} by country name:
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
          Show countries by region:
          <div className="control_subcontainer">
            <select
              value={selectedRegion}
              onChange={ev => setSelectedRegion(ev.target.value)}
            >
              {regions.map( region => <option key={region} value={region}>{region}</option> )}
            </select>
            <button
              type="button"
              className="button"
              onClick={() => setSelectedRegion(ALL_REGIONS_SELECTED)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div>
        <Table
          allCountries={allCountries}
          setAllCountries={setAllCountries}
          sortBool={sortBool}
          setSortBool={setSortBool}
          searchStr={searchStr}
          selectedRegion={selectedRegion}
        />

      </div>
      <CountryDetails
        code={countryCode}
        closeCb={() => window.location.hash = "main"}
      />
    </div>
  );
}

export default App;
