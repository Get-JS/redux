# redux-saga

- 리덕스에서 `비동기 액션을 처리하는 방법중` 하나인 **redux-saga를 사용한다.**
- ES6의 `제너레이터를 기반으로` 만들어졌다.
- 리덕스 사가에서는 모든 `부수 효과가` **리덕스의 액션 객체처럼 표현된다.**
- API 통신을 위한 설정을 하지 않고도 **테스트 코드를 쉽게 작성할 수 있다.**
- redux-saga 유리한 상황
  - 기존 요청을 취소 처리해야 할 때(불필요한 중복 요청 방지)
  - 특정 액션이 발생했을 때 다른 액션을 발생시키거나, API 요청 등 리덕스와 관계없는 코드를 실행할 때
  - 웹소켓을 사용할 때
  - API 요청 실패 시 재요청해야 할 때

## with-redux-saga

- 리덕스 사가에서 사용할 목적으로 모든 액션 타입을 하나의 객체에 담아서 내보낸다.

```js
export const types = {
  INCREASE_NEXT_PAGE: "timeline/INCREASE_NEXT_PAGE",
  REQUEST_LIKE: "timeline/REQUEST_LIKE", // * 리덕스 사가에서만 사용되고 리듀서 함수에서는 사용되지 않는다.
  ADD_LIKE: "timeline/ADD_LIKE",
  SET_LOADING: "timeline/SET_LOADING",
};

export const actions = {
  addTimeline: add,
  removeTimeline: remove,
  editTimeline: edit,
  increaseNextPage: () => ({ type: types.INCREASE_NEXT_PAGE }),
  requestLike: (timeline) => ({ type: types.REQUEST_LIKE, timeline }),
  addLike: (timelineId, value) => ({ type: types.ADD_LIKE, timelineId, value }),
  setLoading: (isLoading) => ({ type: types.SET_LOADING, isLoading }),
};
```

- `redux-saga를 사용하여` **부수 효과를 작성한다.**

```js
import { all, call, put, take, fork } from "redux-saga/effects";
import { actions, types } from "./index";
import { callApiLike } from "../../common/api";

export function* fetchData(action) {
  while (true) {
    const { timeline } = yield take(types.REQUEST_LIKE);
    yield put(actions.setLoading(true));
    yield put(actions.addLike(timeline.id, 1));
    yield call(callApiLike);
    yield put(actions.setLoading(false));
  }
}

export default function* watcher() {
  yield all([fork(fetchData)]);
}
```

- 다음은 store 작성 내용이다.

```js
import { createStore, combineReducers, applyMiddleware } from "redux";
import timelineReducer from "../timeline/state";
import friendReducer from "../friend/state";
import createSagaMiddleware from "redux-saga";
import timelineSaga from "../timeline/state/saga";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
export default store;
sagaMiddleware.run(timelineSaga);
```

- store에서 사가 미들웨어 함수를 만들고 스토어를 생성할 때 입력한다.

## Exception 처리

- 제너레이터 덕분에 외부 부수 함수의 에러 정보를 알 수 있다.

```js
export function* fetchData(action) {
  while (true) {
    const { timeline } = yield take(types.REQUEST_LIKE);
    yield put(actions.setLoading(true));
    yield put(actions.addLike(timeline.id, 1));
    yield put(actions.setError(""));
    try {
      yield call(callApiLike);
    } catch (error) {
      yield put(actions.setError(error));
      yield put(actions.addLike(timeline.id, -1));
    }
    yield put(actions.setLoading(false));
  }
}
```

## debounce 구현

- 짧은 시간에 같`은 이벤트가 반복해서 발생할 때` **모든 이벤트를 처리하기 부담스러울 수 있는데**, 이때 `디바운스(debounce)를` 사용한다.
- 같은 함수가 연속해서 호출될 때 첫 번째 또는 마지막 호출만 실행하는 기능이다.

```js
export function* trySetText(action) {
  const { text } = action;
  yield put(actions.setText(text));
}

export default function* watcher() {
  yield all([fork(fetchData), debounce(500, types.TRY_SET_TEXT, trySetText)]);
}
```

- TRY_SET_TEXT 액션이 발생하고 0.5초 동안 재발생하지 않으면 trySetText 사가 함수를 실행한다.

## 사가 함수 테스트

- 일반적으로 API 통신과 같은 비동기 코드를 테스트 하려면 모조(mock) 객체를 생성해야 하지만 리덕스 사가에서는 모조 객체가 필요 없다.
- 부수 효과 함수를 호출한 결과가 간단한 객체이기 때문이다.
- `cloneableGenerator` 함수를 이용하면 **복사가 가능한 제너레이터 객체를 만들 수 있다.**
  - 제너레이터 객체를 복사하면 다양한 경우를 테스트하기 좋다.

```js
import { take, put, call } from "redux-saga/effects";
import { cloneableGenerator } from "@redux-saga/testing-utils";
import { types, actions } from "./index";
import { fetchData } from "./saga";
import { callApiLike } from "../../common/api";

describe("fetchData", () => {
  const timeline = { id: 1 };
  const action = actions.requestLike(timeline);
  const gen = cloneableGenerator(fetchData)();

  it("before callApiLike", () => {
    expect(gen.next().value).toEqual(take(types.REQUEST_LIKE));
    expect(gen.next(action).value).toEqual(put(actions.setLoading(true)));
    expect(gen.next().value).toEqual(put(actions.addLike(timeline.id, 1)));
    expect(gen.next(action).value).toEqual(put(actions.setError("")));
    expect(gen.next().value).toEqual(call(callApiLike));
  });
  it("on fail callApiLike", () => {
    const gen2 = gen.clone();
    const errorMsg = "error";
    expect(gen2.throw(errorMsg).value).toEqual(put(actions.setError(errorMsg)));
    expect(gen2.next().value).toEqual(put(actions.addLike(timeline.id, -1)));
  });
  it("on success callApiLike", () => {
    const gen2 = gen.clone();
    expect(gen2.next(Promise.resolve()).value).toEqual(
      put(actions.setLoading(false))
    );
    expect(gen2.next().value).toEqual(take(types.REQUEST_LIKE));
  });
});
```
