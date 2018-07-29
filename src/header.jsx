import React from 'react';

class Header extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="header_container">
                <div className="logo_text">
                    JSONAnalyser
                </div>
            </div>
        )
    }
}
export default Header;