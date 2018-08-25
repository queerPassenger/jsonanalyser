import React from 'react';
import styleGen from './inlineStyle.js';
class JSONAnalyser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            renderComponent:false,
        }
        this.jsonToAnalyse={},     
        this.searchedWord={
            input:"",
            toSearch:"",
            currInd:1,
            matchedRefs:[],
            caseMatch:false,
            wholeWordMatch:false,
        },      

        this.count=-1;
        this.highLightCount=1;

        this.collapseSet=[];
        this.collapseFlag=true;

        this.fullScreen=false;
        
        this.errorHelper='';
        this.jsHelperTip='';

        this.style={};    
        
    }
    componentDidMount(){
        let json={"array":[1,2,3],"boolean":true,"null":null,"number":123,"object":{"a":"b","c":"d","e":"f"},"string":"Hello World"};
        let defaultInput=JSON.stringify(json, null, "\t");
        this.refs['lhs'].innerText=localStorage.getItem('input')?localStorage.getItem('input'):defaultInput;
    }
    componentDidUpdate(prevProps, prevState){
        this.refs['searchWordResult'].innerHTML=this.searchedWord.toSearch===''?'':+this.searchedWord.matchedRefs.length===0?'No Results':this.searchedWord.currInd+'/'+this.searchedWord.matchedRefs.length;
        if(this.searchedWord.matchedRefs.length!==0){
            if(this.searchedWord.matchedRefs[this.searchedWord.currInd-1]){
                document.getElementById(this.searchedWord.matchedRefs[this.searchedWord.currInd-1]).scrollIntoView();
                document.getElementById(this.searchedWord.matchedRefs[this.searchedWord.currInd-1]).classList.add("currentIndMatch");
            }
        }
    }   
    handleFullScreen(){
        this.fullScreen=!this.fullScreen;
        this.renderComponent();
    }
    objectCombiner(_obj1,_obj2){
        let obj1=JSON.parse(JSON.stringify(_obj1));
        return Object.assign(obj1,_obj2);
    }
    handleCollExp(flag){
        if(flag){
            this.collapseFlag=!this.collapseFlag;
        }
        else{
            this.collapseFlag=flag
        }
        let newSet=[];
        this.collapseSet.map((obj)=>{
            newSet.push(this.collapseFlag);
        })
        this.collapseSet=newSet;
        this.renderComponent();
    } 
    handleCollapse(count){
        this.collapseSet[count]=!this.collapseSet[count];
        this.renderComponent();
    }
    valueHint(type,actualVal){
        let valHint="";
        if(type==='Object'){
            let keys=Object.keys(actualVal);
            valHint='Object '+'{'+keys.length+'}';
        }
        else if(type==='Array'){
            valHint='Array '+'['+actualVal.length+']';
        }
        return valHint;
    }
    handleAnalyser(){
       let innerText = this.refs['lhs'].innerText  // using innerText here because it preserves newlines
        if(innerText[innerText.length-1] === '\n') {
            innerText = innerText.slice(0,-1) ;          
            // get rid of weird extra newline
        }
       // let output=innerText.replace(/(\r\n\t|\n|\r\t|[^\S ]+)/gm,""); 
        innerText=this.jsonFurnace(innerText);
        this.errorHelper='';
        this.collapseFlag=true;
        this.collapseSet=[];
        this.jsHelperTip='' ;
        let jsonOutput={};
        this.jsonToAnalyse=jsonOutput;
        try{
            jsonOutput=JSON.parse(innerText);
        }
        catch(err){
            console.log('err',err);
            this.errorHelper=err.toString();
            this.renderComponent();
            return;
        }
        this.jsonToAnalyse=jsonOutput;               
        localStorage.setItem("input",innerText);
        this.renderComponent();
    }
    jsonFurnace(_in){
        let _out='';
        let _single=false;
        let _double=false;
        for(let i=0;i<_in.length;i++){
            let _c=_in[i];
            let _regex='';
            if(_c==="'"){
                _single=!_single;
            }
            else if(_c==='"'){
                _double=!_double;
            }
            else{
                if(!(_single || _double)){
                    _regex=/\s/g;
                }
            }
            _out+=_c.replace(_regex,'');
        }
        return (_out);
    }
    handleInput(objKey){
        this[objKey].input=this.refs[objKey].value;
        this.renderComponent();
    }
    handleKeyInput(e){
        if(e.keyCode===13){
            this.searchedWord.toSearch=this.searchedWord.input.trim();
            this.handleCollExp(false);
            if(this.searchedWord.matchedRefs.length!==0){
                if(this.searchedWord.matchedRefs.length>this.searchedWord.currInd){
                    this.searchedWord.currInd+=1;     
                }
                else{
                    this.searchedWord.currInd=1;                             
                }
            }
            this.renderComponent();
        }
        else{
            this.searchedWord.matchedRefs=[];
            this.searchedWord.toSearch='';
            this.searchedWord.currInd=1;
        }
    }
    findMultipleMatch(_op1,_op2,_operator1,wholeWordMatch){       
        let _html='';
        let _flag=false;
        let tempToCheck='';
        
        let _strWithoutMatchWord=_op1.split(_op2).join('');
        if(_strWithoutMatchWord.length===0){
            this.highLightCount+=1;
            let refName='highLightCount'+this.highLightCount;            
            _flag=true;
            _html='<span class="highlight_search" id='+refName+'>'+_operator1+'</span>';            
            if(this.searchedWord.matchedRefs.indexOf(refName)===-1){
                this.searchedWord.matchedRefs.push(refName);
            }
        }
        else{
            let i=0;
            for(i=0;i<_strWithoutMatchWord.length;i++){
                if(_strWithoutMatchWord[i]===_op1[i]){
                    tempToCheck+=_operator1[i];
                    if(i===(_strWithoutMatchWord.length-1)){
                        _html+='<span class="">'+tempToCheck+'</span>';
                    }
                }
                else{
                    this.highLightCount+=1;
                    let refName='highLightCount'+this.highLightCount;
                    _flag=true;  
                    let matchedWord=_operator1.substring(i,i+_op2.length);
                    _html+='<span class="">'+tempToCheck+'</span><span class="highlight_search" id='+refName+'>'+matchedWord+'</span>';
                    if(this.searchedWord.matchedRefs.indexOf(refName)===-1){
                        this.searchedWord.matchedRefs.push(refName);
                    }
                    tempToCheck='';
                    _strWithoutMatchWord=_strWithoutMatchWord.substring(0,i)+matchedWord+_strWithoutMatchWord.substring(i,_strWithoutMatchWord.length);
                    i=i+matchedWord.length-1;
                }
            }
            if(_strWithoutMatchWord.length!==_op1.length){
                 this.highLightCount+=1;
                 let refName='highLightCount'+this.highLightCount;
                _flag=true;
                _html+='<span class="highlight_search" id='+refName+'>'+_operator1.substring(i,i+_op2.length)+'</span>';
                if(this.searchedWord.matchedRefs.indexOf(refName)===-1){
                    this.searchedWord.matchedRefs.push(refName);
                }
            }
        }
        return{
            _html,
            _flag
        }
    }
    checkMatch(valueToCheck){
        let _operator1=valueToCheck+'';
        let _operator2=this.searchedWord.toSearch;
        let _op1='';
        let _op2='';
        let _htmlStr='';
        if(_operator2===''){
            return '<span>'+' '+_operator1+'</span>';
        }
        if(this.searchedWord['caseMatch']){
            _op1=_operator1;
            _op2=_operator2;
        }
        else{
            _op1=_operator1.toLowerCase();
            _op2=_operator2.toLowerCase();
        }
        if(this.searchedWord['wholeWordMatch']){
            if(_operator1.length!==_operator2.length){
                return '<span>'+' '+_operator1+'</span>';
            }
        }
        let matchObj=this.findMultipleMatch(_op1,_op2,_operator1,this.searchedWord['wholeWordMatch']);
        return matchObj._html;
    }

    handleInputFeature(_type){
        this.searchedWord[_type]=!this.searchedWord[_type];
        this.renderComponent();
    }
    
    handleJSHelper(jsHelper){
        this.jsHelperTip=jsHelper;
        this.renderComponent();
    }
    analyser(val,_jsHelper){
        let randStr=Math.random().toString(36).substring(7);
        let type=Object.prototype.toString.call(val).split(' ')[1].replace(']','');
        
        if(type==='String' || type==='Number' || type==='Date' || type==='Null' || type==='Boolean'){
            let count=this.count;
            return(
                <div className={"value_wrapper "} ref={"value_wrapper_"+count} title={'DataType :'+type} style={this.objectCombiner(this.style['valueStyle'],this.style[type+'Val'])}>
                    <span dangerouslySetInnerHTML={{__html:this.checkMatch(val)}} onClick={this.handleJSHelper.bind(this,_jsHelper)}/>
                </div>
            )
        }
        else if(type==='Object'){
            let keys=Object.keys(val);
            return(
                <div className="object_parent_wrapper" style={this.style['object_parent_wrapper']} >
                    {keys.map((key,ind)=>{
                        let subType=Object.prototype.toString.call(val[key]).split(' ')[1].replace(']','');
                        let flag=(subType==='String' || subType==='Number' || subType==='Date' || subType==='Null' || subType==='Boolean')?true:false;
                        this.count++;
                        let count=this.count;
                        
                        if(!(this.collapseSet[count])){
                            this.collapseSet.push(true);
                        }
                        if(flag){
                            this.collapseSet[count]=false;
                        }
                        let jsHelper=_jsHelper;
                        jsHelper+='["'+key+'"]';
                        return(
                            <div className="object-wrapper" style={this.style['object_parent_wrapper']} key={randStr+ind}>
                                <div className="collapsable" data-count={count} style={this.style['collapsable-icon']} onClick={this.handleCollapse.bind(this,count)} >
                                    {!flag?
                                        this.collapseSet[count]?
                                            <img src="img/expandIcon.png" style={this.style['plusIcon']}></img>
                                        :
                                            <img src="img/collapseIcon.png" style={this.style['minusIcon']}></img>
                                    :
                                        null
                                    }
                                </div>
                                <div className="object-key"  ref={"object-key"+count} style={flag?this.style['keyIndStyle']:this.style['keyIndFloatStyle']} >
                                    <span dangerouslySetInnerHTML={{__html:this.checkMatch(key)}} onClick={this.handleJSHelper.bind(this,'Object.keys('+_jsHelper+')['+ind+']')}/>
                                    {flag?
                                        <span>:</span>
                                    :
                                        null
                                    }
                                </div>
                                {!flag?
                                    <span className="valHint" style={this.style['valHint']} >
                                        {this.valueHint(subType,val[key])}
                                    </span>
                                :
                                    null
                                }
                                <div className='' style={this.collapseSet[count]?this.style['hide']:{}}>
                                    <div className="object-val" style={flag?this.style['valStyle']:{}}>
                                        {this.analyser(val[key],jsHelper)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
        else if(type==='Array'){            
            return(
                <div className="array_parent_wrapper" style={this.style['array_parent_wrapper']} >
                    {val.map((json,ind)=>{
                        let subType=Object.prototype.toString.call(json).split(' ')[1].replace(']','');
                        let flag=(subType==='String' || subType==='Number' || subType==='Date' || subType==='Null' || subType==='Boolean')?true:false;
                        this.count++;
                        let count=this.count;
                        
                        if(!(this.collapseSet[count])){
                            this.collapseSet.push(true);
                        }
                        if(flag){
                            this.collapseSet[count]=false;
                        }
                        let jsHelper=_jsHelper;
                        jsHelper+='["'+ind+'"]';
                        return(
                            <div className="array-wrapper" style={this.style['object_parent_wrapper']} key={randStr+ind}>
                                <div className="collapsable" data-count={count} style={this.style['collapsable-icon']} onClick={this.handleCollapse.bind(this,count)} >
                                    {!flag?
                                        this.collapseSet[count]?
                                            <img src="img/expandIcon.png" style={this.style['plusIcon']}></img>
                                        :
                                            <img src="img/collapseIcon.png" style={this.style['minusIcon']}></img>
                                    :
                                        null
                                    }
                                </div>
                                <div className="array-ind" ref={"array-ind"+count} style={flag?this.style['keyIndStyle']:this.style['keyIndFloatStyle']} >
                                    <span dangerouslySetInnerHTML={{__html:this.checkMatch(ind)}}  onClick={this.handleJSHelper.bind(this,'Object.keys('+_jsHelper+')['+ind+']')}/>
                                    {flag?
                                        <span>:</span>
                                    :
                                        null
                                    }
                                </div>
                                {!flag?
                                    <span className="valHint" style={this.style['valHint']} >
                                        {this.valueHint(subType,json)}
                                    </span>
                                :
                                    null
                                }
                                <div className='' style={this.collapseSet[count]?this.style['hide']:{}}>
                                    <div className="array-val" style={flag?this.style['valStyle']:{}}>
                                        {this.analyser(json,jsHelper)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
        else{
            return(
                <div>
                </div>
            )
        }
       
    }
    renderComponent(){
        this.setState({
            renderComponent:!this.state.renderComponent,
        })
    }
    render(){
        this.style=styleGen();
        this.count=-1;
        this.searchedWord.matchedRefs=[];
        this.highLightCount=-1;
        let type=Object.prototype.toString.call(this.jsonToAnalyse).split(' ')[1].replace(']','');
        let flag=(type==='String' || type==='Number' || type==='Date' || type==='Null' || type==='Boolean')?true:false;
        this.count++;
        let count=this.count;
        
        
        if(!(this.collapseSet[count])){
            this.collapseSet.push(true);
        }
        if(flag){
            this.collapseSet[count]=false;
        }
        let jsHelper='_object';
        return(
            <div className="jsonanalyser_container" style={this.style['container']}>
                <div className="lhs_container" style={this.fullScreen?this.objectCombiner(this.style['innerContainer'],this.style['lhs']):this.style['innerContainer']}>
                    <div className="lhs_header">
                        <span className="lhs_header_title">
                            Input
                        </span>
                       
                    </div>
                    <div className="errorHelper">
                        {this.errorHelper===''?'':this.errorHelper}
                    </div>
                    <div className="lhs_editor" ref="lhs" contentEditable={"true"} style={this.style['lhsEditor']}>
                    </div>
                </div>
                <div className="cs_container" style={this.fullScreen?this.objectCombiner(this.style['innerContainer'],this.style['cs']):this.style['innerContainer']}>
                    <div className="right_arrow_container" style={this.style['right_arrow_container']}>
                       {/*  <img src="img/rightArrow.png" className="rightArrow_img"></img> */}
                       <div className="dots_wrapper">
                            <span className="dots">
                            </span>
                       </div>
                       <button  onClick={this.handleAnalyser.bind(this)}>{">"}</button>
                       <div className="dots_wrapper">
                            <span className="dots">
                            </span>
                       </div>
                    </div>
                </div>
                <div className="rhs_container" style={this.fullScreen?this.objectCombiner(this.style['innerContainer'],this.style['rhs']):this.style['innerContainer']}>
                    <div className="rhs_header">
                        <span className="rhs_header_title">
                            Output
                        </span>
                        <span className="rhs_fullScreen" title={this.fullScreen?"Normal Screen mode":"Full Screen mode"} onClick={this.handleFullScreen.bind(this)}>
                            <img src="img/fullScreen.png" alt="image" width="20"></img>
                        </span>
                        <span className="rhs_collapseExpand" title={this.collapseFlag?"Expand all":"Collapse all"} onClick={this.handleCollExp.bind(this)}>
                            <img src={this.collapseFlag?"img/expandAll.png":"img/collapseAll.png"} alt="image" width="15"></img>
                        </span>
                         {/* <img 
                            src="img/wholeWordMatch.png"
                            className={"wholeWordMatch "+(this.searchedWord['wholeWordMatch']?'inputFeatureSelected':'')} 
                            width="22"
                            onClick={this.handleInputFeature.bind(this,'wholeWordMatch')}
                        /> */}
                        <img 
                            src="img/caseMatch.png"
                            className={"caseMatch "+(this.searchedWord['caseMatch']?'inputFeatureSelected':'')} 
                            width="20"
                            onClick={this.handleInputFeature.bind(this,'caseMatch')}
                        />
                        <span className="searchIcon">
                            <input type="text" className="searchInput" placeholder="Search for key/value" ref="searchedWord" value={this.searchedWord.input} onKeyDown={this.handleKeyInput.bind(this)} onChange={this.handleInput.bind(this,'searchedWord')}></input>
                        </span>    
                        <span className="searchWordResult" ref="searchWordResult" id="searchWordResult">
                            
                        </span>                    
                    </div>
                    <div className="jsHelper">
                        {this.jsHelperTip===''?'Javascript Helper - Click any node to parse the json (var _object = json)':this.jsHelperTip}
                    </div>
                    <div className="rhs_editor" style={this.style['rhsEditor']}>
                        <div className="collapsable" data-count={count} style={this.style['collapsable-icon']} >
                            {!flag?
                                this.collapseSet[count]?
                                    <img src="img/expandIcon.png" style={this.style['plusIcon']} onClick={this.handleCollapse.bind(this,count)} ></img>
                                :
                                    <img src="img/collapseIcon.png" style={this.style['minusIcon']}onClick={this.handleCollapse.bind(this,count)} ></img>
                            :
                                null
                            }
                        </div>                   
                        <span className="valHint" style={this.style['valHint']} >
                            {this.valueHint(type,this.jsonToAnalyse)}
                        </span>
                        <div className=''  style={this.collapseSet[count]?this.style['hide']:{}}>
                            {this.analyser(this.jsonToAnalyse,jsHelper)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default JSONAnalyser;