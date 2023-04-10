
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Moment from 'moment';

type MyProps = { name: string };
type MyState = { currentDate: string };

class MyComponent2 extends Component<MyProps, MyState> {
    loadInterval: NodeJS.Timer

    constructor(props: MyProps){
        super(props);
        this.state = {
            currentDate: Moment(new Date()).format("hh:mm:ss")
        }
        setInterval(()=> this.setTime(), 5000)
    }

    componentDidMount() {
        this.loadInterval = setInterval(()=> this.setTime(), 1000);
    }

    componentWillUnmount () {
        this.loadInterval && clearInterval(this.loadInterval);
    }

    setTime(){
        this.loadInterval && this.setState({currentDate: (Moment(new Date()).format("hh:mm:ss")) })
    }


    static propTypes = {
        name: PropTypes.string
    }
    static defaultProps = {
        name: "Hell"
    }

    list= ["Hell","World", "Why", "IBM"];

    ulRender = this.list.map((val, ind)=> {
            return <li key={ind}>{val}</li>
        });
    
    
    render() {
        return (
            <div>
                <h1>The Current Time is: {this.state.currentDate.toString()} </h1>
                <h3 style={{color: "blue"}} >Hello world {this.props.name}</h3>
                <ul>{this.ulRender}</ul>
            </div>
        )
    }
}

export default MyComponent2;

