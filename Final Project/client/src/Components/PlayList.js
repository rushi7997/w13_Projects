import React from 'react';

class PlayList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracksLoaded: false,
            playListLoaded: false,
            playLists: [],
            tracks: [],
            error: null,
            currentPlayList: 0,
            count: props.count
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        // let {isLoaded, playLists, tracks, currentPlayList, error} = this.state;
        let tracksURL = "http://localhost:3001/tracks";
        fetch(tracksURL)
            .then((response) => {
                if (response.ok) {
                    response.json().then(json_response => {
                        console.log("Tracks Loaded");
                        this.setState({
                            tracksLoaded: true,
                            tracks: json_response.tracks
                        })
                    });
                } else {
                    response.json().then(json_response => {
                        this.setState({
                            error: json_response
                        });
                    })
                }
            });

        let playListURL = "http://localhost:3001/playlist";
        fetch(playListURL)
            .then((response) => {
                if (response.ok) {
                    response.json().then(json_response => {
                        console.log("Playlists Loaded");
                        this.setState({
                            playListLoaded: true,
                            playLists: json_response.playlist
                        })
                    });
                } else {
                    response.json().then(json_response => {
                        this.setState({
                            error: json_response
                        });
                    })
                }
            });
    }

    getAllTracksInPlayList = (playListId) => {
        let {tracks} = this.state;
        let result = [];
        tracks.forEach(track => {
            if (track.playlist_id === playListId) {
                result.push(track);
            }
        });
        return result;
    }

    changeCurrentPlayList = (event) => {
        let playListIndex = event.target.id;
        // console.log(playListIndex);
        this.setState({
            currentPlayList: playListIndex
        });
    }

    deleteTrackController = (event) => {
        let URL = "http://localhost:3001/tracks/" + event.target.id;
        fetch(URL, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                this.getData();
                // console.log(res)
                // this.renderMessage(res.message, 4000);
                // this.getAll(null);
            })
    }

    renderPlaylists = () => {
        let {tracksLoaded, playListLoaded, playLists, tracks, currentPlayList} = this.state;
        const activeClasses = "nav-link active";
        const passiveClasses = "nav-link"
        if (tracksLoaded && playListLoaded) {
            return (
                <div>
                    <ul className="nav nav-tabs">
                        {
                            playLists.map((item, index) =>
                                <li className="nav-item"
                                    key={index}
                                    onClick={(event) => this.changeCurrentPlayList(event)}>
                                    <div
                                        className={(index === parseInt(currentPlayList) ? activeClasses : passiveClasses)}
                                        id={item.id - 1}>
                                        {item.title}
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        {playLists.map((item, index) => {
                            let playListTracks = this.getAllTracksInPlayList(item.id);
                            let ActiveClassList = "tab-pane fade show active";
                            let PassiveClassList = "tab-pane fade";
                            return (
                                <div
                                    className={(index === parseInt(currentPlayList)) ? ActiveClassList : PassiveClassList}
                                    id={item.id}
                                    key={index}>
                                    <ul className="list-group list-group-flush">
                                        {
                                            playListTracks.map((track, track_idex) => (
                                                <div
                                                    className="d-flex flex-row justify-content-between list-group-item">
                                                    <li className="list-group-item" key={track_idex}>
                                                        <a href={"http://www.discogs.com" + track.uri}
                                                           className="nav-link"
                                                           target="_blank"
                                                           rel="noreferrer">{track.title}</a>
                                                    </li>
                                                    <button id={track.id} className="btn btn-outline-danger"
                                                            onClick={(event) => this.deleteTrackController(event)}> Delete
                                                    </button>
                                                </div>))
                                        }
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    Loading....
                </div>
            )
        }
    }

    render() {
        return (
            <div className="col-md-6">
                {this.renderPlaylists()}
            </div>
        )
    }
}

export default PlayList;