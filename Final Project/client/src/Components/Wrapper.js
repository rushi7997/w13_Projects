import React, {useState} from 'react';
import Discogs from "./Discogs";
import PlayList from "./PlayList"

const Wrapper = () => {
    let [count, setCount] = useState(0);
    return (
        <div className="d-flex flex-row">
            <Discogs setCount={setCount} count={count}/>
            <PlayList count={count}/>
        </div>
    )
}

export default Wrapper;