import React from 'react';
import {useState} from 'react';
import Styles from './css/header.module.css';

const Header = (props) => {

    const [state, setState] = useState('');
    const changeState = () => {
        let input = document.getElementById('xyz').value;
        setState(input);
    }
    return (
        <div>
            <h1 className={Styles.myClass}> This is the {state} </h1>
            <input type='text' id='xyz' onChange={changeState}/>
        </div>
    );
}

export default Header;