# Redux

- [참고](https://mskims.github.io/redux-saga-in-korean/)

- 리덕스는 자바스크립트를 위한 상태 관리 프레임워크 이다.

  - `컴포넌트` 코드로부터 **상태 관리 코드를 분리할 수 있다.**
  - `서버 렌더링 시` **데이터 전달이 간편하다.**
  - `로컬 스토리지에` **데이터를 저장하고 불러오는** 코드를 쉽게 작성할 수 있다.
  - `같은 상탯값을` **다수의 컴포넌트에서 필요로 할 때 좋다.**
  - 부모 컴포넌트에서 `깊은 곳에 있는 자식 컴포넌트에` **상탯값을 전달할 때 좋다.**
  - 알림창과 같은 `전역 컴포넌트의` **상탯값을 관리할 때 좋다.**
  - `페이지가 전환되어도` **데이터는 살아 있어야 할 때 좋다.**

- 리덕스 사용시 **3가지 원칙은 지켜야 한다.**
  - 전체 상탯값을 하나의 객체에 저장한다.
  - 상탯값은 불변 객체이다.
  - 상탯값은 순수 함수에 의해서만 변경되어야 한다.

## Redux에서 상탯값이 변경되는 과정

```text
액션  => 미들웨어  =>  리듀서 => 스토어
^^                                 ||
|| <========== 뷰 <=============== vv
```

## action

```js
store.dispatch({ type: "OPEN_MODAL", payload: { isOpen: true } });
```

- 액션은 `type 속성값을` 가진 **객체이다.**
- 액션 객체를 `dispatch 메서드에 넣어서` 호출하면 리덕스는 상탯값을 변경하기 위해 위의 과정을 수행 한다.
- `액션 생성자 함수를` 따로 만들어 외부 파일에서도 같은 액션을 처리하도록 할 수 있다.

```js
const OPEN = "OPEN_MODAL";
function openModal(payload) => ({type: OPEN, payload });
store.dispatch(openModal({isOpen: true}));
```

## middleware

```js
const cMiddleWare = (store) => (next) => (action) => next(action);
```

- 리듀서가 `action을 처리하기 전에` 실행 하는 함수이다.
- 미들웨어는 `store와 action 기반으로` 필요한 작업을 수행 할 수 있다.
- `next 함수를 호출하면` 다른 미들웨어 함수가 호출되면서 최종적으로 리듀서 함수가 호출된다.
- `API 호출처럼` **부수효과를 여기서 많이 사용한다.**

```js
const store = createStore(
  myReducer,
  applyMiddleware(cMiddleWare1, cMiddleWare2)
);
```

## applyMiddleware 내부 함수

```js
const applyMiddleware = (...middlewares) => (createStore) => (...args) => {
  const store = createStore(...args);
  const funcsWidthStore = middlewares.map((middleware) => middleware(store));
  const chainFunc = funcsWithStore.reduce((a, b) => (next) => a(b(next)));
  return {
    ...store,
    dispatch: chainFunc(store.dispatch),
  };
};
```

- 외부에 노출되는 store의 dispatch 메서드는 **미들웨어가 적용된 버전으로 변경된다.**
- `만약 미들웨어가 두 개였다면` **a(b(store.dispatch))와 같다.**
- 따라서 사용자가 dispatch 메서드를 호출하면 첫 번째 미들웨어 함수부터 실행된다.
- 그리고 **마지막 미들웨어가 store.dispatch 메서드를 호출한다.**
- 다음은 미들웨어를 활용한 action 처리를 연기(delay)하는 코드이다.

```js
const delayAction = (store) => (next) => (action) => {
  const delay = action.meta && action.meta.delay;
  if (!delay) {
    return next(action);
  }
  const timeoutId = setTimeot(() => next(action), delay);
  return function cancel() {
    clearTimeout(timeoutId);
  };
};
const store = createStore(reducer, applyMiddleware(delayAction));
const cancel = store.dispatch({
  type: "SomeAction",
  meta: { delay: 1000 },
});
cancel();
```

## dispatch 내부 함수

- 리듀서 함수를 호출해서 store의 상탯값을 변경한다.

```js
function dispatch(action) {
  currentState = currentReducer(currentState, action);
  for (let i = 0; i < listeners.length; i++) {
    listners[i]();
  }
  return action;
}
```

- dispatch 메서드가 호출될 때마다 등록된 모든 이벤트 처리 함수를 호출한다.
- `상탯값이 변경되지 않아도` **이벤트 처리 함수를 호출하는 것에 주목한다.**
- `상탯값 변경을 검사하는 코드는` **각 이벤트 처리 함수에서 구현해야 한다.**
- 참고로 `react-redux 패키지의 connect 함수에서는` **자체적으로 상탯값 변경을 검사한다.**

## reducer

- 리듀서는 액션이 발생했을 때 **새로운 상탯값을 만드는 함수이다.**

```text
(state, action) => nextState
```

- 리덕스는 스토어를 생성할 때 상탯값이 없는 상태로 리듀서를 호출하므로, `매개변수의 기본값을 사용해서` **초기 상탯값을 정의한다.**
- 상탯값을 처리할 때 immutable로 처리해야 하지만, 상탯값이 깊은(depth)곳에서 수정한다면 불변처리가 쉽지 않다.
  - 그래서 `immer 패키지를 사용하여` **불변처리를 하게 된다.**

```js
import produce from "immer";

function reducer(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD:
        draft.todos.push(action.todo);
        break;
      case REMOVE_ALL:
        draft.dotos = [];
        break;
      case REMOVE:
        draft.todos = draft.todos.filter((todo) => todo.id !== action.id);
        break;
      default:
        break;
    }
  });
}
```

## 리듀서 작성시 주의 사항

- 리덕스의 `상탯값은 불변 객체이기 때문에` 언제든지 **객체의 레퍼런스가 변경될 수 있다.**
- 정보가 수정될 때 새로운 객체가 생성되는데, 객체를 참조한 변수는 오래된 객체를 참조하게 되므로 sync가 맞지 않을수 있다.
  - 객체를 참조할 때는 객체의 레퍼런스가 아니라 고유한 ID값을 이용하는게 좋다.
- 리듀서는 `순수 함수로` 작성해야 한다.
  - 랜덤 함수를 사용하거나, API를 호출 처럼 부수 효과를 호출하는 로직은 리턴 예측할 수 없기 때문에 디버깅 혹은 test하기가 힘들어진다.
  - `API 호출은` **액션 생성자 함수나 미들웨어에서 하면된다.**

## createAction(@reduxjs/toolkit)

- 액션 생성자를 하나씩 만들고, action안의 값이 변경 될 때, action 생성자와, reducer에 로직을 찾아야 하는 번거로움이 있다.
- createAction을 사용하게 된다면, action 생성자를 따로 만들 필요 없으며, action의 상수 타입값을 따로 생성할 필요가 없게된다.
  - 즉, **reudcer에 초점을 더욱 줄 수 있다.**
- **action의 값중 type외의 값은 payload 객체로 들어가게 된다.**

```js
import { createAction } from "@reduxjs/toolkit";
const addToDo = createAction("ADD");
const deleteToDo = createAction("DELETE");

const reducer = (state = [], action) => {
  switch (action.type) {
    case addToDo.type:
      return [{ text: action.payload, id: Date.now() }, ...state];
    case deleteToDo.type:
      return state.filter((toDo) => toDo.id !== action.payload);
    default:
      return state;
  }
};

// ...

store.dispatch(addToDo("anything"));
store.dispatch(deleteToDo(1));
```

## createReducer(@reduxjs/toolkit & custome)

- reducer를 사용할 때 **switch 대신 더 간결하게 리듀서 함수를 작성할 수 있다.**

```js
import { createAction, createReducer } from "@reduxjs/toolkit";

const addToDo = createAction("ADD");
const deleteToDo = createAction("DELETE");

// !! immutable, mutable 상관 없지만, mutable일 때, 값을 리턴하면 안된다.
const reducer = createReducer([], {
  [addToDo]: (state, action) => {
    state.push({ text: action.payload, id: Date.now() });
  },
  [deleteToDo]: (state, action) =>
    state.filter((toDo) => toDo.id !== action.payload),
});
```

- 다음은 createReducer 함수의 간단한 구현 코드 이다.

```js
import produce from "immer";

function createReducer(initialState, handlerMap) {
  return function (state = initialState, action) {
    return produce(state, (draft) => {
      const handler = handlerMap[action.type];
      if (handler) {
        handler(draft, action);
      }
    });
  };
}
```

## createSlice(@reduxjs/toolkit)

- `createSlice를` 사용할 경우 상탯값 초기값과, 리듀서를 간단하게 정의를 할 수 있다.
- reducer객체에 정의된 프로퍼티 이름으로 actions 객체를 리턴하게 된다.
- reducer에 정의된 메서드는 immutable, mutable 상관없이 정의가 가능하다.
  - **mutable 경우 리턴을 하게되면 안된다.**

```js
const toDos = createSlice({
  name: "toDosReducer",
  initialState: [],
  reducers: {
    add: (state, action) => {
      state.push({ text: action.payload, id: Date.now() });
    },
    remove: (state, action) =>
      state.filter((toDo) => toDo.id !== action.payload),
  },
});

export const { add, remove } = toDos.actions;
export default configureStore({ reducer: toDos.reducer }); // * redux 상태 볼 수 있음
```

## store

- store는 리덕스의 상탯값을 갖는 객체이다.
- 액션의 발생은 스토어의 dispatch 메소드로 시작된다.
- 스토어는 액션이 발생하면 미들웨어 함수를 실행하고, 리듀서를 실행해서 상탯값을 새로운 값으로 변경한다.
- 사전에 등록된 모든 이벤트 처리 함수에게 액션의 처리가 끝났다는것을 알린다.

## DucksPattern

- 리덕스 공식 문서에는 액션 타입, 액셩 생성자 함수, 리듀서 함수를 각각의 파일로 만들어서 설명한다.
- 하지만 많은 귀찮은 작업으로 인해, 덕스 패턴을 주로 사용한다.
  - 연관된 액션 타입, 액션 생성자 함수, 리듀서 함수를 하나의 파일로 작성한다.
  - 리듀서 함수는 export default 키워드로 내보낸다.
  - 액션 생성자 함수는 export 키워드로 내보낸다.
  - 액션 타입은 접두사와 액션 이름을 조합해서 만든다.
- 특정 파일의 코드가 많아지면 굳이 하나의 파일을 고집할 필요는 없다.
- redux-thunk 패키지를 이용해서 비동기 코드를 작성하는 경우에는 액션 생성자 함수의 코드 양이 많아진다.
- 이럴 때는 리듀서 코드와 액션 코드르 별도의 파일로 분리를 하는게 좋다.
