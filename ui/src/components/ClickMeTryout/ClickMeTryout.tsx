import React, { FC } from 'react';
import PropTypes from 'prop-types';

type MyProps = { name: string };

const ClickMeTryout: FC<MyProps> = (props) => (
  <div className='container p-3 my-3 bg-primary text-white'>
    Click Me Component {props.name}
    <br/><br/>
    <button onClick={log.bind(this,'hello world22')} >Click Me</button>
  </div>
);

ClickMeTryout.propTypes = {name: PropTypes.string};

ClickMeTryout.defaultProps = {name: "Hell"};

function log(name: string){alert(`you clicked me: ${name}`)};

export default ClickMeTryout;
