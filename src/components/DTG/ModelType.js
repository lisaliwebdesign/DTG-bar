import React, { Component } from 'react';

class ModelType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [

                {icon: 'glyphicon-asterisk',
                    name: 'ecop',
                    query: 'ecop'
                },
                {
                    icon: 'glyphicon-cloud',
                    name: 'eceps',
                    query: 'eceps'
                },
                {
                    icon: 'glyphicon-star',
                    name: 'gfsop',
                    query: 'gfsop'
                },
                {
                    icon: 'glyphicon-cog',
                    name: 'gfsens',
                    query: 'gfsens'
                },
                {
                    icon: 'glyphicon-tag',
                    name: 'uke4',
                    query: 'uke4'
                },
                {
                    icon: 'glyphicon-tint',
                    name: 'magma',
                    query: 'magma'
                }],
            showToggleNav: false


        };

    }
    getComponent = event =>{
        let navLink = document.getElementsByClassName('nav-link');
        //Remove all select
        for (let i = 0; i < navLink.length; i++) {
            if (/selected/.test(navLink[i].className)) {
                navLink[i].className = 'nav-link';
            }
        }
        //Set select
        event.currentTarget.className = "nav-link selected";
        this.props.setName(event._dispatchInstances.key);

    }
    toggleNav=()=>{
        let toggle = !this.state.showToggleNav;
        this.setState({
           showToggleNav: toggle          
        });
    }

    renderToggleNav =()=> <button type="button" className="pull-left btn btn-default visible-xs" onClick={this.toggleNav.bind(this)}  data-toggle="offcanvas" aria-expanded="false" aria-controls="navbar">
            <i className="glyphicon glyphicon-menu-hamburger"></i>
          </button>
    
    renderItems =()=>  this.state.data.map((item, index) => (
                    <li key={item.name} className={index === 0 ? 'nav-link selected' : 'nav-link'} onClick={this.getComponent.bind(this)} ><a href="#" className="gi-x"><span className={`glyphicon ${item.icon}`}></span>{item.name} <i className='glyphicon glyphicon-menu-right' style={{float: 'right' }}/></a></li>
                        ));
       

    render =()=> <div className={this.state.showToggleNav?"side-menu active":"side-menu"}>
                        {this.renderToggleNav()}
                    <nav className="navbar navbar-default" role="navigation">
                        <div className="side-menu-container">
                            <ul className="nav navbar-nav">
                            {this.renderItems()}
                            </ul>                
                        </div>
                    </nav>
                </div>
        
      
}

    export default ModelType;
