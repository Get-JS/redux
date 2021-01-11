# redux-helper

- 여러 개의 리덕스를 관리하기 위해 패키지 혹은 커스텀 메서드를 사용하여 관리하는 방법을 설명한다.

## combineReducer

- 프로그램 안에서 사용되는 데이터의 양이 많아지면, 데이터를 체계적으로 구조화하는 방법이 필요하다.
- 프로그램의 모든 액션을 하나의 파일에 작성하거나 모든 액션 처리 로직을 하나의 리듀서 함수로 작성할 수는 없다.
- 보통 프로그램의 큰 기능별로 폴더를 만들어서 코드를 관리한다.
- 리덕스 코드도 **각 기능 폴더 하위에 작성해서 관리하는게 좋다.**
- redux에서 제공하는 `combineReducer` 함수를 이용하면 **리듀서 함수를 여러 개로 분리할 수 있다.**
  - 하나의 객체 안에 combineReducer에 정의한 key 값을 담는 구조가 된다.

```js
import createReducer from "./createReducer";
import { createStore, combineReducers } from "redux";
import timelineReducer, { // * action 생성자 함수
  addTimeline,
  removeTimeline,
  editTimeline,
  increaseNextPage,
} from "./timeline/state";
import friendReducer, { // * action 생성자 함수
  addFriend,
  removeFriend,
  editFriend,
} from "./friend/state";

const reducer = combineReducers({
  timeline: timelineReducer,
  friend: friendReducer,
});
```

## createReducer(custom)

- reducer를 생성할 때, 항상 action의 type을 switch 문으로 관리하게 된다면 복잡한 코드를 작성할 때, 힘든 작업을 초래할 수 있다.
- state immutable로 관리 할 때 깊은 객체를 관리하게 된다면 코드가 복잡해질 수 있다.
  - createReducer(custom)을 만들어 종합적으로 관리해주는 리듀서를 리턴한다.

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

## createItemsLogic(custom)

- 이 전 작업 코드를 보면 중복된 코드가 많아 보인다.
  - 배열과 관련된 액션 타입과 액션 생성자 함수
  - 초기 상탯값을 빈 배열로 정의
  - 배열의 데이터를 추가, 삭제, 수정하는 리듀서 코드
- 하나의 파일로 `리듀서와` `action 생성자 함수를` 리턴하는 코드를 만든다.

```js
export default function createItemsLogic(name) {
  const ADD = `${name}/ADD`;
  const REMOVE = `${name}/REMOVE`;
  const EDIT = `${name}/EDIT`;

  const add = (item) => ({ type: ADD, item });
  const remove = (item) => ({ type: REMOVE, item });
  const edit = (item) => ({ type: EDIT, item });

  const reducer = createReducer(
    { [name]: [] },
    {
      [ADD]: (state, action) => state[name].push(action.item),
      [REMOVE]: (state, action) => {
        const index = state[name].findIndex(
          (item) => item.id === action.item.id
        );
        state[name].splice(index, 1);
      },
      [EDIT]: (state, action) => {
        const index = state[name].findIndex(
          (item) => item.id === action.item.id
        );
        if (index >= 0) {
          state[name][index] = action.item;
        }
      },
    }
  );

  return { add, remove, edit, reducer };
}
```

## mergeReducers(custom)

- 리덕스에서 제공하는 combineReducers 함수를 이용하면 상탯값의 깊이가 불필요하게 깊어질 때가 있다.

```js
export default combineReducers({
  common: reducer,
  timeLines: timelinesReducer,
});
```

- 상탯값 출력

```js
timeline: {
  common: {
    nextPage: 1;
  }
  timeLines: {
    timelines: Array(1);
  }
}
```

- 각 리듀서마다 새로운 이름을 부여하면서 객체의 깊이가 깊어진다.

```js
export default function mergeReducers(reducers) {
  return function (state, action) {
    if (!state) {
      return reducers.reduce((acc, r) => ({ ...acc, ...r(state, action) }), {});
    } else {
      let nextState = state;
      for (const r of reducers) {
        nextState = r(nextState, action);
      }
      return nextState;
    }
  };
}
```

- `mergeReducers 함수는` **리듀서를 반환한다.**
- 초기 상탯값을 계산할 때는 모든 리듀서 함수의 결괏값을 합친다.
- 초기화 단계가 아니라면 입력된 모든 리듀서를 호출해서 다음 상탯값을 반환한다.
