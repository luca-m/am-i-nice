/*
 * NICEStepper.js
 * Copyright (C) 2018 lucam.ko@gmail.com
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import CircularProgress from 'material-ui/CircularProgress';

import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red200,red100,lightBlue100,green200,green300} from 'material-ui/styles/colors';

import Chip from 'material-ui/Chip';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import ReplayIcon from 'react-material-icons/icons/av/replay';
import RightIcon from 'react-material-icons/icons/hardware/keyboard-arrow-right';
import LeftIcon from 'react-material-icons/icons/hardware/keyboard-arrow-left';
import Avatar from 'material-ui/Avatar';

import {isMobile} from 'react-device-detect'


import InfiniteScroll from 'react-infinite-scroll-component';

import K from './K.json'; 
import S from './S.json'; 
import A from './A.json'; 
import T from './T.json'; 
import Profiles from './profiles.json'; 
import ImgMap from './imgmap.json'; 

var Numeral = require('numeral');

// cleanup profiles
Profiles.forEach(x=>{
  ['Tasks','Knowledge','Abilities','Skills']
  .forEach(e=>{
    x[e] = Array.from(new Set(x[e]))  
  })
})

class TKSAChips extends  React.Component {
	constructor(props) {
	  super(props);
    props.name // T,K,S,A
    props.owned
    props.missing
    props.tasks
		this.state={
			dialog:false,
			elem:{id:'',desc:''}
    }
  }
  showChipInfo=(id)=>{
		let reflist=[]
		switch (true){
				case id[0].toUpperCase()=='T': reflist=T; break;
				case id[0].toUpperCase()=='K': reflist=K; break;
				case id[0].toUpperCase()=='S': reflist=S; break;
				case id[0].toUpperCase()=='A': reflist=A; break;
		}
		var el=reflist.find(x=>x.id==id) || {id:'?',desc:'Something wrong, id "'+id+'" not found'};
		//console.log(id)
		//console.log(el)
		//console.log(reflist)
		this.setState({
			dialog:true,
			elem:el
		})
  }
	 handleClose = () => {
    this.setState({dialog: false,elem:{id:'',desc:''}});
  };
  render(){
		//console.log(this.props.owned)
    return (<div style={{ display: 'flex',
        flexWrap: 'wrap'}}>
			<Dialog
        title={"Details for "+this.state.elem.id}
        modal={false}
        open={this.state.dialog}
        onRequestClose={this.handleClose}
      >
      <span>{this.state.elem.desc}</span>
      </Dialog>

    {(this.props.owned||[]).map(e=>
      <Chip
        backgroundColor={green200}
        style={{fontSize:'xx-small'}}
        key={e}
        onClick={()=>{this.showChipInfo(e)}}
        labelStyle={{fontSize:'xx-small'}}
        style={{fontSize:'xx-small'}}
      > {e}</Chip>
      )
    }
    {(this.props.missing||[]).map(e=>
      <Chip
        backgroundColor={red100}
        style={{fontSize:'xx-small'}}
        key={e}
        onClick={()=>{this.showChipInfo(e)}}
        labelStyle={{fontSize:'xx-small'}}
        style={{fontSize:'xx-small'}}
      > {e}</Chip>
      )
    }
    {(this.props.tasks||[]).map(e=>
      <Chip
        backgroundColor={lightBlue100}
        style={{fontSize:'xx-small'}}
        key={e}
        onClick={()=>{this.showChipInfo(e)}}
        labelStyle={{fontSize:'xx-small'}}
        style={{fontSize:'xx-small'}}
      > {e}</Chip>
      )
    }
    </div>);
  }
}

class ProfileBadges extends React.Component {
	constructor(props) {
	  super(props);
		this.state={
    }
  }
	get_avatar_for=(keycode)=>{
			if (ImgMap[keycode]){ return './imgs/'+ImgMap[keycode]; }		
			else {  return './imgs/worker.svg'; }
	}
  render(){
    //  <ChipMatchMissing name='K' owned={p.owned.k} missing={p.missing.k} />
    return (
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-around'}}>
        { 
          this.props.profiles.map((p)=>
           <Card key={p.pid}>
					 <CardHeader
					   title={p.name}
					   subtitle={`Match ${ Numeral(p.score.avg).format('0.0%')}`}
					   avatar={
								<Avatar
									style={{margin: 5}}
        				  src={this.get_avatar_for(p.pid)}
        				  size={60}
        				/>
								
						 }
					 />
           <span><b>{p.pid}</b>: {p.desc}</span>
           <List style={{textAlign:'left'}}>
					 <Subheader>Tasks </Subheader>
           <ListItem><TKSAChips tasks={p.tasks}/></ListItem>
					 <Subheader>Knowledge ({Numeral(p.score.k).format('0.0%')})</Subheader>
           <ListItem><TKSAChips owned={p.owned.k} missing={p.missing.k}/></ListItem>
					 <Subheader>Skills ({Numeral(p.score.s).format('0.0%')})</Subheader>
           <ListItem><TKSAChips owned={p.owned.s} missing={p.missing.s}/></ListItem>
					 <Subheader>Abilities ({Numeral(p.score.a).format('0.0%')})</Subheader>
           <ListItem><TKSAChips owned={p.owned.a} missing={p.missing.a}/></ListItem>
           </List>
           <div>
           </div>

           </Card>
          )
        }
    </div>);
  }
}


function compute(re,callback){
    var e={data:re}
    setTimeout(()=>{
      console.log('computing with ',e.data);
      var sk=e.data.k||[];
      var ss=e.data.s||[];
      var sa=e.data.a||[];
      var pp=e.data.p||[];
      let topn=e.data.topn||6;
      let match=[];
      try{
        match=pp.map(p=>{ 
        let score_k=p.Knowledge.filter(e=>sk.indexOf(e)!=-1).length / p.Knowledge.length;
        let score_s=p.Skills.filter(e=>ss.indexOf(e)!=-1).length/ p.Skills.length;
        let score_a=p.Abilities.filter(e=>sa.indexOf(e)!=-1).length/ p.Abilities.length;
        return {
          score:{ 
            k:score_k,
            s:score_s,
            a:score_a, 
            avg:(score_k+score_s+score_a)/3 
          },
          p:p, 
          pid:p.id, 
          name:p.WorkRoleName,
          desc:p.WorkRoleDescription,
          tasks:p.Tasks,
        };
      })
      .sort((a,b)=>b.score.avg-a.score.avg)
      .slice(0,topn)
      .map(x=>{
        x.missing={
            k:x.p.Knowledge.filter(e=>sk.indexOf(e)==-1),
            s:x.p.Skills.filter(e=>ss.indexOf(e)==-1),
            a:x.p.Abilities.filter(e=>sa.indexOf(e)==-1)
        };
        x.owned={
            //k:sk.filter(e=>{x.p.Knowledge.indexOf(e)==-1}),
            //s:ss.filter(e=>{x.p.Skills.indexOf(e)==-1} ),
            //a:sa.filter(e=>{x.p.Abilities.indexOf(e)==-1})
            k:x.p.Knowledge.filter(e=>sk.indexOf(e)!=-1),
            s:x.p.Skills.filter(e=>ss.indexOf(e)!=-1),
            a:x.p.Abilities.filter(e=>sa.indexOf(e)!=-1)
        }
        delete x.p;
        return x;
      });
      }
      catch(err){console.error('[!] worker error:',err); }
      console.log('computation complete ',match);
      callback({data:match});
    },500)
}
// Webworker
const _matchWorker = () => {

  let onmessage = function(e){
    console.log('computing with ',e.data);
    var sk=e.data.k||[];
    var ss=e.data.s||[];
    var sa=e.data.a||[];
    var pp=e.data.p||[];
    let topn=e.data.topn||6;
    let match=[];
    try{
      match=pp.map(p=>{ 
      let score_k=p.Knowledge.filter(e=>sk.indexOf(e)!=-1).length / p.Knowledge.length;
      let score_s=p.Skills.filter(e=>ss.indexOf(e)!=-1).length/ p.Skills.length;
      let score_a=p.Abilities.filter(e=>sa.indexOf(e)!=-1).length/ p.Abilities.length;
      return {
        score:{ 
          k:score_k,
          s:score_s,
          a:score_a, 
          avg:(score_k+score_s+score_a)/3 
        },
        p:p, 
        pid:p.id, 
        name:p.WorkRoleName,
        desc:p.WorkRoleDescription,
        tasks:p.Tasks,
      };
    })
    .sort((a,b)=>b.score.avg-a.score.avg)
    .slice(0,topn)
    .map(x=>{
      x.missing={
          k:x.p.Knowledge.filter(e=>sk.indexOf(e)==-1),
          s:x.p.Skills.filter(e=>ss.indexOf(e)==-1),
          a:x.p.Abilities.filter(e=>sa.indexOf(e)==-1)
      };
      x.owned={
          //k:sk.filter(e=>{x.p.Knowledge.indexOf(e)==-1}),
          //s:ss.filter(e=>{x.p.Skills.indexOf(e)==-1} ),
          //a:sa.filter(e=>{x.p.Abilities.indexOf(e)==-1})
          k:x.p.Knowledge.filter(e=>sk.indexOf(e)!=-1),
          s:x.p.Skills.filter(e=>ss.indexOf(e)!=-1),
          a:x.p.Abilities.filter(e=>sa.indexOf(e)!=-1)
      }
      delete x.p;
      return x;
    });
    }
    catch(err){console.error('[!] worker error:',err); }
    console.log('computation complete ',match);
    postMessage instanceof Function ? postMessage(match): null;
    return match;
  }
};
let code = _matchWorker.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));
const blob = new Blob([code], {type: "application/javascript"});

class ProfileMatch extends React.Component {
	constructor(props) {
	    super(props);
			this.state={
        computed:false,
        profiles:props.profiles,
        sel_k:props.sel_k,
        sel_s:props.sel_s,
        sel_a:props.sel_a,
        topn:props.topn||6,
        matched_profiles:[]
			}
	}
  componentWillMount(){
    //this.worker=new Worker(URL.createObjectURL(blob));

    //console.log(this.worker)
  }
  handleProfileMatchCompleted=(m)=>{
    //console.log(m.data)
    this.setState({ computed:true , matched_profiles:m.data})
  }
  render(){

    if (!this.state.computed){
      compute({
        k:this.props.sel_k,
        s:this.props.sel_s,
        a:this.props.sel_a,
        p:this.props.profiles,
        topn:this.props.topn},this.handleProfileMatchCompleted);
      //this.worker.onmessage = this.handleProfileMatchCompleted;
      //this.worker.onerror= (ex)=>{console.error('[!] worker exception',ex) }
      //this.worker.postMessage({
      //  k:this.props.sel_k,
      //  s:this.props.sel_s,
      //  a:this.props.sel_a,
      //  p:this.props.profiles,
      //  topn:this.props.topn});
      return (<div><CircularProgress size={80} thickness={5} /></div>)
    } else {
      return (<div><ProfileBadges profiles={this.state.matched_profiles}/></div>)
    }
  }
}




class ListFilterSelect extends React.Component {
	constructor(props) {
	  super(props);
		this.state={
      filt:'.',
      checked:[],
      currpage:0,
      currtot:0,
      pagesize:50
		}
	}
	handleKeyPress=(e)=>{
		 if (e.key === 'Enter') {
 				this.setState({
          currpage:0,
    		  filt: this.refs.quickfilter.input.value 
        });
    }
	}
  handleScrollEnd=(d)=>{
    setTimeout(()=>{
      this.setState({currpage:this.state.currpage+1})
    },50)
  }
  render(){
		let filt=(this.state.filt||' ').toLowerCase();
		let filtered=[];
		for (let i=0;i<this.props.list.length;i++){
			let k=this.props.list[i];
    	if ( String(k.desc).toLowerCase().indexOf(filt)!=-1 || 
					 String(k.id).toLowerCase().indexOf(filt)!=-1) { filtered.push(k); }
			
		}
    let tot=filtered.length;
    let torender=filtered.slice(0,this.state.currpage*this.state.pagesize+this.state.pagesize )
    //console.log(this.state.currpage,tot,torender, )
    return (
      <div id='container'>
			<div>
      <TextField style={{float:'left'}} ref="quickfilter"
         hintText="Quick Filter (Press Enter)"
         onKeyPress={this.handleKeyPress}
      />
			</div>
			<div style={{display:'inline-block', margin:0, width:'100%'}}>
      <InfiniteScroll class='App-list'
          next={this.handleScrollEnd}
          refresh={()=>{}}
          hasMore={(this.state.currpage*this.state.pagesize+this.state.pagesize) < tot?true:false}
          endMessage={
            <span style={{textAlign: 'center'}}>
            <b>Yay! No more left</b>
            </span>}
          loader={
            <div style={{position:'relative'}}><RefreshIndicator
               size={40}
               top={0}
               left={0}
               loadingColor="#FF9800"
               status="loading"
               style={{marginLeft: '50%'}}
            /> 
            </div>
          }
          useWindow={true}>
    		 <List style={{maxHeight: '100%', overflow: 'auto',float:'center' }}>
      	 {
				 		torender
    		     .map((k)=><ListItem 
      	         key={k.id} 
      	         leftCheckbox={<Checkbox defaultChecked={this.props.checked.indexOf(String(k.id))!=-1}  
      	         onCheck={(e,c)=>{this.props.onCheck(k.id,c)}} />} 
      	         primaryText={k.desc} 
      	         secondaryText={k.id}/>)
      	 }
    		 </List>
      </InfiniteScroll>
			</div>
    </div>
    );
  }
}

class NICEStepper extends React.Component {
  state = {
    finished: false,
    stepIndex: 0,
    stepmap:{0:'knowledge',1:'skills',2:'abilities',3:'profiles'},
    sel_k:new Set(),
    sel_s:new Set(),
    sel_a:new Set(),
    matching_p:[],
  };
  handleNext = () => {
    const {stepIndex} = this.state;
		//console.log(this.state.sel_k)
		//console.log(this.state.sel_s)
		//console.log(this.state.sel_a)
    window.scrollTo(0, 0);
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };
  handlePrev = () => {
    const {stepIndex} = this.state;
    window.scrollTo(0, 0);
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  handleCheck_K=(e,isChecked)=>{
		if (isChecked){ this.state.sel_k.add(e)}
		else { this.state.sel_k.delete(e)}
	};
  handleCheck_S=(e,isChecked)=>{
		if (isChecked){ this.state.sel_s.add(e)}
		else { this.state.sel_s.delete(e)}
	};
  handleCheck_A=(e,isChecked)=>{
		if (isChecked){ this.state.sel_a.add(e)}
		else { this.state.sel_a.delete(e)}
	};
	capFirst=(string)=>{
	   return string.charAt(0).toUpperCase() + string.slice(1);
	}
	NICEStep=(t)=>{
	 switch (t) {
			case 0: return(<Step><StepLabel>Select Knowledge</StepLabel></Step>);
			case 1: return(<Step><StepLabel>Select Skills</StepLabel></Step>);
			case 2: return(<Step><StepLabel>Select Abilities</StepLabel></Step>);
			case 3: return(<Step><StepLabel>Profile Match</StepLabel></Step>);
			default: return '';
		}
	}
	NICEBrief=(t)=>{
 		switch (t) {
			case 0: return(<span style={{ marginTop:20, marginBottom:20,display:'block'}}><i>"Various kinds of information applied directly to the performance of a function"</i></span>);
			case 1: return(<span style={{ marginTop:20, marginBottom:20,display:'block'}}><i>"A skill is the observable competence to perform a learned psychomotor act"</i></span>);
			case 2: return(<span style={{ marginTop:20, marginBottom:20,display:'block'}}><i>"Ability is competence to perform an observable behavior or a behavior that results in an observable product"</i></span>);
			default: return '';
		}
	}

  getStepContent=(stepIndex)=>{
		switch (stepIndex){
			case 0: return (<ListFilterSelect id={'lfs0'} list={K} checked={Array.from(this.state.sel_k)} onCheck={this.handleCheck_K}/>);
			case 1: return (<ListFilterSelect id={'lfs1'} list={S} checked={Array.from(this.state.sel_s)} onCheck={this.handleCheck_S}/>);
			case 2: return (<ListFilterSelect id={'lfs2'} list={A} checked={Array.from(this.state.sel_a)} onCheck={this.handleCheck_A}/>); 
			default: return 'NO' ;
		}
	};
  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex} orientation={isMobile?"vertical":"horizontal"}>
          {this.NICEStep(0)}
          {this.NICEStep(1)}
          {this.NICEStep(2)}
          {this.NICEStep(3)}
        </Stepper >
        <div style={contentStyle}>
          {finished ? (
            <div>
						  <ProfileMatch 
                  profiles={Profiles}
                  sel_k={Array.from(this.state.sel_k)}
                  sel_s={Array.from(this.state.sel_s)}
                  sel_a={Array.from(this.state.sel_a)}
                  topn={6}
              />	
							<FlatButton
							      href="#"
							      target="_blank"
                		onClick={(event) => {
                      window.scrollTo(0, 0);
                		  event.preventDefault();
                		  this.setState({stepIndex: 0, finished: false});
                		}}
							      label="Reset"
							      primary={true}
							      icon={<ReplayIcon />}
							    /> 
            </div>
          ) : (
            <div>
              <div style={{marginTop: 12, marginBottom:20}}>
                <FlatButton
                  icon={<LeftIcon/>}
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  icon={<RightIcon/>}
                  primary={true}
                  onClick={this.handleNext}
                />
              </div>
							<Divider />
          		{this.NICEBrief(stepIndex)}
							<Divider />
							<div>{this.getStepContent(stepIndex)}</div>
              <div style={{marginTop:12,marginBottom:12}}>
                <FlatButton
                  icon={<LeftIcon/>}
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  icon={<RightIcon/>}
                  primary={true}
                  onClick={this.handleNext}
                />
              </div>


            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NICEStepper;
