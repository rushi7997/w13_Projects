import React from 'react';

class Offices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offices_data: [], // will contain offices data array from server
            offices_index: 0, // the index of the offices currently shown, start at first in array
            offices_count: 0, // how many offices in data array from server
            isLoaded: false,  // will be true after data have been received from server
            error: null,       // no errors yet !
            currentOfficeObject: {
                officecode: 0,
                city: "",
                phone: "",
                addressline1: "",
                addressline2: "",
                state: "",
                country: "",
                postalcode: "",
                territory: ""
            },
            selectedOfficeCode: -1,
            message: "",
        };
    }

    componentDidMount() {
        this.getAll(null);
    }

    getAll(officecode){
        let URL = 'http://localhost:8000/offices';
        if (officecode) {
            URL += `/${officecode}`
        }
        fetch(URL)
            .then(
                (response) => {
                    if (response.ok) {
                        response.json().then(json_response => {
                                console.log(json_response)
                                if (!officecode) {
                                    this.setState({
                                        offices_data: json_response.offices, // data received from server
                                        offices_count: json_response.offices.length, // how many offices in array
                                        offices_index: 0,  // will first show the first offices in the array
                                        isLoaded: true,  // we got data
                                        error: null, // no errors
                                        currentOfficeObject: json_response.offices[0],
                                        selectedOfficeCode: parseInt(json_response.offices[0].officecode)
                                    })
                                } else {
                                    if (json_response.offices.length > 0) {
                                        this.setState({
                                            currentOfficeObject: json_response.offices[0],
                                            selectedOfficeCode: parseInt(json_response.offices[0].officecode)
                                        })
                                    } else {
                                        this.setState({error: {message: "No data found with this value"}})
                                        setTimeout(() => {
                                            this.setState({error: null})
                                        }, 5000);
                                    }

                                }
                            }
                        )

                    } else {
                        // handle errors, for example 404
                        response.json().then(json_response => {
                            this.setState({
                                isLoaded: false,
                                error: json_response,   // something in format  {message: "offices not found", db_data:{}}
                                offices_data: {}, // no data received from server
                                offices_count: 0,
                                offices_index: 0
                            });
                            this.clearAll();
                        })
                    }
                },

                (error) => {
                    this.setState({
                        isLoaded: false,
                        error: {message: "AJAX error, URL wrong or unreachable, see console"}, // save the AJAX error in state for display below
                        offices_data: {}, // no data received from server
                        offices_count: 0,
                        offices_index: 0,
                    });
                }
            )
    }

    addOrUpdateOfficeData() {
        let {selectedOfficeCode, currentOfficeObject} = this.state;
        let typeOfRequest = "POST", URL = "http://localhost:8000/offices";
        if (selectedOfficeCode !== -1) {
            URL += `/${selectedOfficeCode}`;
            typeOfRequest = "PUT";
        }
        fetch(URL,
            {
                method: typeOfRequest,
                headers: {
                    'Content-Type': 'application/json'
                    //'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(currentOfficeObject)
            }
        )
            .then(res => res.json())//here server sends JSON response
            .then(
                (response) => {
                    // TO DO how to handle code other than 200 because this gets
                    // exeucted in all cases
                    this.renderMessage(response.message, 2000);
                    this.getAll(null);
                },

                (error) => {
                    // only NO RESPONSE URL errors will trigger this code
                    this.setState({
                        error: {message: "AJAX error, URL wrong or unreachable, see console"}
                    })
                    console.error(error);
                }
            )
    }

    removeOffice() {
        let {selectedOfficeCode} = this.state;
        fetch('http://localhost:8000/offices/' + selectedOfficeCode, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.renderMessage(res.message, 4000);
                this.getAll(null);
            })
    }

    clearAll() {
        this.setState({
            currentOfficeObject: {
                officecode: 0,
                city: "",
                phone: "",
                addressline1: "",
                addressline2: "",
                state: "",
                country: "",
                postalcode: "",
                territory: ""
            },
            offices_index: 0,
            selectedOfficeCode: -1
        })
    }

    nextPrevBtnClick(btnType) {
        this.setState((prev) => {
            let currentIndex = prev.offices_index;
            if (btnType === "previous") {
                currentIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
            } else {
                currentIndex = currentIndex >= prev.offices_count - 1 ? prev.offices_count - 1 : currentIndex + 1;
            }
            return {
                offices_index: currentIndex,
                selectedOfficeCode: prev.offices_data[currentIndex].officecode
            }
        }, () => {
            this.getAll(this.state.selectedOfficeCode)
        })
    }

    renderMessage(msg, timeOutInMilliSeconds) {
        this.setState({
            message: msg,
        }, () => {
            setTimeout(() => {
                this.setState({
                    message: null
                })
            }, timeOutInMilliSeconds);
        })
    }

    onInputValueChange(e) {
        let {currentOfficeObject} = this.state;
        currentOfficeObject[e.target.id] = e.target.value;
        this.setState({
            currentOfficeObject: currentOfficeObject
        }, () => {
            console.log(this.state);
        })
    }

    renderOfficeTable() {
        let {error, isLoaded, offices_count, currentOfficeObject, offices_index, message, selectedOfficeCode} = this.state;
        if (this.state.error) {
            return <div><b>{error.message}</b></div>;
        } else if (isLoaded) {
            if (offices_count !== 0) {
                // offices table not empty
                return (
                    <div>
                        <div className="list-group">
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Office Code</label>
                                    <input id="officecode" className="form-control" type="number" min="1"
                                           step="1"
                                           value={currentOfficeObject.officecode ? currentOfficeObject.officecode : "0"}
                                           onChange={(e) => {
                                               if (selectedOfficeCode === -1) {
                                                   this.onInputValueChange(e);
                                               }
                                           }} disabled={selectedOfficeCode !== -1}/>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>City</label>
                                    <input id="city" className="form-control" type="text"
                                           value={currentOfficeObject.city ? currentOfficeObject.city : ""} onChange={(e) => {
                                        this.onInputValueChange(e);
                                    }}/>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Phone</label>
                                    <input id="phone" className="form-control" type="text"
                                           value={currentOfficeObject.phone ? currentOfficeObject.phone : ""}
                                           onChange={(e) => {
                                               this.onInputValueChange(e);
                                           }}/>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Address Line 1</label>
                                    <textarea id="addressline1" className="form-control"
                                              value={currentOfficeObject.addressline1 ? currentOfficeObject.addressline1 : ""}
                                              onChange={(e) => {
                                                  this.onInputValueChange(e);
                                              }}>
                                                </textarea>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Address Line 2</label>
                                    <textarea id="addressline2" className="form-control"
                                              value={currentOfficeObject.addressline2 ? currentOfficeObject.addressline2 : ""}
                                              onChange={(e) => {
                                                  this.onInputValueChange(e);
                                              }}>
                                                </textarea>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>State</label>
                                    <input id="state" className="form-control" type="text"
                                           value={currentOfficeObject.state ? currentOfficeObject.state : ""}
                                           onChange={(e) => {
                                               this.onInputValueChange(e);
                                           }}/>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Country</label>
                                    <input id="country" className="form-control" type="text"
                                           value={currentOfficeObject.country ? currentOfficeObject.country : ""}
                                           onChange={(e) => {
                                               this.onInputValueChange(e);
                                           }}/>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Postal Code</label>
                                    <input id="postalcode" className="form-control"
                                           type="text"
                                           value={currentOfficeObject.postalcode ? currentOfficeObject.postalcode : ""}
                                           onChange={(e) => {
                                               this.onInputValueChange(e);
                                           }}/>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="form-group col-md-12">
                                    <label>Territory</label>
                                    <input id="territory" className="form-control" type="text"
                                           value={currentOfficeObject.territory ? currentOfficeObject.territory : ""}
                                           onChange={(e) => {
                                               this.onInputValueChange(e);
                                           }}/>
                                </div>
                            </div>
                        </div>
                        <div className="alert">
                            {message ? (<div>
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            </div>) : <div></div>}
                        </div>
                        <div className="container d-flex flex-row">
                            <button className="btn btn-primary" style={{margin: 10 + 'px'}} type="button"
                                    onClick={() => {
                                        this.nextPrevBtnClick("previous");
                                    }} disabled={offices_index === 0}>Previous
                            </button>
                            <button className="btn btn-primary" style={{margin: 10 + 'px'}} type="button"
                                    onClick={() => {
                                        this.nextPrevBtnClick("next");
                                    }} disabled={offices_index === offices_count - 1}>Next
                            </button>
                            <button className="btn btn-warning" style={{margin: 10 + 'px'}} onClick={() => {
                                this.addOrUpdateOfficeData()
                            }}>
                                Save
                            </button>
                            <button className="btn btn-success" style={{margin: 10 + 'px'}} onClick={() => {
                                this.addOrUpdateOfficeData()
                            }}>
                                Add +
                            </button>
                            <button className="btn btn-danger" style={{margin: 10 + 'px'}} onClick={() => {
                                this.removeOffice();
                            }}>
                                Delete
                            </button>
                            <button className="btn btn-info" style={{margin: 10 + 'px'}} onClick={() => {
                                this.clearAll()
                            }}>
                                Clear
                            </button>
                        </div>
                    </div>
                )
            } else {
                return (<div><b>Offices table is empty</b></div>)
            }
        } else {
            return (<div><b>Waiting for server ...</b></div>)
        }
    }

    renderTableCell(dataObject) {
        return Object.keys(dataObject).map((item, index) => {
            return <td key={dataObject[item] + "_" + index}>{dataObject[item]}</td>
        })
    }

    renderTableBody() {
        let {offices_data} = this.state;
        if (offices_data) {
            return offices_data.map((item, index) => {
                return (
                    <tr key={index}>
                        {this.renderTableCell(item)}
                    </tr>
                )
            }, this)
        }
        return (<tr>
            <td colSpan="9" className="text-center">No data available</td>
        </tr>)
    }
    // display the offices table
    render() {
        return (
            <div className="container">
                <div className="col-md-12">
                        {this.renderOfficeTable()}
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Office Code</th>
                                <th>City</th>
                                <th>Phone</th>
                                <th>Address Line 1</th>
                                <th>Address Line 2</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>Postal Code</th>
                                <th>Territory</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderTableBody()}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        )
    }
}

export default Offices;