import React from 'react';

const SelectList = (props) => {
    return (
        <div>
            <select name='Country'>
                {props.array.map((obj, i) => <option value={obj['code']} key={obj['code']}> {obj['name']} </option>)}
            </select>
        </div>
    );
}

export default SelectList;