import React from 'react';

class Discogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discogs_data: [],
            isLoaded: false,
            error: null,
            search_str: ""
        }
    }

    getSearchData = () => {
        console.log('haha called');
        let {search_str} = this.state;
        if (search_str != null) {
            let URL = "https://api.discogs.com/database/search?key=aJQZSoPfyuEmgrvQicUX&secret=tOGPmZMeULzagkrzGeWVPUVmwNVVFBHo&artist=" + search_str + "&country=canada"
            fetch(URL)
                .then((response) => {
                    response.json().then(json_response => {
                        console.log(json_response.results);
                        this.setState({
                            discogs_data: json_response.results,
                            isLoaded: true
                        })
                    })
                });
        }
    }

    addToDefaultPlaylist = (event) => {
        let {discogs_data} = this.state;
        let track = discogs_data.find(element => element.id === parseInt(event.target.id))
        let extractedData = {
            id: track.id,
            playlist_id: 1,
            title: track.title,
            uri: track.uri,
            master_id: track.master_id
        };

        let URL = "http://localhost:3001/tracks";
        let method = "POST"
        fetch(URL, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(extractedData)
        }).then(res => res.json())
            .then((response) => console.log(response),
                (error) => {
                    this.setState({
                        error: {message: "AJAX error, URL wrong or unreachable!"}
                    })
                    console.error(error);
                });
    }

    onSearchChange = (event) => {
        let {search_str} = this.state;
        search_str = event.target.value;
        this.setState({
            search_str: search_str
        });
    }

    renderDiscogsData = () => {
        let {discogs_data, isLoaded} = this.state;
        const jumbotronStyle = {
            height: 800 + 'px',
            overflow: 'scroll'
        }
        const cardStyle = {
            width: 15 + 'rem',
            margin: 10 + 'px'
        }
        if (isLoaded) {
            return (
                <div className="d-flex flex-wrap flex-row jumbotron" style={jumbotronStyle}>
                    {discogs_data.map((item, index) => {
                        return (
                            <div className="card" style={cardStyle} key={index}>
                                <img src={item.cover_image} className="card-img-top" alt="cover"/>
                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <div className="d-flex flex-row">
                                        <a href={"http://www.discogs.com" + item.uri} target="_blank" rel="noreferrer"
                                           className="btn btn-sm btn-outline-info">Find More</a>
                                        <button onClick={(event) => this.addToDefaultPlaylist(event)} id={item.id}
                                                className="btn btn-sm btn-outline-success">Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        } else {
            return (
                <div> Search Something </div>);
        }
    }

    render() {
        return (
            <div className="col-md-6">
                <div className="form-group col-8 d-flex flex-row">
                    <input className="form-control mr-sm-2" type="search" id="search" placeholder="Search"
                           aria-label="Search" onChange={(event => this.onSearchChange(event))}/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="button"
                            onClick={() => this.getSearchData()}>Search
                    </button>
                </div>
                {this.renderDiscogsData()}
            </div>
        )

    }
}

export default Discogs;