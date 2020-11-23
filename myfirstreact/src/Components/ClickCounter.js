import React, {useState} from 'react';

const ClickCounter = () => {
    const [counter, setCounter] = useState(0);
    const buttonClicked = () => {
        setCounter(counter + 1);
    }
    return (
        <div>
            <p> Clicked Tiems: {counter} </p>
            <button onClick={buttonClicked} value='Click'/>
        </div>
    );
}

export default ClickCounter;