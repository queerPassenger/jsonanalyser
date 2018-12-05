import React from 'react';

class Footer extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="footer_container">
                <div className="author_logo_text">
                    v6.0.1
                    @queerpassenger
                </div>
            </div>
        )
    }
}
export default Footer;