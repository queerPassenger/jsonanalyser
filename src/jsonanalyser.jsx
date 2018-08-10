import React from 'react';

class JSONAnalyser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            renderComponent:false,
        }
        this.jsonToAnalyse={},
        this.analysedJSON={},

        this.count=-1;
        this.collapseSet=[];
        this.collapseFlag=true;

        this.style={
            container:{
               height:this.getHeight(window.innerHeight-(66+58)-5+10),         
               background:'#e8e8e8',     
            },
            innerContainer:{
                height:this.getHeight(window.innerHeight-(66+58)-45-80+10+10),
                marginTop:40,
                marginBottom:40
            },
            editor:{
                height:this.getHeight(window.innerHeight-(66+58)-45-80-50-10),
            },
            right_arrow_container:{
                top:this.getHeight(((window.innerHeight-(66+58)-45)/2)-50),               
            }
        }
        this.analysedStyle={};
        this.searchedWord={
            input:"",
            toSearch:"",
            matchedRefs:[],
            caseMatch:false,
            wholeWordMatch:false,
        }
    }
    componentDidMount(){
        this.refs['lhs'].innerText=JSON.stringify({
            "array": [
              1,
              2,
              3
            ],
            "boolean": true,
            "null": null,
            "number": 123,
            "object": {
              "a": "b",
              "c": "d",
              "e": "f"
            },
            "string": "Hello World"
          })
        this.computeAnalysedStyle();
    }
    computeAnalysedStyle(){
        this.analysedStyle['object_parent_wrapper']={
            paddingLeft:'2%',
        };
        this.analysedStyle['array_parent_wrapper']=this.analysedStyle['object_parent_wrapper'];
        this.analysedStyle['keyIndStyle']={
            float:'left',
            marginRight:'10px',
            fontSize:'18px',
            fontFamily:'Source Code Pro',
            fontWeight:'bold'
        };
        this.analysedStyle['keyIndFloatStyle']=JSON.parse(JSON.stringify(this.analysedStyle['keyIndStyle']));
        this.analysedStyle['keyIndFloatStyle']['float']='left';
        this.analysedStyle['valStyle']={
            marginLeft:'4%'
        };
        this.analysedStyle['valueStyle']={
            fontSize:'18px',
            fontFamily:'Source Code Pro',
            fontWeight:'bold',
            display:'inline-block'
        };
        this.analysedStyle['collapsable-icon']={
            width:'30px',
            float:'left',
            height:'20px'
        };
        this.analysedStyle['hide']={
            display:'none'
        };
        this.analysedStyle['valHint']={
            fontSize:'15px',
            fontFamily:'Source Code Pro',
            color:'gray',
            width:'100px',
            display:'inline-block',
            paddingTop:'5px',
            paddingBottom:'5px',
            paddingLeft:'10px'
        }
        this.renderComponent();
    }
    getHeight(height){
        if(height<=0){
            return 0
        }
        else{
            return height;
        }
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
        console.log(innerText);
        let jsonOutput=JSON.parse(innerText);
        this.jsonToAnalyse=jsonOutput;
        this.collapseFlag=true;
        this.collapseSet=[];
          
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
            this.renderComponent();
        }
    }
    checkMatch(valueToCheck,ref){
        //Type conversion to string
        let _operator1=valueToCheck+'';
        let _operator2=this.searchedWord.toSearch;
        let _op1='';
        let _op2='';
        let _htmlStr='';
        if(_operator2===''){
            return '<span>'+' '+_operator1+'</span>';
        }
        if(!(this.searchedWord['caseMatch'])){
            _op1=_operator1.toLowerCase();
            _op2=_operator2.toLowerCase();
        }
        else{
            _op1=_operator1;
            _op2=_operator2;
        }
        if(!(this.searchedWord['wholeWordMatch'])){
            return this.findMultipleMatch(_op1,_op2,_operator1,'')
            
        }
        else{
            return this.findMultipleMatch(_op1,_op2,_operator1,'')
        }
    }
    findMultipleMatch(_op1,_op2,_operator1,_html){
        let temp='';
        for(let i=0;i<_op1.length;i++){
            if(_op2.indexOf(_op1[i])===-1){
                _html+='<span class='+(temp.indexOf(_op2)===-1 || temp===''?'':'highlight_search')+'>'+temp+'</span>'+_operator1[i];
            }
            else{
                temp+=_operator1[i];
                if(i===_op1.length-1){
                    _html+='<span class='+(temp.indexOf(_op2)===-1 || temp===''?'':'highlight_search')+'>'+temp+'</span>';
                }
            }
        }
        console.log('_html',_html)
        return _html;
    }
    handleInputFeature(_type){
        this.searchedWord[_type]=!this.searchedWord[_type];
        this.renderComponent();
    }
    analyser(val){
        let randStr=Math.random().toString(36).substring(7);
        let type=Object.prototype.toString.call(val).split(' ')[1].replace(']','');
        
        if(type==='String' || type==='Number' || type==='Date' || type==='Null' || type==='Boolean'){
            let count=this.count;
            return(
                <div className={"value_wrapper "} ref={"value_wrapper_"+count} style={this.analysedStyle['valueStyle']}>
                    <span dangerouslySetInnerHTML={{__html:this.checkMatch(val,"value_wrapper_"+count)}} />;
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
                        return(
                            <div className="object-wrapper" style={this.analysedStyle['object_parent_wrapper']} key={randStr+ind}>
                                <div className="collapsable" data-count={count} style={this.analysedStyle['collapsable-icon']} onClick={this.handleCollapse.bind(this,count)} >
                                    {!flag?
                                        this.collapseSet[count]?
                                            <img src="img/expandIcon.png" width='31'></img>
                                        :
                                            <img src="img/collapseIcon.png" width='23'></img>
                                    :
                                        null
                                    }
                                </div>
                                <div className="object-key" style={flag?this.analysedStyle['keyIndStyle']:this.analysedStyle['keyIndFloatStyle']} >
                                    {(flag?(key+' : '):key)}
                                </div>
                                {!flag?
                                    <span className="valHint" style={this.analysedStyle['valHint']} >
                                        {this.valueHint(subType,val[key])}
                                    </span>
                                :
                                    null
                                }
                                <div className='' style={this.collapseSet[count]?this.analysedStyle['hide']:{}}>
                                    <div className="object-val" style={flag?this.analysedStyle['valStyle']:{}}>
                                        {this.analyser(val[key])}
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
                        return(
                            <div className="array-wrapper" style={this.analysedStyle['object_parent_wrapper']} key={randStr+ind}>
                                <div className="collapsable" data-count={count} style={this.analysedStyle['collapsable-icon']} onClick={this.handleCollapse.bind(this,count)} >
                                    {!flag?
                                        this.collapseSet[count]?
                                            <img src="img/expandIcon.png" width='31'></img>
                                        :
                                            <img src="img/collapseIcon.png" width='23'></img>
                                    :
                                        null
                                    }
                                </div>
                                <div className="array-ind" style={flag?this.analysedStyle['keyIndStyle']:this.analysedStyle['keyIndFloatStyle']} >
                                    {(flag?(ind+' : '):ind)}
                                </div>
                                {!flag?
                                    <span className="valHint" style={this.analysedStyle['valHint']} >
                                        {this.valueHint(subType,json)}
                                    </span>
                                :
                                    null
                                }
                                <div className='' style={this.collapseSet[count]?this.analysedStyle['hide']:{}}>
                                    <div className="array-val" style={flag?this.analysedStyle['valStyle']:{}}>
                                        {this.analyser(json)}
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
        this.count=-1;

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
        console.log("render",this);
        return(
            <div className="jsonanalyser_container" style={this.style['container']}>
                <div className="lhs_container" style={this.style['innerContainer']}>
                    <div className="lhs_header">
                        <span className="lhs_header_title">
                            Input
                        </span>
                       
                    </div>
                    <div className="lhs_editor" ref="lhs" contentEditable={"true"} style={this.style['editor']}>
                    </div>
                </div>
                <div className="cs_container" style={this.style['innerContainer']}>
                    <div className="right_arrow_container" style={this.style['right_arrow_container']}>
                       {/*  <img src="img/rightArrow.png" className="rightArrow_img"></img> */}
                       <button  onClick={this.handleAnalyser.bind(this)}>Analyse</button>
                    </div>
                </div>
                <div className="rhs_container" style={this.style['innerContainer']}>
                    <div className="rhs_header">
                        <span className="rhs_header_title">
                            Output
                        </span>
                        <span className="rhs_collapseExpand" onClick={this.handleCollExp.bind(this)}>
                            <img src={this.collapseFlag?"img/expandAll.png":"img/collapseAll.png"} width="20"></img>
                        </span>
                        <img 
                            src="img/wholeWordMatch.png"
                            className={"wholeWordMatch "+(this.searchedWord['wholeWordMatch']?'inputFeatureSelected':'')} 
                            width="22"
                            onClick={this.handleInputFeature.bind(this,'wholeWordMatch')}
                        />
                        <img 
                            src="img/caseMatch.png"
                            className={"caseMatch "+(this.searchedWord['caseMatch']?'inputFeatureSelected':'')} 
                            width="22"
                            onClick={this.handleInputFeature.bind(this,'caseMatch')}
                        />
                        <span className="searchIcon">
                            <input type="text" className="searchInput" placeholder="Search for key/value" ref="searchedWord" value={this.searchedWord.input} onKeyDown={this.handleKeyInput.bind(this)} onChange={this.handleInput.bind(this,'searchedWord')}></input>
                        </span>                        
                    </div>
                    <div className="rhs_editor" style={this.style['editor']}>
                        <div className="collapsable" data-count={count} style={this.analysedStyle['collapsable-icon']} >
                            {!flag?
                                this.collapseSet[count]?
                                    <img src="img/expandIcon.png" width='31' onClick={this.handleCollapse.bind(this,count)} ></img>
                                :
                                    <img src="img/collapseIcon.png" width='23'onClick={this.handleCollapse.bind(this,count)} ></img>
                            :
                                null
                            }
                        </div>                   
                        <span className="valHint" style={this.analysedStyle['valHint']} >
                            {this.valueHint(type,this.jsonToAnalyse)}
                        </span>
                        <div className=''  style={this.collapseSet[count]?this.analysedStyle['hide']:{}}>
                            {this.analyser(this.jsonToAnalyse)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default JSONAnalyser;