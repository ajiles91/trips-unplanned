import React, { Component } from 'react';
import AttractionsForm from './AttractionsForm'
import AttractionsResults from './AttractionsResults'
import './AttractionsSection.css'


class AttractionsSection extends Component {
    constructor(props) {
      super(props);
      this.state = {
        id: '',
        city: '',
        country: '',
        state:'',
        lon: 0,
        lat: 0,
        xIDs: '',
        name:'',
        attractions_response: {},
        error: undefined,
        data:[],
        sliceStart:0,
        sliceEnd:7,
        backButtonDisabled : true,
        fwdButtonDisabled : false,
        disabled: false,
        userClicked: false,
        noResultsError: false,
        fetchingData: false
      };
    }
  
    getAttractions = async (event) => {
      event.preventDefault();
      
      const ATTRACTION_API_KEY = '5ae2e3f221c38a28845f05b637c385bf96afbd0ee0efa31f1d54771e'
      const city = event.target.elements.city.value;
      const country = event.target.elements.country.value;
      const state = event.target.elements.state.value;

      var countryNormalization = country.toLowerCase();

      if(countryNormalization === 'usa' || countryNormalization === 'united states'){
        countryNormalization = 'us'
      } else {
        countryNormalization = country
      }
      const COORD_API_KEY='4d5000e35eb84d3fa4347e847eaef5bd'
      
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}%20${state}%20${country}&key=${COORD_API_KEY}&language=en&pretty=1`)
       .then(res => res.json())
        .then(responseJson => { 

          if (responseJson.total_results === 0){
            this.setState({
              noResultsError: true
            })
 

          } else {
            this.setState({
              lat: responseJson.results[0].geometry.lat,
              lon: responseJson.results[0].geometry.lng,
              state: state,
            error: false,
            })
          }
          //responseJson contains the response from the first call.

          let lat = this.state.lat;
          let lon = this.state.lon;

        fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=80467.2&lon=${lon}&lat=${lat}&kinds=interesting_places&rate=2&limit=80&apikey=${ATTRACTION_API_KEY}`)
        .then(res => res.json())
          .then(responseJson => { 
            //responseJson contains the response from the 2nd call.
      
            this.setState({
              attractions_response: responseJson.features
            })
          
            let arrayXID = this.state.attractions_response;
            let theXIDs = arrayXID.map( point =>{
              return point.properties.xid;
            })
            
            this.setState({
              xIDs: theXIDs,
              userClicked: true
            })
            if(!this.state.fetchingData){
              this.pauseFetchCalls();
            let maxFetchCount = this.state.xIDs.length >= 8 ? 8 : this.state.xIDs.length-1;
            let locations = theXIDs.slice(0,maxFetchCount).map(async xid => {
              return await this.getLocation(xid)
            })

            Promise.all(locations)
            .then(data => {
              
              this.setState({
                data,
                userClicked: true
              })
            })
          }
        })
      })
    };// end getAttractions

    pauseFetchCalls = () => {
      this.setState({ fetchingData : true }, ()=> {
      setTimeout(()=> {
      this.setState({ fetchingData : false });
      }, 2500);
      })
    }

    getLocation = async (xid) => {
      const result = await fetch(`https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=5ae2e3f221c38a28845f05b637c385bf96afbd0ee0efa31f1d54771e`)
        .then(res => res.json())
          .then(responseJson => {
            return responseJson
          })
          .catch(err => alert(err.message))
      return result
    }

    getMoreAttractionsBackward = () => {
      if(!this.state.fetchingData){
        this.pauseFetchCalls();
      
      if (this.state.sliceStart > 0) {
        let start = this.state.sliceStart - 8;
        let end = this.state.sliceEnd - 8;
        let moreXIDs = this.state.xIDs
        let moreLocations = moreXIDs.slice(start, end).map(async xid => {
          return await this.getLocation(xid)
        })
      
        this.setState({
          sliceStart: start,
          sliceEnd:end
        },) 

        
        Promise.all(moreLocations)
          .then(newData => {
          
          this.setState({
            data:newData,
            fwdButtonDisabled : false
          })
        })
          if (start === 0) {
            this.setState({ backButtonDisabled : true })
          }
        } else {
            this.setState({ backButtonDisabled : true })
        }
      }
    }

    
    getMoreAttractionsForward = () => {
      if(!this.state.fetchingData){
        this.pauseFetchCalls();
      let start = this.state.sliceStart + 8;
      let end =  this.state.xIDs.length - this.state.sliceEnd >= 8 ? this.state.sliceEnd + 8 : this.state.xIDs.length - this.state.sliceEnd;
      if (end <= this.state.xIDs.length-1) {
        let moreXIDs = this.state.xIDs
        let moreLocations = moreXIDs.slice(start, end).map(async xid => {
          return await this.getLocation(xid)
        })

      if (moreLocations.length < 8){
          this.setState({
            disabled:'disabled'
          })
      }
      
      this.setState({
          sliceStart: start,
          sliceEnd:end
        },) 


      Promise.all(moreLocations)
      .then(newData => {
          
        this.setState({
            data: newData,
            backButtonDisabled : false
          })
      })
      if (end >= this.state.xIDs.length - 1) {
        this.setState({ fwdButtonDisabled : true })
      }
    } else {
      this.setState({ fwdButtonDisabled : true })
    }
    }
    }


    render() {
      let data = this.state.data;
      return (
        <div>
          <div className="wrapper">
            <div className="col-xs-7 form-container">
                  
              <AttractionsForm 
                getAttractions={this.getAttractions}
                noResultsError={this.state.noResultsError} 
              />
              
              <AttractionsResults 
                attractions={data}
                getMoreAttractionsBackward={this.getMoreAttractionsBackward} 
                backwardsDisabled={this.state.backButtonDisabled} 
                getMoreAttractionsForward={this.getMoreAttractionsForward} 
                forwardsDisabled={this.state.fwdButtonDisabled}
                userClicked={this.state.userClicked} 
              />
              
            </div>
          </div>
        </div>
      );
    }
  }
export default AttractionsSection;