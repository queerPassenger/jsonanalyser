import React from 'react';

class JSONAnalyser extends React.Component{
    constructor(props){
        super(props);
        this.style={
            minHeight:window.innerHeight-124-20,
        }
    }
    
    render(){
        return(
            <div className="jsonanalyser_container" style={this.style}>
                <div className="lhs_container" contenteditable={"true"} style={this.style}>
                </div>
                <div className="cs_container" style={this.style}>
                    <div className="right_arrow_container">
                        <img src="img/rightArrow.png"></img>
                    </div>
                </div>
                <div className="rhs_container" contenteditable={"true"} style={this.style}>
                </div>
            </div>
        )
    }
}
export default JSONAnalyser;