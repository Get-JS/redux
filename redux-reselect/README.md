# reselect

## witout-reselect

```js
const mapStateToProps = state => {
  const friends = state.friend.friends;
  const ageLimit = state.friend.ageLimit;
  const showLimit = state.friend.showLimit;
  const friendsWithAgeLimit = friends.filter(friend => friend.age <= ageLimit);
  const friendsWithAgeShowLimit = friendsWithAgeLimit.slice(0, showLimit);
  return {
    friendsWithAgeLimit,
    friendsWithAgeShowLimit,
    ageLimit,
    showLimit,
  };
};
```
- 리덕스에 저장된 `원본 데이터를` **화면에 보여 줄 데이터로 가공하고 있다.**
- `mapStateToProps` 함수가 호출될 때마다 데이터를 가공하는 연산이 수행이 된다.
- `mapStateToProps` 함수는 리덕스의 액션이 처리될 때마다 호출된다.
- 근본적인 문제는 `state.friend.friends` 변경되지 않았을 때도 데이터를 가공하는 연산이 수행된다.
- `state.friend.friends`의 크기가 크면 클수록 불필요한 연산도 증가한다.

## with-reselect

- `reselect` 패키지를 사용할 때는 선택자(selector) 함수를 작성한다.
```js
import { createSelector } from 'reselect';

const getFriends = state => state.friend.friends;
export const getAgeLimit = state => state.friend.ageLimit;
export const getShowLimit = state => state.friend.showLimit;

export const getFriendsWithAgeLimit = createSelector(
  [getFriends, getAgeLimit], // * 함수로 전달될 인수를 정의한다. 배열의 각 함수가 반환하는 값이 순서대로 전달된다.
  (friends, ageLimit) => friends.filter(friend => friend.age <= ageLimit), // * 배열의 함수들이 반환한 값을 입력받아서 처리하는 함수다.
);
export const getFriendsWithAgeShowLimit = createSelector(
  [getFriendsWithAgeLimit, getShowLimit],
  (friendsWithAgeLimit, showLimit) => friendsWithAgeLimit.slice(0, showLimit),
);
```
- `reselect` 패키지는 **메모제이션 기능이 있다.**
- 연산에 사용되는 데이터가 변경된 경우에만 연산을 수행하고, 변경되지 않았다면 이전 결괏값을 재사용 한다.
  - `getFriendsWithAgeLimit`함수는 friends, ageLimit가 변경될 때만 연산한다.
  - `getFriendsWithAgeShowLimit` 함수는 friends, ageLimit, showLimit가 변경될 때만 연산한다.
- 데이터를 가공하는 코드가 컴포넌트 파일에서 분리되기 때문에 컴포넌트 파일에서는 UI 코드에 집중할 수 있다는 장점이 있다.
```js
const mapStateToProps = state => {
  return {
    ageLimit: getAgeLimit(state),
    showLimit: getShowLimit(state),
    friendsWithAgeLimit: getFriendsWithAgeLimit(state),
    friendsWithAgeShowLimit: getFriendsWithAgeShowLimit(state),
  };
};
```

## with-reselect-propps

- `selector` 함수는 **상탯값 외에도 속성값을 입력으로 받을 수 있다.**
- selector 함수에서 속성값을 이용하면 컴포넌트의 각 인스턴스에 특화된 값을 반환할 수 있다.
- `FriendMain` 컴포넌트의 인스턴스 2개를 생성한다.
```jsx
ReactDOM.render(
  <Provider store={store}>
    <div>
      <FriendMain ageLimit={30} />
      <FriendMain ageLimit={15} />
      <TimelineMain />
    </div>
  </Provider>,
  document.getElementById('root'),
);
```
- `mapStateProps` 이다.
```js
const mapStateToProps = (state, props) => {
  return {
    friendsWithAgeLimit: getFriendsWithAgeLimit(state, props),
  };
};
export default connect(
  mapStateToProps,
  actions,
)(FriendMain);
```
- `selector` 함수 이다.
```js
export const getAgeLimit = (state, props) => props.ageLimit;
export const getFriendsWithAgeLimit = createSelector(
  [getFriends, getAgeLimit],
  (friends, ageLimit) => friends.filter(friend => friend.age <= ageLimit),
);
export const getShowLimit = state => state.friend.showLimit;
export const getFriendsWithAgeShowLimit = createSelector(
  [getFriendsWithAgeLimit, getShowLimit],
  (friendsWithAgeLimit, showLimit) => friendsWithAgeLimit.slice(0, showLimit),
);
```
- 이제 `연령 제한 정보는` **속성값으로부터 가져온다.**
- 하지만, `두 개의 FriendMain 컴포넌트 인스턴스가` `서로 다른 연령 제한 속성값을 갖고 있기 때문에` **메모제이션 기능이 제대로 동작하지 않는다.**
- `부모 컴포넌트가 렌더링될 때마다` **두 인스턴스는 같은 선택자 함수를 다른 속성값으로 호출한다.**
- 각 컴포넌트 인스턴스 입장에서는 친구 목록과 연령 제한 정보가 변경되지 않더라도 선택자 함수의 입장에서 연령 제한 정보가 변경된다.

## 컴포넌트 인스턴스별로 독립된 메모제이션 적용

```js
export const makeGetFriendsWithAgeLimit = () => {
  return createSelector(
    [getFriends, getAgeLimit],
    (friends, ageLimit) => friends.filter(friend => friend.age <= ageLimit),
  );
};
```
- **선택자 함수를 생성하는 함수를 정의한다.**
- 각 컴포넌트 인스턴스가 `makeGetFriendsWithAgeLimit` 함수를 호출하면 자신만의 선택자 함수를 가질 수 있다.

```js
const makeMapStateToProps = () => {
  const getFriendsWithAgeLimit = makeGetFriendsWithAgeLimit();
  const mapStateToProps = (state, props) => {
    return {
      friendsWithAgeLimit: getFriendsWithAgeLimit(state, props),
    };
  };
  return mapStateToProps;
};
export default connect(
  makeMapStateToProps,
  actions,
)(FriendMain);
```
- `connect` 함수의 `첫 번째 매개변수로 전달된 함수가` **새로운 함수를 반환하면**, react-redux는 `각 컴포넌트의 인스턴스별로 독립적인` **mapStateToProps 함수 인스턴스를 만들어서 사용한다.**
- `mapStateToProps` 생성될 때마다 `getFriendsWithAgeLimit` 선택자 함수도 생성된다.
- 결과적으로 `각 컴포넌트의 인스턴스는 각자의` `getFriendsWithAgeLimit` 함수를 확보한다.