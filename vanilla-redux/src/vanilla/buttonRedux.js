import { createStore } from 'redux'

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.querySelector("span");

// !! action code -> constant value
const ADD = "ADD"
const MINUS = "MINUS"

// !! reducer -> state modify
const countModifyier = (count = 0, action) => {
  switch (action.type) {
    case ADD:
      return count + 1;
    case MINUS:
      return count - 1;
    default:
      return count;
  }
}

// !! store -> setting store config
const countStore = createStore(countModifyier);

const onChange = () => {
  console.log('countStore.getState()', countStore.getState());
  number.innerText = countStore.getState();
}

// !! subscribe -> if state in store change, call function
countStore.subscribe(onChange);

// !! dispatch -> call reducer function, arguments what info action in reducer parameter
const dispatchAdd = () => countStore.dispatch({ type: ADD })
const dispatchMinus = () => countStore.dispatch({ type: MINUS })
countStore.dispatch({ type: "ADD" })
countStore.dispatch({ type: "ADD" })
countStore.dispatch({ type: "MINUS" })

add.addEventListener("click", dispatchAdd)
minus.addEventListener("click", dispatchMinus)

// * Redux 사용하기 전
// let count = 0;
// number.innerHTML = count;

// const updateText = () => {
//   number.innerHTML = count;
// }

// const handleAdd = () => {
//   count = count + 1;
//   updateText(); // !! 변경했다는 사실을 알렸다. 공통사항으로 처리할 수 있음
// }

// const handleMinus = () => {
//   count = count - 1;
//   updateText();
// }
// * Redux 사용하기 전-END