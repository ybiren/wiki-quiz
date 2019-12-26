import React, {Component, useState} from 'react';
import './wiki.scss'
import {Svc} from '../../services/svc'
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import {Modal,Button} from 'react-bootstrap'
import { DualRing } from 'react-spinners-css';


const numAnswrs = 4;

export class Wiki extends Component {
     constructor(props) {
         super(props);
         this.state = {};
         this.wikiSvc = new Svc();  

     }
    componentDidMount() {
      this.genWikiQues();
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let color = params.get('color');
      this.setState({color: color});
    }
    
    genWikiQues() {
      this.setState({questArr:[], ansArr:[], userAnsInd: null});
      const questPromiseArr = [];
      for(let i=0;i<numAnswrs;i++) {
        questPromiseArr.push(this.wikiSvc.getWikiQuestion()); 
      }
      Promise.all(questPromiseArr).then((questArr)=> { 
        const ansPromiseArr = [];
        questArr.forEach(item=>ansPromiseArr.push(this.wikiSvc.getWikiAnswerForQuestion(item)));
        Promise.all(ansPromiseArr).then((ansArr)=> {
          const rightAnsInd = Math.floor((Math.random() * numAnswrs));
          const swap = ansArr[0];
          ansArr[0] = ansArr[rightAnsInd];
          ansArr[rightAnsInd] = swap;
          this.setState({questArr: questArr, ansArr: ansArr,rightAnsInd: rightAnsInd});
      
        },
        (error) => setTimeout(this.genWikiQues.bind(this)));
      });
    }
    
    checkAnswer(ind) {
      let numRightAns = this.state.numRightAns ? this.state.numRightAns : 0;
      let numWrongAns = this.state.numWrongAns ? this.state.numWrongAns : 0;
      ind == this.state.rightAnsInd ? numRightAns++ : numWrongAns++; 
      this.setState({userAnsInd: ind, numRightAns: numRightAns,numWrongAns: numWrongAns});
      setTimeout(this.genWikiQues.bind(this),3000);
    }
    
    isQuestionReady() {
      return this.state.questArr && this.state.questArr.length && this.state.ansArr && this.state.ansArr.length; 
    }
    
    renderHeader() {
      return <div className="row">
               <div className="col-12 text-center">
                 <div className="wikiHeader">Wiki quiz</div>
               </div> 
             </div>   
    }
    
    rendeQuest() {
      if(this.isQuestionReady()) {
        return <div className="row">
               <div className="col-11 offset-1">
                 <div className="quest-parent" onClick={()=>alert("quest")}>{this.state.questArr[0]}</div>
               </div>
             </div> 
      }
    }
    
    userAnswerCssClass(index) {

       let className = "";
       if(this.state.userAnsInd !== null) {
         if (this.state.rightAnsInd === index) {
           className = "right-ans";
           if(this.state.userAnsInd !== this.state.rightAnsInd) {
             className= "right-ans right-ans-signer-on-wrong-ans"; 
           }
         } 
         if (this.state.userAnsInd === index && this.state.userAnsInd !== this.state.rightAnsInd) {
           className = "wrong-ans";
         }
       } 
       return className;
    }

    renderAnsArr() {
     if(this.isQuestionReady()) {
      return this.state.ansArr.map((item,index) => {
        return <div className={`row ans-parent ${this.userAnswerCssClass(index)}`}> 
                 <div className="col-1 offset-1">
                 {index+1})
                 </div>
                 <div className="col-10">
                   <div onClick={()=> this.checkAnswer(index)}>{item}</div>
                 </div>
               </div>
        })
      } else {
        return <div class="row h-100"> 
           <div className="col-1 offset-5">
             <DualRing color="#000000" size={500} /> 
           </div>  
         </div>
      }
    }
    renderPieChart() {
      return <div className="container bottom-container">
              <div className="row h-48 align-items-center">
                <div className="offset-4 col-4 d-flex justify-content-center">
                  <ReactMinimalPieChart 
                  data={[
                    { title: 'Wrong Answers', value: this.state.numWrongAns, color: '#FF0000' },
                    { title: 'Right Answers', value: this.state.numRightAns, color: '#00FF00' },
                  ]}
                  label
                  labelStyle={{
                  fontSize: '5px',
                  fontFamily: 'sans-serif'
                  }}
                  radius={42}
                  labelPosition={112}
                />
                </div>
                <div className="offset-1 col-3">
                  <div><div className="legend-1">&nbsp;</div></div>
                  <div><div className="legend-2">&nbsp;</div></div>
                </div>   
              </div>
           </div>  
    }
    
    
    renderModal() {
      
      let show = false;
      const handleClose = () => show=false;
      //const handleShow = () => setShow(true);
      
      return <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
      </Modal>
    }

    render() {
      //const divStyle = {
        
      //};
      
      return <div className="component-wiki ">
        <div style={{"--color": this.state.color}} className={"container-fluid top-container " + (this.isQuestionReady() ? 'is-quest-shown' : 'is-spinner-shown')}>
          {this.renderHeader()}{this.rendeQuest()}{this.renderAnsArr()}
        </div>
          {this.renderPieChart()}
             
        {this.renderModal()}
      </div>
    }
  }
