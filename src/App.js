import React, { Component } from "react";
import styled from "styled-components";
import "./App.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import { addItem, deleteItem, getItems } from "./Database";
import { randchoice } from "./Random";
// import { RangeCell } from "./RangeCell";
import cellEditFactory from "react-bootstrap-table2-editor";
import PropTypes from "prop-types";

class RangeCell extends React.Component {
    static propTypes = {
        value: PropTypes.number,
        onUpdate: PropTypes.func.isRequired
    };
    static defaultProps = {
        value: 0
    };
    getValue() {
        console.log(this.range.value);
        return parseInt(this.range.value, 10);
    }
    render() {
        const { value, onUpdate, ...rest } = this.props;
        return [
            <input
                {...rest}
                key="range"
                ref={node => (this.range = node)}
                type="range"
                min="0"
                max="100"
            />,
            <button
                key="submit"
                className="btn btn-default"
                onClick={() => onUpdate(this.getValue())}
            >
                Save
            </button>
        ];
    }
}
class App extends Component {
    columns = [
        { dataField: "name", text: "Name", sort: true },
        {
            dataField: "weight",
            text: "Weight",
            sort: true,
            editable: true,
            editorRenderer: (
                editorProps,
                value,
                row,
                column,
                rowIndex,
                columnIndex
            ) => <RangeCell {...editorProps} value={value} />
        },
        { dataField: "last_visited", text: "Last Visited", sort: true }
    ];
    state = {
        originalItems: [],
        items: [],
        selected: "Click the sandwich to pick a spot",
        newName: "",
        newWeight: 50
    };
    componentDidMount() {
        getItems().then(body => {
            this.setState({ items: body });
        });
        this.randomItem = this.randomItem.bind(this);
        this.onChangeFunc = this.onChangeFunc.bind(this);
        this.onChangeNew = this.onChangeNew.bind(this);
        this.addNew = this.addNew.bind(this);
        this.createRow = this.createRow.bind(this);
        this.deleteEntity = this.deleteEntity.bind(this);
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
        const name = event.target.name.split("_")[0];
        const index = items.findIndex(i => i.name === name);
        items[index] = { ...items[index], weight: +event.target.value };
        this.setState({ items: items });
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
            margin: 1em;
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
                    />({i.weight})
                </td>
                <td>{i.last_visited}</td>
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
                <br />
                <div className="App-intro">
                    <BootstrapTable
                        keyField="name"
                        data={this.state.items}
                        columns={this.columns}
                        striped={true}
                        bordered={true}
                        cellEdit={cellEditFactory({
                            mode: "click",
                            blurToSave: false
                        })}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Weight</th>
                                <th>Last Visited</th>
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
