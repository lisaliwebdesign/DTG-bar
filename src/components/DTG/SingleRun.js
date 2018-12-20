import React, { Component } from "react";
import Error from "./Error";
import Moment from "react-moment";
import moment from "moment";
import "moment-timezone";


class SingleRun extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestDate: this.props.latestDate,
      setDate:this.props.setDate,
      data: this.props.data,
      isFullNav: false,
      selectedDateIndex:this.props.seletedRunIndex,
      selectedDataString:'',
      dateDisplayType: "hour",
      displayCount: '1'
    };
  }

  //Update state when recevie changes from parent
  componentWillReceiveProps =(nextProps) => { 
      this.setState({
        setDate: nextProps.setDate,
        data: nextProps.data,
        latestDate: nextProps.latestDate,
        selectedDateIndex: nextProps.seletedRunIndex
    });
  }
  
  //Page trigger function
    collapse = event => {
        let isCollapse = false;
        let setClassName = 'glyphicon time-bar-icon ';
        if (/glyphicon-plus-sign/.test(event.target.className)) {
                isCollapse = true;
                setClassName += 'glyphicon-minus-sign';
        }
        if (/glyphicon-minus-sign/.test(event.target.className)) {
            isCollapse = false;
            setClassName += 'glyphicon-plus-sign';
        }
       this.setState({
            isFullNav: isCollapse
       });
       event.currentTarget.className =setClassName;
    }
  
  removeAllSelection = ()=>{
    let navLink = document.getElementsByClassName("time-item");
    for (let i = 0; i < navLink.length; i++) {
      if (/item-seleted/.test(navLink[i].className)) {
        navLink[i].className = "time-item";
      }
    }
  }

  selectRunTime = (index,event) => {
    this.removeAllSelection();
    event.currentTarget.className = "item-seleted time-item"+this.setTimeItemClass();
    this.setState({
      selectedDateIndex: index
    });
  };
  
  timeDisplayOptionChange = changeEvent => {
    this.setState({
      dateDisplayType: changeEvent.target.value,     
    });
  };
  
  timeNumberOptionChange = changeEvent => {
    this.setState({
      displayCount: changeEvent.target.value,
      selectedDateIndex: 0
    });
  };
  
  silderChange = (event) => {
        this.removeAllSelection();
        this.setState({selectedDateIndex: event.target.value});
  }
  
 //Set the correct data set
  displayData = ()=>{
      //Set data filter set number 1 or 6 or 12
      let filter = this.state.displayCount === '6' || this.state.displayCount === '12';
      //Check if needed filtering
      let filterArray = filter === false? this.state.data:[];
      //Filter data
      if (filter){
          //Set the first data item
          let startTime = this.state.data[0];
          let data = this.state.data;
          filterArray.push(startTime);
          //Filter data
          for (let i = 0, len = this.state.data.length; i < len; i++) {               
                startTime = moment.utc(filterArray[i]).add(parseInt(this.state.displayCount), 'hours').format();
                let item = data.find(o => o === startTime);
                if (item !== undefined)filterArray.push(item);
          };
      }
      return filterArray;     
  }
  
  
  //Rendering section
  setTimeItemClass =()=>this.state.dateDisplayType === "hour"?" time-number-item":'';
  
  renderDateDisplay =(item)=>{
      return this.state.dateDisplayType === "hour" ? <Moment diff={this.state.setDate} unit="hours" decimal>{item}</Moment> : <Moment tz="UTC" format="DD/HH">{item}</Moment> 
  }
                    
  renderSingleRunSlider =()=><div>
                                <input type="range" min="0" max={this.displayData().length-1} list="data" value={this.state.selectedDateIndex} className="slider" onChange={this.silderChange} id="myRange"/>
                                <div className="silder-text">{this.state.dateDisplayType === 'hour'?parseInt(this.state.selectedDateIndex)*parseInt(this.state.displayCount) : moment.utc(this.displayData()[parseInt(this.state.selectedDateIndex)]).format('DD/HH')}</div>
                            </div>
      
  renderItems = () =>{
    if (!this.state.error) {
      let renderData = this.displayData();
      let selectedDateIndexInt = parseInt(this.state.selectedDateIndex);
      return renderData.map((item, index) => (
         <div className={(index === selectedDateIndexInt)? "item-seleted time-item"+this.setTimeItemClass(): "time-item"+this.setTimeItemClass()} key={item} onClick={this.selectRunTime.bind(this,index)}>
            {this.renderDateDisplay(item)}
         </div>
        ));    
    } else {
      return <Error />;
    }
  }

  renderError = () =>!this.state.serverError ?"":
      <span className="error-msg">
        Fail to get data from server, using local data
      </span>
   

  
  renderRadioDateDisplayType =() =><form>
                                        <label className="radio-inline"><input type="radio" name="dateDisplayType " value="hour" checked={this.state.dateDisplayType === "hour"} onChange={this.timeDisplayOptionChange}/>Hour</label>
                                        <label className="radio-inline"><input type="radio" name="dateDisplayType " value="date" checked={this.state.dateDisplayType === "date"} onChange={this.timeDisplayOptionChange}/> Date</label>
                                   </form>
  renderRadioHourType =() => <form>
                                <label className="radio-inline"><input type="radio" name="hourCount" value="1" checked={this.state.displayCount === '1'} onChange={this.timeNumberOptionChange}/>1 hour</label>
                                <label className="radio-inline"><input type="radio" name="hourCount" value="6" checked={this.state.displayCount === '6'} onChange={this.timeNumberOptionChange}/>6 hour</label>
                                <label className="radio-inline"><input type="radio" name="hourCount" value="12" checked={this.state.displayCount === '12'} onChange={this.timeNumberOptionChange}/>12 hour</label>
                            </form>
                            
  renderRadioButtons = ()=>  <div className="time-display-select-bar">
                                <div >
                             {this.renderRadioDateDisplayType()}
                             </div>
                                <div >
                             {this.renderRadioHourType()}  
                                </div>
                            </div>
  render = () =><div className="time-section">
                <div className={ this.state.isFullNav? (this.state.displayCount === "6" || this.state.displayCount === "12")?"dtg-time-bar small-time-bar":"dtg-time-bar dtg-time-bar-full"
                                  : (this.state.displayCount === "6" || this.state.displayCount === "12")?"dtg-time-bar small-time-bar" : "dtg-time-bar"
                                }>
                 {this.renderItems()}
                </div>              
                <div className="glyphicon glyphicon-plus-sign time-bar-icon" onClick={this.collapse.bind(this)} tilte="Scrolling"/>                                
                {this.renderRadioButtons()}                                          
                {this.renderSingleRunSlider()}
                </div>

}

export default SingleRun;
