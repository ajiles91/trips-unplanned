import React from "react";
import './AttractionsForm.css'
import { Link } from 'react-router-dom';

const AttractionsForm = props => (
  <div>
    <div className='greeting center'>
      <h1 className='section-header'>Type in a city to get some local attractions!</h1>
      <h2>Also clicking backward and forward too quickly causes the API to freeze</h2>
    </div>
   
    <form className='attractions-form' onSubmit={props.getAttractions}>
      <div>{props.error ? error() : ""}</div>
      <div>{props.noResultsError ? noResultsError() : ""}</div>
        <input 
          type="text" 
          name="city" 
          placeholder="City"
          autoComplete="off"
        />

        <input 
          type="text" 
          name="state" 
          placeholder="State"
          autoComplete="off"
        />

        <input 
          type="text" 
          name="country" 
          placeholder="Country"
          autoComplete="off"
        />
        
      <button>Get Local Attractions</button>
    </form>
    <div className='buttons-section'>
      
        <Link to ='/'>
          <button>Back to Main Page</button>
        </Link>

        <Link to ='/weather'>
          <button>Go to Weather Page</button>
        </Link>

        <Link to ='/food'>
          <button>Go to Food Page</button>
        </Link>
      
      

    </div>
    
  </div>
);

const error = props => {
  return (
    <div className="alert alert-danger mx-5" role="alert">
      Please Enter City and Country!
    </div>
  );
};

const noResultsError = props => {
  return (
    <div className="alert alert-danger mx-5" role="alert">
      No Results Found!
    </div>
  );

}
  

export default AttractionsForm;