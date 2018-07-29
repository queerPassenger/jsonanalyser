import React from 'react';

class JSONAnalyser extends React.Component{
    constructor(props){
        super(props);
        this.style={
            minHeight:screen.availHeight-120-16-50
        }
    }
    
    render(){
        return(
            <div className="jsonanalyser_container" style={this.style}>
                <div className="lhs_container">
                </div>
                <div className="cs_container">
                </div>
                <div className="rhs_container">
                </div>
            </div>
        )
    }
}
export default JSONAnalyser;