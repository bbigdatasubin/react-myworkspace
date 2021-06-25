// action에 대해서 중간에 가로채기하여 처리하는 saga

import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import api from "../../api/fitness";

function* addFitness(action) {
  console.log("--sagas: add Fitness --");
  console.log(action);

  try {
    const result = yield call(api.add, action.payload);
    console.log(result);

    const { size } = yield select((state) => state.fitness);
    const resultFetched = yield call(api.fetchPaging, 0, size);
    console.log(resultFetched);

    yield put({
      type: "FETCH_FITNESSLIST_PAGING_SUCCEEDED",
      payload: resultFetched.data,
    });
  } catch (e) {
    alert(e.message);
  }

  // 3. 처리중입니다. 메시지 숨기기
  // yield put({type:"PROGRESS_DONE"})
}

function* fetchFitnessListPaging(action) {
  console.log("--sagas: fetch Fitnesslist Paging --");
  console.log(action);

  try {
    // redux state에 page와 size 가져오기
    const { page, size } = yield select((state) => state.fitness);

    // 1. 서버에서 데이터 받아오기
    // page, size를 넘겨줘야함
    // 매개변수가 없을 때(처음 로딩) -> 기존 redux state의 page와 size로 처리
    // 매개변수가 있을 때(페이지네이션으로 페이지 이동) -> 매개변수 값으로 page와 size를 처리
    const result = yield call(
      api.fetchPaging,
      action.payload ? action.payload.page : page,
      action.payload ? action.payload.size : size
    );
    console.log(result);
    // 2. 받아온 데이터로 state 변경
    yield put({
      type: "FETCH_FITNESSLIST_PAGING_SUCCEEDED",
      payload: result.data,
    });
  } catch (e) {
    alert(e.message);
  }
}

function* removeFitness(action) {
  console.log("--sagas: remove Fitness --");
  console.log(action);

  try {
    // 1. 서버의 REST API를 호출함
    // action.payload == id
    // id: 데이터베이스의 PK, JPA 엔티티의 @Id
    const result = yield call(api.remove, action.payload);
    console.log(result);

    // 2. 서버에서 삭제된 데이터가 반영된 목록을 다시 받아옴
    // 현재페이지
    // redux state에 size가져오기
    const { page, size } = yield select((state) => state.fitness);
    const resultFetched = yield call(api.fetchPaging, page, size);
    console.log(resultFetched);

    yield put({
      type: "FETCH_FITNESSLIST_PAGING_SUCCEEDED",
      payload: resultFetched.data,
    });
  } catch (e) {
    alert(e.message);
  }
}

function* modifyFitness(action) {
  console.log("--sagas: modify Fitness --");
  console.log(action);

  try {
    // 1. 서버의 REST API를 호출함
    // action.payload == {id, memo}
    const result = yield call(api.modify, action.payload);
    console.log(result);
    // result.data == {id, createdTime, memo}
    // 2. API호출이 완료되면 state를 변경함
    yield put({
      type: "MODIFY_FITNESS_SUCCEEDED",
      payload: result.data,
    });
  } catch (e) {
    alert(e.message);
  }
}

// contact list와 관련된 액션이 dispatch되면 중간에 처리할 함수 목록을 작성
function* fitnessSaga() {
  // takeEvery: 모든 dispatch하는 action에 대해서 처리함
  // takeLatest: 가장 나중에 dispatch하는 action에 대해서만 처리함
  yield takeEvery("ADD_FITNESS", addFitness);
  yield takeEvery("REMOVE_FITNESS", removeFitness);
  yield takeEvery("MODIFY_FITNESS", modifyFitness);
  yield takeLatest("FETCH_FITNESSLIST_PAGING", fetchFitnessListPaging);
}

export default fitnessSaga;