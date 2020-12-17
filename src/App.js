import './App.css';
import axios from 'axios';
import countries from './all_countries.json';

// https://restcountries.eu/rest/v2/all

function App() {

  function CountryLine(props) {
    return (
      <div className="countryline">
        <div className="countrydetail flag">
          <img src={props.flag} alt={""} height={50} width={100} />
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

  return (
    <div className="App">
      {countries.slice(0, 10).map( x => {
        return (
          <CountryLine
            key={x.name}
            flag={x.flag}
            name={x.name}
            subregion={x.subregion}
            population={x.population}>
          </CountryLine>
        )
      })
      }
    </div>
  );
}

export default App;
