import React, { Component } from 'react';
import logo from './logo.svg';
import nistLogo from './nistlogo.svg';
import './App.css';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import IconButton from 'material-ui/IconButton';
import Github from 'mui-icons/ionicons/logo-github'
import Twitter from 'mui-icons/ionicons/logo-twitter'
import Linkedin from 'mui-icons/ionicons/logo-linkedin'
import NICEStepper from './Stepper';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-114902362-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          
          <h1 className="App-title"><img style={{marginRight:20}} src={logo} className="App-logo" alt="logo" />How NICE am I?</h1>
          <h2 className="App-intro"><i>NICE Cybersecurity Workforce Framework <span style={{fontSize:'x-small'}}>(unofficial) </span>Mapper</i></h2>
<a href="https://www.nist.gov/itl/applied-cybersecurity/nice/resources/nice-cybersecurity-workforce-framework" />
        </header>
        <div>
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <div>
					<Paper style={{marginBottom:8}} zDepth={2} rounded={true} >
        		<div className="App-intro">
        		  <span style={{display:'inline-block', fontSize:'80%', topMargin:15 }}>Are you building a career in CyberSec?
        		  You got skills, abilities and knowledge in different cyber-security <br/>disciplines but you still don't figure out the best role for your current profile?</span><br/>
        		 <span style={{display:'inline-block', fontSize:'100%', topMargin:5 }}><b>You are in the right place, </b></span><br/>
        		 <span style={{display:'inline-block', fontSize:'80%',topMargin:5}}>just follow the steps and find out your best match over the <a target='_blank' href='https://www.nist.gov/itl/applied-cybersecurity/nice/resources/nice-cybersecurity-workforce-framework'><img src={nistLogo} height={10} /></a> SP-800-181</span>
        		</div>
					</Paper>
          <NICEStepper/>
					<Divider />
					<Paper style={{topMargin:10}} zDepth={4} rounded={false} >
					<IconButton
      			href="https://github.com/luca-m/am-i-nice"
      			target="_blank"
    			><Github/></IconButton>
					<IconButton
      			href="https://www.linkedin.com/in/allemco/"
      			target="_blank"
    			><Linkedin/></IconButton>
					</Paper>
          </div>
          </MuiThemeProvider>
        </div> 
      </div>
    );
  }
}
export default App;
