import axios from 'axios';

export class Svc {
    
    constructor() {
      this.numAnswers = 4;
      this.questArr = [];
      this.baseWikiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query"; 
    }
    
    initAnsArr() {
        this.questArr = [];    
    }

    getWikiQuestion() {
        
      return new Promise((resolve,reject) => {
        axios.get(`${this.baseWikiUrl}&generator=random&grnnamespace=0&prop=images&origin=*`)
        .then(res => {
            resolve(this.getIssue()(res));
        });
      });
    }
    
    getWikiAnswerForQuestion(question) {
        
        question = question.replace(" ","%20");
        return new Promise((resolve,reject) => {
            axios.get(`${this.baseWikiUrl}&list=search&srsearch=${question}&format=json&srlimit=1&origin=*`)
            .then(res => {
                //console.log(JSON.stringify(res));
                const stripTxt = JSON.stringify(res).replace(/<[^>]+>/g, '');
                const verbArr =["is ","was ","are ","were "].filter((item)=> {
                    return stripTxt.indexOf(item) !== -1;   
                });
                if(verbArr.length) {
                  const verbIndexArr = [];
                  verbArr.forEach((item) => verbIndexArr.push(stripTxt.indexOf(item)));  
                  const firstIndexOfVerbFounded = Math.min(...verbIndexArr);
                  const from =  firstIndexOfVerbFounded; //stripTxt.indexOf(verbArr[relIndex]);
                  const strFrom = stripTxt.substring(from);
                  const toIndex = Math.min(strFrom.indexOf('.')===-1 ? 100000 : strFrom.indexOf('.') , strFrom.indexOf('"')===-1 ? 100000 : strFrom.indexOf('"'));  
                  resolve(`${strFrom.substring(0,toIndex)}.`);
                } else {
                    reject("connection word not founded");
                }
            });
        }); 
    }
    

    getIssue() {

        return (function() {
            let issue;
            function findTitle(jsonObj) { 
            for(let ky in jsonObj) {
                if(ky === 'title' && !issue) {
                  issue = jsonObj[ky]; 
                } 
                if(typeof(jsonObj[ky]) === "object") {
                  findTitle(jsonObj[ky]);
                }
              }
            }
            return function(jsonObj) {
              findTitle(jsonObj);
              return issue;
            }
          })();
    
    }
} 