import { createStore } from 'redux'

const form = document.querySelector("form")
const input = document.querySelector("input")
const ul = document.querySelector("ul")

// * REDUX-config
const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

const addToDo = text => {
  return {
    type: ADD_TODO,
    text
  }
}

const deleteToDo = id => {
  return {
    type: DELETE_TODO,
    id
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      const newToDoObj = { text: action.text, id: Date.now() };
      return [newToDoObj, ...state];
    case DELETE_TODO:
      const cleaned = state.filter(toDo => toDo.id !== action.id);
      return cleaned;
    default:
      return state;
  }
}

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));
// * REDUX-config-END

// * Redux - event - add
const dispatchAddToDo = text => {
  store.dispatch(addToDo(text));
}

const dispatchDeleteToDo = e => {
  const id = parseInt(e.target.parentNode.id);
  store.dispatch(deleteToDo(id));
}
// * Redux - event - add - END

const paintToDos = () => {
  const toDos = store.getState();
  ul.innerHTML = "";
  toDos.forEach(toDo => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "DEL";
    btn.addEventListener("click", dispatchDeleteToDo);
    li.id = toDo.id;
    li.innerText = toDo.text;
    li.appendChild(btn);
    ul.appendChild(li);
  })
}

store.subscribe(paintToDos);

const onSubmit = e => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  // createToDo(toDo); // !! 데이터 정보를 이용해서 DOM 만들기 => REDUX로 다시 관리 하기
  // store.dispatch({type: ADD_TODO, text: toDo }); // !! 함수로 리덕스 관리하기
  dispatchAddToDo(toDo);
}

// const createToDo = toDo => {
//   const li = document.querySelector("li");
//   li.innerText = toDo;
//   ul.appendChild(li);
// }

form.addEventListener("submit", onSubmit)