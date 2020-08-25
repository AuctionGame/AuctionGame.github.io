import React from 'react';

class LoginHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        console.log("From submit called");
        console.log("Value", this.state.inputValue);
        if (typeof this.props.submitHandler === 'function') {
            this.props.submitHandler(this.state.inputValue);
        }
    }

    handleInputChange(event) {
        console.log(event.target.value);
        this.setState({
            inputValue: event.target.value
        })
    }

    render() {
        return(
            <div className="container">
                <div className="jumbotron">
                    <form onSubmit={this.handleFormSubmit} className="from">
                        <div className="form-group">
                            <input onChange={this.handleInputChange} className="form-control" placeholder="Enter yor secret Id" />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LoginHandler;

