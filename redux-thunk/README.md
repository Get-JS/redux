# redux-thunk

- 리덕스를 사용하는 프로젝트에서 `비동기 작업을` 처리할 때 가장 기본적으로 사용하는 `미들웨어 이다.`

## Thunk

- `특정 작업을 나중에 할 수 있도록` 미루기 위해 **함수 형태로 감싼 것을 의미한다.**
- redux-thunk 라이브러리를 사용하면 `thunk 함수를 만들어서` **dispatch 할 수 있다.**
- 그 함수를 전달 받아 store의 `dispatch와` `getState를` 파라미터로 넣어서 호출해 준다.

```js
const sampleThunk = () => (dispatch, getState) => {
  // 현재 상태를 참조할 수 있다.
  // 새 액션을 디스패치할 수도 있다.
};
```

- store

```js
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import ReduxThunk from "redux-thunk";

const logger = createLogger();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, ReduxThunk))
);
```

- 일반 dispatch

```js
function mapDispatchToProps(dispatch) {
  return {
    onBtnClick: () => dispatch(increase()),
  };
}
```

- redux-thunk는 `액션 생성 함수에서` `일반 액션 객체를 반환하는 대신에` **함수를 반환한다.**
- 액션 기록을 확인해 보면, `처음` dispatch되는 액션은 **함수 형태이고**, `두 번째` 액션은 **객체 형태이다.**

```js
export const increaseAsync = () => (dispatch) => {
  setTimeout(() => {
    dispatch(increase());
  }, 1000);
};
```

## createReduxThunk(custom)

- createReduxThunk 커스텀 파일을 만들어 비동기 API 호출 시 loading 상태를 업데이트를 한다.
- loading 상태를 type에 따라 관리가 가능하다.
- API 콜 성공 혹은 실패 시, ${type}_SUCESS, ${type}\_FAILURE로 type에 따라 dispatch하게 된다.

```js
import { startLoading, finishLoading } from "../../modules/loading";

export default function createRequestThunk(type, request) {
  const SUCESS = `${type}_SUCESS`;
  const FAILURE = `${type}_FAILURE`;
  return (params) => async (dispatch) => {
    dispatch(startLoading(type));
    try {
      const { data } = await request(params);
      dispatch({
        type: SUCESS,
        payload: data,
      });
      dispatch(finishLoading(type));
    } catch (error) {
      dispatch({
        type: FAILURE,
        payload: error,
        error: true,
      });
      dispatch(finishLoading(type));
      throw error;
    }
  };
}
```

## loading Reducer

```js
import { createAction, handleActions } from "redux-actions";

const START_LOADING = "loading/START_LOADING";
const FINISH_LOADING = "loading/FINISH_LOADING";

export const startLoading = createAction(
  START_LOADING,
  (requestType) => requestType
);
export const finishLoading = createAction(
  FINISH_LOADING,
  (requestType) => requestType
);

const initialState = {};

const loading = handleActions(
  {
    [START_LOADING]: (state, { payload }) => ({
      ...state,
      [payload]: true,
    }),
    [FINISH_LOADING]: (state, { payload }) => ({
      ...state,
      [payload]: false,
    }),
  },
  initialState
);

export default loading;
```
