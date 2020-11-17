import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Header from './Components/Header';
import Footer from './Components/Footer';

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


class Page extends React.Component {
    render() {
        return (
            <div>
                <Header company='BlaBla.com'/>
                <NameComp name = 'Rushi'/>
                <Footer footer='footer'/>
            </div>
        );
    }
}

ReactDOM.render(<Page/>, document.getElementById('root'))
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
