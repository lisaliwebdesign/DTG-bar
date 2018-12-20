import React, { Component } from 'react';
import './App.css';
import ModelIssue from './DTG/ModelIssue';
import ModelType from './DTG/ModelType';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'ecop'
    };
  };
  setName(val) {
     this.setState({
            name: val
        });      
  };
  
  render() {
    return (           
      <div>
          <div className='header'>
            <img className="logo"  alt='MetDesk' src={'http://www.metdesk.com/wp-content/uploads/2015/03/metdesk-weather-services-web-logo1.png'}/>
          </div>
          <ModelType setName={this.setName.bind(this)} />
          <div className='section-right'>
          <ModelIssue name={this.state.name}/>  
          </div>
      </div>
    );
  }
}

export default App;
