import { all, call, put, take, fork, debounce } from "redux-saga/effects";
import { actions, types } from "./index";
import { callApiLike } from "../../common/api";

export function* fetchData() {
  while (true) {
    const { timeline } = yield take(types.REQUEST_LIKE);
    yield put(actions.setLoading(true));
    yield put(actions.setError(""));
    try {
      yield call(callApiLike);
      yield put(actions.addLike(timeline.id, 1));
    } catch (error) {
      yield put(actions.setError(error));
    } finally {
      yield put(actions.setLoading(false));
    }
  }
}

export function* trySetText(action) {
  const { text } = action;
  yield put(actions.setText(text));
}

export default function* watcher() {
  yield all([fork(fetchData), debounce(5000, types.TRY_SET_TEXT, trySetText)]);
}
