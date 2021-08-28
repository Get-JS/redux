# redux

- [문서](https://redux.js.org/)
- [참고]()

- 전역 state 관리
- 비동기 로직 관리

- [redux](redux.md)

- [vanilla-redux](vanilla-redux)

  - reducer, actions
  - store
    - subscribe, dispatch

- [redux-helper](redux-helper)

  - [createItemsLogic](redux-helper/createItemsLogic)
    - createItemsLogic(custom), createReducer(custom), mergeReducers(custom)
  - [combineReducer](redux-helper/combineReducer)
    - combineReducer(redux) vs mergeReducers(custom)

- [react-redux](react-redux)

  - [todo](react-redux/todo)
    - createAction(toolkit), createReducer(toolkit), configureStore(toolkit)
    - createSlice(toolkit)
  - [without-react-redux](react-redux/without-react-redux)
    - subscribe, unsubscribe
  - [with-react-redux](react-redux/with-react-redux)
    - connect
      - mapStateToProps, mapDispatchToProps, Defining mapDispatchToProps As Object Type
  - [Hooks](react-redux/Hooks.md)
    - reudx Hooks

- [reselect](reselect)

  - [without-reselect](reselect/without-reselect)
  - [with-reselect](reselect/with-reselect)
    - when calculate in mapStateToProps, memozation
  - [with-reselect-props](reselect/with-reselect-props)
    - when create Instance to common Component for select function occur bug, sol. closure Function(memozation)

- [redux-thunk](redux-thunk)

  - createReduxThunk, loading-Reducer

- [redux-saga](redux-saga)

  - [with-redux-saga](redux-saga/with-redux-saga)
  - [with-redux-saga-exception](redux-saga/with-redux-saga-exception)

- [redux-classComponent](redux-classComponent)