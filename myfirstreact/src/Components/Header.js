import React from 'react';
import Styles from './css/header.module.css';

const Header = (props) => {
    return (
        <h1 className={Styles.myClass}> This is the {props.company} </h1>
    );
}

export default Header;