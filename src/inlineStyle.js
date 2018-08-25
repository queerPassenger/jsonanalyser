const height={
    header:43,
    footer:37,            
}
function getHeight(height){
    if(height<=0){
        return 0
    }
    else{
        return height;
    }
}
const styleGen=()=>{
    let style={};
    style['container']={
        height:getHeight(window.innerHeight-(height.header+height.footer)),         
        background:'#e8e8e8',     
    };
    style['innerContainer']={
         height:getHeight(window.innerHeight-(height.header+height.footer)-20),
         marginTop:10,
         marginBottom:10
    };
    style['lhs']=style['cs']={
        display:'none',
    };
    style['rhs']={
        width:'95%',
    }
    style['lhsEditor']={
         height:getHeight(window.innerHeight-(height.header+height.footer)-20-10-50),
    };
    style['rhsEditor']={
         height:getHeight(window.innerHeight-(height.header+height.footer)-20-10-50-40),
    };
    style['right_arrow_container']={
         top:getHeight(((window.innerHeight-(height.header+height.footer))/2)-50),               
    };
    style['plusIcon']={
         width:'20',
         position:'relative',
         left:'15%',
         top:'1'
    };
    style['minusIcon']={
         width:'15',
         position:'relative',
         left:'23%',
         top:'2'
    };
    style['object_parent_wrapper']={
        paddingLeft:'2%',
    };
    style['array_parent_wrapper']=style['object_parent_wrapper'];
    style['keyIndStyle']={
        float:'left',
        marginRight:'10px',
        fontSize:'16px',
        fontFamily:'Source Code Pro',            
        fontWeight:'bold'
    };
    style['keyIndFloatStyle']=JSON.parse(JSON.stringify(style['keyIndStyle']));
    style['keyIndFloatStyle']['float']='left';
    style['valStyle']={
        marginLeft:'4%'
    };
    style['valueStyle']={
        fontSize:'16px',
        fontFamily:'Source Code Pro',
        display:'inline-block'
    };
    style['collapsable-icon']={
        width:'30px',
        float:'left',
        height:'20px',
        cursor:'pointer',
    };
    style['hide']={
        display:'none'
    };
    style['valHint']={
        fontSize:'12px',
        fontFamily:'Source Code Pro',
        color:'gray',
        width:'100px',
        display:'inline-block',
        paddingTop:'4px',
        paddingBottom:'4px',
        paddingLeft:'10px'
    };
    style['StringVal']={
        color:'red',
    };
    style['NullVal']={
        color:'blue',
        
    };
    style['NumberVal']={
        color:'green',
    };
    style['BooleanVal']={
        /* color:'pink', */
    };
    style['DateVal']={
        color:'yellow',
    };
    return style;
}

export default styleGen;

