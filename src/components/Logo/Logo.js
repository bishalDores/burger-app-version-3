import React from 'react';
import BurgerLogo from '../../assets/images/132 burger-logo.png';
import classes from './Logo.css';
const Logo = (props) => (
    <div className={classes.Logo}>
        <img src={BurgerLogo} alt="my burger" />
    </div>
);
export default Logo;