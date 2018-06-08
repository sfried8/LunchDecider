import React, { Component } from 'react';
import styled from 'styled-components'
import './App.css';

const API_URL = "http://wteapiapp.azurewebsites.net/items"
function fetchAPI(method,body) {
  if (method === "GET") {
    return fetch(API_URL).then(body => body.json())
  } else {
    return fetch(API_URL, {
      body: JSON.stringify(body), method: method, headers: {
        'content-type': 'application/json'
      },
    }).then(res => res.json()) 
  }
}
function getItems() {
  return fetchAPI("GET")
}
function addItem(name,weight) {
  return fetchAPI("POST",{name,weight})
}
function deleteItem(name) {
  return fetchAPI("DELETE",{name})
}
class App extends Component {
  state = {
    originalItems: [],
    items: [],
    selected: "Click the sandwich to pick a spot",
    newName: "",
    newWeight: 50
  }
  componentDidMount() {
    getItems().then(body => { this.setState({ items: body }); })
    this.randomItem = this.randomItem.bind(this)
    this.onChangeFunc = this.onChangeFunc.bind(this)
    this.onChangeNew = this.onChangeNew.bind(this)
    this.addNew = this.addNew.bind(this)
    this.createRow = this.createRow.bind(this)
    this.deleteEntity = this.deleteEntity.bind(this)
  }
  randomItem() {
    if (this.state.items) {
      let choices = [];
      this.state.items.forEach(i => { choices = [...choices, ...Array(i.weight).fill(i.name)] })
      let i = 0;
      const spinningIntervalId = setInterval(() => this.setState({ selected: this.state.items[(i++) % this.state.items.length].name }), 50)
      const logo = document.querySelector("#logo")
      logo.classList.add("App-logo")
      setTimeout(() => {
        clearTimeout(spinningIntervalId)
        this.setState({ selected: choices[(Math.random() * choices.length) | 0] })
        logo.classList.remove("App-logo")
      }, 1200)
    }
  }
  onChangeFunc(event) {
    const items = [...this.state.items]
    const index = +event.target.name.split("_")[0]
    items[index] = { ...items[index], weight: +event.target.value }
    this.setState({ items: items })
  }
  onChangeNew(event) {
    this.setState({ [event.target.name]: event.target.value })
  }
  addNew() {
    addItem(this.state.newName,this.state.newWeight).then(res => {
      if (res == "Success") {
        alert(res)
        this.setState({ newName: "", newWeight: 50 })
        document.querySelector("#newWeight").value = 50;
        document.querySelector("#newName").value = "";
        this.componentDidMount()
      }
    })
  }
  deleteEntity(event) {
    const nameToDelete = event.target.name.split("_")[0]
    if (window.confirm("Are you sure you want to delete " + nameToDelete + "?")) {
      deleteItem(nameToDelete).then(res => {
        if (res == "Success") {
          this.componentDidMount()
        }
      })
    }
  }
  createRow(i, j) {
    const Styledbutton = styled.button`
          background: #ff4444;
          color: white;
          
          font-size: 1em;
          margin: 1em;
          padding: 0.25em 0.5em 0.35em 0.5em;
          border: 2px solid red;
          border-radius: 50%;
          `
    return <tr key={i.name} >
      <td>{i.name}</td>
      <td><input type="range" name={j + "_weight"} minvalue="0" maxvalue="100" defaultValue={i.weight} onChange={this.onChangeFunc} />({i.weight})</td>
      <td>{i.last_visited}</td>
      <td><Styledbutton name={i.name + "_delete"} onClick={this.deleteEntity}>×</Styledbutton></td>
    </tr>
  }
  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img id="logo" src="http://icons.iconarchive.com/icons/google/noto-emoji-food-drink/1024/32386-sandwich-icon.png" alt="logo" onClick={this.randomItem}/>
          <h1 className="App-title">{this.state.selected}</h1>
        </header>
        <br />
        <div className="App-intro">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Last Visited</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map(this.createRow)}
            </tbody>
          </table>
        </div>
        <div>
          <input id="newName" name="newName" placeholder="Name" type="text" onChange={this.onChangeNew} />
          <input id="newWeight" name="newWeight" onChange={this.onChangeNew} type="range" minvalue="0" maxvalue="100" defaultValue="50" />
          <button onClick={this.addNew}>Add</button>
        </div>
      </div>
    );
  }
}

export default App;
