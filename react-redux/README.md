# react-redux

## without-react-redux

- `subscribe` 함수를 통해 store의 변화를 감지하여 `state를` **업데이트를 한다.**
- `subscribe 함수를 통해 얻어진 리턴 값으로` **unsubscribe를 호출할 수 있다.**

```jsx
class TimelineMain extends PureComponent {
  state = {
    timelines: store.getState().timeline.timelines,
  };
  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.setState({ timelines: store.getState().timeline.timelines })
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onAdd = () => {
    const timeline = getNextTimeline();
    store.dispatch(addTimeline(timeline));
  };
  render() {
    return (
      <div>
        <button onClick={this.onAdd}>타임라인 추가</button>
        <TimelineList timelines={this.state.timelines} />
      </div>
    );
  }
}
```

## with-react-redux

- react-redux에서 제공하는 contextAPI인 `Provider` 컴포넌트를 사용한다.
- store정보를 Provider props로 넘겨준다.

```jsx
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <div>
      <FriendMain />
      <TimelineMain />
    </div>
  </Provider>,
  document.getElementById("root")
);
```

- `Provider는` 전달받은 `store 객체의 subscribe 메서드를 호출해서` **액션 처리가 끝날 때 마다 알림을 받는다.**
- Provider의 childern 속성들은 store 객체를 사용할 수 있다.
- `컴포넌트가 리덕스 상탯값 변경에 반응하기 위해서는` react-redux에서 제공하는 `connect` 함수를 사용해야 한다.
- connect 함수는 총 4개의 매개변수를 갖는다.
  - 대부분 `mapStateToProps` 함수와 `mapDispatchToProps` 함수만 사용해도 충분하다.
- `connect` 함수를 `호출하면` **고차 컴포넌트가 생성된다.**

```jsx
class FriendMain extends Component {
  onAdd = () => {
    const friend = getNextFriend();
    this.props.addFriend(friend);
  };
  render() {
    console.log("FriendMain render");
    const { friends } = this.props;
    return (
      <div>
        <button onClick={this.onAdd}>친구 추가</button>
        <FriendList friends={friends} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { friends: state.friend.friends };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addFriend: (friend) => {
      dispatch(addFriend(friend));
    },
  };
};
```

- `mapStateToProps` 함수는 리덕스의 상탯값을 기반으로 **컴포넌트에서 사용할 데이터를 속성값으로 전달한다.**
- `mapDispatchToProps` 함수는 리덕스의 **상탯값을 변경하는 함수를 컴포넌트의 속성값으로 전달한다.**
  - 컴포넌트에서 **dispatch 메서드의 존재를 몰라도 리덕스의 상탯값을 수정할 수 있다.**
  - `함수를 작성하지 않으면` **dispatch 함수가 컴포넌트의 속성값으로 전달된다.**
- `mapDispatchToProps` 함수를 단순히 `액션 생성자 함수와 dispatch 메서드를 연결하는 목적으로 사용한다면` 다음과 같이 작성한다.

```jsx
import * as actions from "../state";

export default connect(mapStateToProps, actions)(FriendMain);
```

- `connect 함수의 두 번째 인자로 객체를 전달하면` **그 객체를 액션 생성자 함수를 모아 놓은 객체로 인식한다.**

> Because this is so common, `connect` supports an “object shorthand” form for the mapDispatchToProps argument: if you pass an object full of action creators instead of a function, `connect` **will automatically call `bindActionCreators` for you internally.**

```js
import { bindActionCreators } from "redux";

const increment = () => ({ type: "INCREMENT" });
const decrement = () => ({ type: "DECREMENT" });
const reset = () => ({ type: "RESET" });

// binding an action creator
// returns (...args) => dispatch(increment(...args))
const boundIncrement = bindActionCreators(increment, dispatch);

// binding an object full of action creators
const boundActionCreators = bindActionCreators(
  { increment, decrement, reset },
  dispatch
);
// returns
// {
//   increment: (...args) => dispatch(increment(...args)),
//   decrement: (...args) => dispatch(decrement(...args)),
//   reset: (...args) => dispatch(reset(...args)),
// }
```

> `bindActionCreators` turns an object whose values are action creators, into an object with the same keys, but with every action creator wrapped into a `dispatch` call so they may be invoked directly.

```js
import { bindActionCreators } from "redux";
// ...

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ increment, decrement, reset }, dispatch);
}

// component receives props.increment, props.decrement, props.reset
connect(null, mapDispatchToProps)(Counter);
```
