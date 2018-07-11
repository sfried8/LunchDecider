import React, { Component } from "react";
import { randchoice } from "./Random";
class Picker extends Component {
    state = {
        selected: "Click the sandwich to pick a spot",
    };
    componentDidMount() {
        this.randomItem = this.randomItem.bind(this);
    }
    randomItem() {
        if (this.props.items) {
            let choices = [];
            this.props.items.forEach(i => {
                choices = [...choices, ...Array(i.weight).fill(i.name)];
            });
            const spinningIntervalId = setInterval(
                () =>
                    this.setState({
                        selected: randchoice(this.props.items).name
                    }),
                50
            );
            const logo = document.querySelector("#logo");
            logo.classList.add("App-logo");
            setTimeout(() => {
                clearTimeout(spinningIntervalId);
                this.setState({
                    selected: randchoice(choices)
                });
                logo.classList.remove("App-logo");
            }, 1200);
        }
    }
    render() {
        return (
                <header className="App-header">
                    <img
                        id="logo"
                        src="http://icons.iconarchive.com/icons/google/noto-emoji-food-drink/1024/32386-sandwich-icon.png"
                        alt="logo"
                        onClick={this.randomItem}
                    />
                    <h1 className="App-title">{this.state.selected}</h1>
                </header>
                
        );
    }
}

export default Picker;