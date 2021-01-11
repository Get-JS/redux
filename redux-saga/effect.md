# effect

- `delay(time)`: time초를 기다린다.
- `put`: 특정 액션을 dispatch 한다.
- `take`: 인수로 전달된 액션 타입을 기다린다. => 액션객체를 반환한다.(비동기)
- `takeEvery`: 들어오는 모든 액션에 대해 특정 작업을 처리해 준다.
- `takeLatest`: 기존에 진행중이던 작업이 있다면 취소 처리하고 가장 마지막으로 실행된 작업만 수행한다.
- `call`: Promise를 반환하는 함수를 호출하고 기다릴 수 있다.(동기) 첫 번째 파라미터는 함수, 나머지 파라미터는 해당함수에 넣을 인수이다.
- `select`: 사가 내부에서 현재 상태를 조회하는 방법이다.

  ```js
  const counter = yield select(state => state.counter);
  ```

- throttle: 사가가 n초에 단 한 번만 호출되도록 설정할 수 있다.
  ```js
  yield throttle(3000, INCREASE_ASYNC, increaseSaga);
  ```
- debounce: time초 후에 실행한다.
  ```js
  debounce(5000, types.TRY_SET_TEXT, trySetText),
  ```

## take, put, call

```js
const a = take(types.REQUEST_LIKE);
const b = put(actions.setLoading(false));
const c = call(callApiLike);
```

- 출력

```js
a : {
  TAKE: {
    pattern: 'timeline/REQUEST_LIKE',
  },
},
b: {
  PUT: {
    chanel: null,
    action: {
      type: 'timeline/SET_LOADING',
      isLoading: false,
    },
  },
}
c: {
  CALL: {
    context: null,
    fn: callApiLike,
    args: [],
  },
}
```

- `take`: `pattern이라는` 속성값의 이름에서 알 수 있듯이 **take함수는 여러 개의 액션을 기다릴 수도 있다.**
- `put`: 입력했던 **액션 객체를 담고 있다.**
- `call`: **입력한 함수를 담고 있다.**
- 리덕스 사가의 부수 효과 함수는 해야 **할 일을 설명하는 객체를 반환한다.**
- `반환된 객체를` **사가 미들웨어에게 전달된다.**
- 사가 미들뒈어는 부수 효과 객체가 설명하는 일을 하고 그 결과와 함께 실행 흐름을 우리가 작성한 함수로 넘긴다.
- 이 과정을 반복하면서 사가 미들웨어와 협업하는 것이다.
