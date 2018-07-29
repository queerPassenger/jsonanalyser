import React from 'react';
import Header from './header.jsx';
import JSONAnalyser from './jsonanalyser.jsx';
import Footer from './footer.jsx';

class Main extends React.Component{
    constructor(props){
        super(props);
        
    }
    render(){
        return(
            <div className="parent_container">
                <Header/>
                <JSONAnalyser />    
                <Footer/>               
            </div>
        )
    }
}
export default Main;