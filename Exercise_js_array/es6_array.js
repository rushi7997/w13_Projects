const USER_ARRAY = [
    { id: 1, name: 'Martin', age: 45 },
    { id: 2, name: 'Pierre', age: 15 },
    { id: 3, name: 'Josee', age: 14 },
    { id: 4, name: 'Melanie', age: 32 },
    { id: 5, name: 'Sonia', age: 24 }
];

console.log(USER_ARRAY);

let USER_ARRAY_1 = USER_ARRAY.map((arr) => {
    return { id : arr.id , name: arr.name}
});

console.log(USER_ARRAY_1);

let USER_ARRAY_2 = [];
USER_ARRAY.forEach((arr) => {
    if(arr.age > 15){
        USER_ARRAY_2.push(arr)
    }
});

console.log(USER_ARRAY_2);

let avgAge = 0;
USER_ARRAY.forEach((arr) => {
    avgAge += arr.age;
});
avgAge = avgAge/USER_ARRAY.length;
console.log(avgAge);