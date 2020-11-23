import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Header from './Components/Header';
// import Footer from './Components/Footer';
import SelectList from './Components/SelectList';
// import ClickCounter from "./Components/ClickCounter";
import Offices from './Components/Offices';

const NameComp = (props) => {
    const [state, setState] = useState(props.name);
    const [toggle, setToggle] = useState(true);
    const newFunc = () => {
        if(toggle){
            setState('True');
        }else{
            setState('False');
        }
        setToggle(!toggle);
    }
    return (
        <h6 onClick={newFunc}> This is the {state}</h6>
    );
}


const provinces=[ {'code':'QC','name':'Quebec'},{'code':'ON','name':'Ontario'},{'code':'NB','name':'New-Brunswick'}]

const countries=[{'code':'CA','name':'Canada'},{'code':'US','name':'USA'},{'code':'IN','name':'India'},{'code':'MX','name':'Mexixo'}]

class Page extends React.Component{
  render(){
            return (
            <div>
                <Header companyName="blabla.com"/>
                <p>Hello World !</p>
                <SelectList array={provinces}/>
                 <SelectList array={countries}/>
                 <Offices />
                {/*<Footer authorName="Stéphane Lapointe"/>*/}
                {/*<ClickCounter />*/}
            </div>
        )
    }
}

ReactDOM.render(<Page/>, document.getElementById('root'))
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
