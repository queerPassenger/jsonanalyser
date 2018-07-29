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
                minHeight:window.innerHeight-(66+58)-20,
            },
            right_arrow_container:{
                top:((window.innerHeight-(66+58)-20)/2)-20,               
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
            marginRight:'5px',
            fontSize:'16px',
            fontFamily:'Source Code Pro',
            fontWeight:'bold'
        };
        this.analysedStyle['keyIndFloatStyle']=JSON.parse(JSON.stringify(this.analysedStyle['keyIndStyle']));
        this.analysedStyle['keyIndFloatStyle']['float']='left';
        this.analysedStyle['valStyle']={
            marginLeft:'4%'
        };
        this.analysedStyle['valueStyle']={
            fontSize:'16px',
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
            fontSize:'11px',
            fontFamily:'Source Code Pro',
            color:'gray',
            width:'60px',
            display:'inline-block',
            paddingTop:'5px',
            paddingBottom:'5px',
            paddingLeft:'5px'
        }
        this.renderComponent();
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
    analyser(){
        
    }
    renderComponent(){
        this.setState({
            renderComponent:!this.state.renderComponent,
        })
    }
    render(){
        return(
            <div className="jsonanalyser_container" style={this.style['container']}>
                <div className="lhs_container" ref="lhs" contentEditable={"true"} style={this.style['container']}>
                </div>
                <div className="cs_container" style={this.style['container']}>
                    <div className="right_arrow_container" style={this.style['right_arrow_container']} onClick={this.handleAnalyser.bind(this)}>
                        <img src="img/rightArrow.png" className="rightArrow_img"></img>
                    </div>
                </div>
                <div className="rhs_container" contentEditable={"true"} style={this.style['container']}>
                    {this.analyser()}
                </div>
            </div>
        )
    }
}
export default JSONAnalyser;