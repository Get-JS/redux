import { createStore, combineReducers } from 'redux';
import timelineReducer, {
  addTimeline,
  removeTimeline,
  editTimeline,
  increaseNextPage,
} from './timeline/state';
import friendReducer, {
  addFriend,
  removeFriend,
  editFriend,
} from './friend/state';

const reducer = combineReducers({
  timeline: timelineReducer,
  friend: friendReducer,
});
const store = createStore(reducer);
store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(addTimeline({ id: 1, desc: '방문글' }));
store.dispatch(addTimeline({ id: 2, desc: '방문글2' }));
store.dispatch(increaseNextPage());
store.dispatch(editTimeline({ id: 2, desc: '방문글3' }));
store.dispatch(removeTimeline({ id: 1 }));

store.dispatch(addFriend({ id: 1, name: 'guest1' }));
store.dispatch(addFriend({ id: 2, name: 'guest2' }));
store.dispatch(editFriend({ id: 2, name: 'guest3' }));
store.dispatch(removeFriend({ id: 1 }));
