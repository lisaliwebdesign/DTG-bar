import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment-timezone';
import Error from './Error';
import SingleRun from './SingleRun';



class ModelIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullNav: false,
            ModelDTGData: [],
            DTGData: [],
            seletedRun: '',
            serverError: false,
            error: false,
            seletedRunIndex: 0,
            name: this.props.name
            
        };
    }
    //Update state when recevie changes from parent
    componentWillReceiveProps(nextProps) { 
       this.setState({
            name: nextProps.name,
             isFullNav: false,
            ModelDTGData: [],
            DTGData: [],
            seletedRun: '',
            serverError: false,
            error: false,
            seletedRunIndex: 0
       });
       this.getData.serverModelData();
    }
    
    //Get data from server and local
    getData = {
        key: 'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiYjg5NGM4ZjYxOTZiYmQ0ODliYzRhNmY3MjkzMDFiOTUifQ.IMpK5OApC9ViHJ3cCaNwcHFST-EsrqKEl_0BOlt0fWU',
        localModelData: () => {
            this.setState({
                serverError: true
            });
            let filePath = 'data/'+this.state.name+'.json';
            axios.get(filePath)
                    .then((response) => {
                        let sortedData = response.data.data.sort((a,b) => {
                        return new Date(a).getTime() - new Date(b).getTime()}).reverse();
                        this.setState({
                            ModelDTGData: sortedData
                        });
                        return sortedData[0];
                    })
                    .then((data) => {
                        this.getData.localSingleDateRunData(data);
                    })
                    .catch((error) => {
                        this.setState({
                            error: true
                        });
                    });
        },
        localSingleDateRunData: (seletedRun) => {
            let dataItem = '';
            let filePath='data/'+this.state.name+'-dtg.json';
            axios.get(filePath)
                    .then((response) => {
                        response.data.forEach(function (item, index) {
                            if (item.request.parameters.issue === seletedRun) {
                                dataItem = item.data;
                            }
                        });
                        return dataItem;
                    })
                    .then((data) => {
                        let findIndex = data.map(e => e).indexOf(this.state.ModelDTGData[0]);
                        this.setState({
                            DTGData: data,
                            seletedRun:seletedRun,
                            seletedRunIndex: findIndex
                        });
                    })
                    .catch((error) => {
                        this.setState({
                            error: true
                        });
                    });

        },
        serverModelData: () => {
            let url = `http://api.metdesk.com/get/metdesk/v1/powergen/issues?model=${this.state.name}`;
            axios.get(url, {headers: {'Authorization': this.getData.key}})
                    .then((response) => {
                        this.setState({
                            ModelDTGData: response.data.data
                        });
                        return response.data.data[0];
                    })
                    .then((data) => {
                        this.getData.serverSingleDateRunData(data);
                    })
                    .catch((error) => {
                        console.log('Fail to get data from server, use local data');
                        this.getData.localModelData();
                    });
        },
        serverSingleDateRunData: (seletedRun) => {
            let url = `http://api.metdesk.com/get/metdesk/v1/powergen/dtgs?model=${this.state.name}&issue=${seletedRun}`;
            axios.get(url, {headers: {'Authorization': this.getData.key}})
                    .then((response) => {
                        this.setState({
                            DTGData: response.data.data
                        });
                    })
                    .catch((error) => {
                        console.log('Fail to get data from server, use local data');
                        this.getData.localSingleDateRunData(seletedRun);
                    });
        }

    }

    componentDidMount = () => this.getData.serverModelData();
    
    //Page trigger function
    collapse = event => {
                //glyphicon glyphicon-chevron-down scrolling
        let isCollapse = false;
        let setClassName = 'glyphicon scrolling ';
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
    setItemClassName = () => 'item-seleted';
    getComponent = event => {
                //Get itme class
                let navLink = document.getElementsByClassName('utc-run-item');
                let latestItemClass = '';
                let selectedKey = event._dispatchInstances.key !==null? event._dispatchInstances.key:this.state.ModelDTGData[0];
                //Remove all select itme class
                for (let i = 0; i < navLink.length; i++) {                  
                    if (/item-seleted/.test(navLink[i].className)) {
                        navLink[i].className = 'utc-run-item' + latestItemClass;
                    }
                }
                //Add select class
                if (/latest-item/.test(event.currentTarget.className)) {
                        latestItemClass = ' latest-item';
                    }
                event.currentTarget.className = "utc-run-item item-seleted" + latestItemClass;
                //Get single run              
                this.getData.serverSingleDateRunData(selectedKey);

    }

    
    //Rendering section
    renderItems = () => this.state.error ? <Error /> :  this.state.ModelDTGData.map((item, index) => (
                    <div className= {index ===0? "utc-run-item item-seleted" : 'utc-run-item'}  key={item} tabIndex={index} onClick={this.getComponent.bind(this)}>
                        <Moment tz="UTC" format="DD-MM-YYYY HH:mm z">
                        {item}
                        </Moment>
                    </div>
                    ));
    renderError = () => this.state.serverError ? <span className='error-msg'>Fail to get data from server, using local data</span> : '';

    renderSingleRun = () => this.state.DTGData.length !== 0 ? <SingleRun data={this.state.DTGData} seletedRunIndex={this.state.seletedRunIndex} latestDate={this.state.ModelDTGData[0]} setDate={this.state.DTGData[0]} /> : '';

    render = () => this.state.error ? 
                <Error />:
                <div className="data-selection">

                    {this.renderError()}
                    <div className={this.state.isFullNav?'dtg-top-bar dtg-top-bar-full':'dtg-top-bar'}>    
                    <div className='latest-item utc-run-item item-seleted' onClick={this.getComponent.bind(this)}>Latest data</div>
                    {this.renderItems()}
                </div>
                <div className="glyphicon glyphicon-plus-sign scrolling" onClick={this.collapse.bind(this)} tilte='Scrolling'></div>
                    {this.renderSingleRun()}              
                </div>
      
}

export default ModelIssue;
