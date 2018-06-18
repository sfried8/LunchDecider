import React, { Component } from "react";
import styled from "styled-components";
import "./App.css";
import { addItem, deleteItem, getItems } from "./Database";
import { randchoice } from "./Random";

const sortFunc = (ascending, column) => (a, b) => {
    const a_val = column === "price" ? a["yelp_data"][column] : a[column];
    const b_val = column === "price" ? b["yelp_data"][column] : b[column];
    const difference = a_val < b_val ? -1 : a_val === b_val ? 0 : 1;
    return (ascending ? 1 : -1) * difference;
};
class App extends Component {
    state = {
        originalItems: [],
        items: [],
        selected: "Click the sandwich to pick a spot",
        newName: "",
        newWeight: 50,
        sortBy: "name",
        isSortAscending: true
    };
    componentDidMount() {
        getItems().then(body => {
            this.setState({
                items: body
                    .slice()
                    .sort(
                        sortFunc(this.state.isSortAscending, this.state.sortBy)
                    )
            });
        });
        this.randomItem = this.randomItem.bind(this);
        this.onChangeFunc = this.onChangeFunc.bind(this);
        this.onChangeNew = this.onChangeNew.bind(this);
        this.addNew = this.addNew.bind(this);
        this.createRow = this.createRow.bind(this);
        this.deleteEntity = this.deleteEntity.bind(this);
    }
    sortByColumn(column) {
        const isSortAscending =
            this.state.sortBy === column ? !this.state.isSortAscending : true;
        this.setState({
            items: this.state.items.sort(sortFunc(isSortAscending, column)),
            isSortAscending,
            sortBy: column
        });
    }
    randomItem() {
        if (this.state.items) {
            let choices = [];
            this.state.items.forEach(i => {
                choices = [...choices, ...Array(i.weight).fill(i.name)];
            });
            const spinningIntervalId = setInterval(
                () =>
                    this.setState({
                        selected: randchoice(this.state.items).name
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
    onChangeFunc(event) {
        const items = [...this.state.items];
        const index = +event.target.name.split("_")[0];
        items[index] = { ...items[index], weight: +event.target.value };
        this.setState({ items: items });
        addItem(items[index].name, +event.target.value);
    }
    onChangeNew(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    addNew() {
        addItem(this.state.newName, this.state.newWeight).then(res => {
            if (res === "Success") {
                alert(res);
                this.setState({ newName: "", newWeight: 50 });
                document.querySelector("#newWeight").value = 50;
                document.querySelector("#newName").value = "";
                this.componentDidMount();
            }
        });
    }
    deleteEntity(event) {
        const nameToDelete = event.target.name.split("_")[0];
        if (
            window.confirm(
                "Are you sure you want to delete " + nameToDelete + "?"
            )
        ) {
            deleteItem(nameToDelete).then(res => {
                if (res === "Success") {
                    this.componentDidMount();
                }
            });
        }
    }
    createRow(i, j) {
        const Styledbutton = styled.button`
            background: transparent;
            color: red;
            border: none;
            font-size: 2em;
            font-weight: 900;
        `;
        return (
            <tr key={i.name}>
                <td>{i.name}</td>
                <td>
                    <input
                        type="range"
                        name={j + "_weight"}
                        minvalue="0"
                        maxvalue="100"
                        defaultValue={i.weight}
                        onChange={this.onChangeFunc}
                    />
                </td>
                <td>{i.yelp_data.price}</td>
                <td>
                    {i.yelp_data.categories
                        ? i.yelp_data.categories.map(c => c.title).join(", ")
                        : ""}
                </td>
                <td>
                    <Styledbutton
                        name={i.name + "_delete"}
                        onClick={this.deleteEntity}
                    >
                        ×
                    </Styledbutton>
                </td>
            </tr>
        );
    }
    createHeader(column) {
        const isSortedBy = this.state.sortBy === column;

        return (
            <th
                className={isSortedBy ? "sortby" : ""}
                onClick={() => this.sortByColumn(column)}
            >
                {column.replace("_", " ") + " "}
                <span
                    className={
                        isSortedBy && this.state.isSortAscending
                            ? ""
                            : "inactiveSort"
                    }
                >
                    ▲
                </span>
                <span
                    className={
                        isSortedBy && !this.state.isSortAscending
                            ? ""
                            : "inactiveSort"
                    }
                >
                    ▼
                </span>
            </th>
        );
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img
                        id="logo"
                        src="http://icons.iconarchive.com/icons/google/noto-emoji-food-drink/1024/32386-sandwich-icon.png"
                        alt="logo"
                        onClick={this.randomItem}
                    />
                    <h1 className="App-title">{this.state.selected}</h1>
                </header>
                <div className="App-intro">
                    <table>
                        <thead>
                            <tr>
                                {this.createHeader("name")}
                                {this.createHeader("weight")}
                                {this.createHeader("price")}
                                <th>Categories</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.items.map(this.createRow)}</tbody>
                    </table>
                </div>
                <div>
                    <input
                        id="newName"
                        name="newName"
                        placeholder="Name"
                        type="text"
                        onChange={this.onChangeNew}
                    />
                    <input
                        id="newWeight"
                        name="newWeight"
                        onChange={this.onChangeNew}
                        type="range"
                        minvalue="0"
                        maxvalue="100"
                        defaultValue="50"
                    />
                    <button onClick={this.addNew}>Add</button>
                </div>
            </div>
        );
    }
}

export default App;
