import React, { Component } from "react";
import "./WeatherSection.css";
import WeatherForm from "./WeatherForm";
import WeatherResults from "./WeatherResults";
// import config from './../../config'

class WeatherSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: undefined,
      temp_max: undefined,
      temp_min: undefined,
      main: undefined,
      city: undefined,
      country: undefined,
      humidity: undefined,
      description: undefined,
      error: undefined,
      noResultsError: false,
      isSubmitted: false,
      cityRes: '',
      countryRes:'',
      stateRes:''
    };
  }

  getWeather = async event => {
    event.preventDefault();
    const city = event.target.elements.city.value;
    const country = event.target.elements.country.value;
    if (country && city) {
      const state = event.target.elements.state.value;
      var countryNormalization = country.toLowerCase();

      if (
        countryNormalization === "usa" ||
        countryNormalization === "united states"
      ) {
        countryNormalization = "us";
      } else {
        countryNormalization = country;
      }

      
      const COORD_API_KEY = "4d5000e35eb84d3fa4347e847eaef5bd";

      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}%20${state}%20${country}&key=${COORD_API_KEY}&language=en&pretty=1`
      )
        .then(res => res.json())
        .catch(err => {
          console.error("err", err);
        })
        .then(responseJson => {
          if (responseJson.total_results === 0) {
            this.setState({
              noResultsError: true
            });
          } else {
            this.setState({
              lat: responseJson.results[0].geometry.lat,
              lon: responseJson.results[0].geometry.lng,
              cityRes: responseJson.results[0].components.city,
              stateRes: responseJson.results[0].components.state,
              countryRes: responseJson.results[0].components.country,
              state: state,
              error: false
            });
          }
          
          let lat = this.state.lat;
          let lon = this.state.lon;

          const API_KEY = "f3d7f5d4c72cfbaa2f55436ddc5646b1";
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          )
            .then(res => res.json())
            .catch(err => {
              console.error("ERR", err);
            })
            .then(response => {
              //responseJson contains the response from the 2nd call.
              
              this.setState({
                city: `${city}, ${response.name}, ${response.sys.country}`,
                country: response.sys.country,
                main: response.weather[0].main,
                temp: response.main.temp,
                humidity: response.main.humidity,
                temp_max: response.main.temp_max,
                temp_min: response.main.temp_min,
                description: response.weather[0].description,
                isSubmitted: true,
                error: false
              });
            });
        });
    } else {
      this.setState({
        error: true
      });
    }
  };

  render() {
  
    return (
      <div className="wrapper">
        <WeatherForm
          getWeather={this.getWeather}
          error={this.state.error}
          noResultsError={this.state.noResultsError}
        />

        {this.state.isSubmitted && <WeatherResults
          temp={this.state.temp}
          city={this.state.city}
          humidity={this.state.humidity}
          cityRes={this.state.cityRes}
          stateRes={this.state.stateRes}
          countryRes={this.state.countryRes}
          main={this.state.main}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          country={this.state.country}
          description={this.state.description}
          error={this.state.error}
          /> 
          }
        
      </div>
    );
  }
}
export default WeatherSection;