import React, { FC } from 'react';
import PropTypes from 'prop-types';
import styles from './MyComponent1.module.css';

type MyProps = { name: string };

const MyComponent1: FC<MyProps> = (props) => (
  <div className={styles.MyComponent1}>
    MyComponent1 Component {props.name}
    <br/><br/>
    <button onClick={log.bind(this,'hello world22')} >Click Me</button>
  </div>
);

MyComponent1.propTypes = {name: PropTypes.string};

MyComponent1.defaultProps = {name: "Hell"};

function log(name: string){alert(`you clicked me: ${name}`)};

export default MyComponent1;
