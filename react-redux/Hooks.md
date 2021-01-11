# Hooks

- 리덕스 스토어와 연동된 컨테이너 컴포넌트를 만들 때 connect 함수를 사용하는 대신 react-redux 제공하는 Hooks를 사용할 수 있다.

## useSelector

- connect에 mapStateToProps 함수를 통하여 state를 받아 왔지만, useSelector를 사용하여 connect에서 받아오지 않아도 된다.

```js
import { useSelector } from "react-redux";
const number = useSelector(({ counter }) => counter.number);
```

- connect 함수를 사용하여 컨테이너 컴포넌트를 만들었을 경우,
- 해당 컨테이너 컴포넌트의 부모 컴포넌트가 리렌더링될 때 해당 컨테이너 컴포넌트의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지되어 성능이 최적화 된다.
- `useSelector를` 사용하여 리덕스 상태를 조회했을 때는 최적화 작업이 자동으로 이루어지지 않으므로, `memo를` **사용하여 성능최적화 한다.**

## useDispatch

- dispatch를 어디서나 사용이 가능해 졌다.
- 상위 store가 정해진 상태일 때 useDispatch는 해당 store의 dispatch를 가져오게 된다.

```js
import { useDispatch } from "react-redux";
const dispatch = useDispatch();
```

## useSotre

- 컴포넌트 내부에서 리덕스 스토어 객체를 직접 사용할 수 있다.

```js
import { useStore } from "react-redux";
const store = useStore();
```
