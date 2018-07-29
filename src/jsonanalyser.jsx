import React from 'react';

class JSONAnalyser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            renderComponent:false,
        }
        this.jsonToAnalyse=null,
        this.analysedJSON=null,

        this.count=-1;
        this.collapseSet=[];
        this.collapseFlag=true;

        this.style={
            container:{
               height:window.innerHeight-(66+58),              
            },
            innerContainer:{
                height:window.innerHeight-(66+58)-45,
            },
            right_arrow_container:{
                top:((window.innerHeight-(66+58)-45)/2),               
            }
        }
        this.analysedStyle={

        };
    }
    componentDidMount(){
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
            fontWeight:'bold'
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
   /*  handleCollExp(){
        let newSet=[];
        this.collapseSet.map((obj)=>{
            newSet.push(this.collapseFlag);
        })
        this.collapseSet=newSet;
        this.renderComponent();
    } */
    handleCollapse(count){
        console.log('COunt',count);
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
       var innerText = this.refs['lhs'].innerText  // using innerText here because it preserves newlines
        if(innerText[innerText.length-1] === '\n') {
            innerText = innerText.slice(0,-1) ;          
            // get rid of weird extra newline
        }
        let output=innerText.replace(/(\r\n\t|\n|\r\t|\s)/gm,"");
        let jsonOutput=JSON.parse(output);
        this.jsonToAnalyse=jsonOutput;
        this.renderComponent();
    }
    analyser(val){
        let randStr=Math.random().toString(36).substring(7);
        let type=Object.prototype.toString.call(val).split(' ')[1].replace(']','');
        
        if(type==='String' || type==='Number' || type==='Date' || type==='Null' || type==='Boolean'){
            return(
                <div className="value_wrapper" style={this.analysedStyle['valueStyle']}>
                    {' '+val}
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
                                            <img src="img/expandIcon.png" width='30'></img>
                                        :
                                            <img src="img/collapseIcon.png" width='25'></img>
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
                                            <img src="img/expandIcon.png" width='30'></img>
                                        :
                                            <img src="img/collapseIcon.png" width='25'></img>
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
        return(
            <div className="jsonanalyser_container" style={this.style['container']}>
                <div className="lhs_container" ref="lhs" contentEditable={"true"} style={this.style['innerContainer']}>
                </div>
                <div className="cs_container" style={this.style['innerContainer']}>
                    <div className="right_arrow_container" style={this.style['right_arrow_container']} onClick={this.handleAnalyser.bind(this)}>
                        <img src="img/rightArrow.png" className="rightArrow_img"></img>
                    </div>
                </div>
                <div className="rhs_container" style={this.style['innerContainer']}>
                    <div className="collapsable" data-count={count} style={this.analysedStyle['collapsable-icon']} onClick={this.handleCollapse.bind(this,count)} >
                        {!flag?
                            this.collapseSet[count]?
                                <img src="img/expandIcon.png" width='30'></img>
                            :
                                <img src="img/collapseIcon.png" width='25'></img>
                        :
                            null
                        }
                    </div>
                    <span className="valHint" style={this.analysedStyle['valHint']} >
                        {this.valueHint(type,this.jsonToAnalyse)}
                    </span>
                    <div className='' style={this.collapseSet[this.count]?this.analysedStyle['hide']:{}}>
                        {this.analyser(this.jsonToAnalyse)}
                    </div>
                </div>
            </div>
        )
    }
}
export default JSONAnalyser;