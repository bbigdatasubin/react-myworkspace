import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useRef } from "react";
import { useDispatch } from "react-redux";

const FitnessForm = () => {
  const u_height = useRef();
  const u_weight = useRef();
  // store에 dispatch할 함수를 생성
  const dispatch = useDispatch();

  const add = () => {
    const height = u_height.current.value;
    const weight = u_weight.current.value;

    // dispatch(action객체)
    // action객체 = {type:"명령어", payload:메시지객체}
    dispatch({ type: "ADD_FITNESS", payload: { height, weight } });
    u_height.current.value = "";
    u_weight.current.value = "";
  };

  return (
    <div style={{ display: "flex" }}>
      <TextField
        variant="outlined"
        inputRef={u_height}
        label="height"
        size="small"
        style={{
          width: "90%",
          marginRight: "0.5rem",
        }}
      />
      <TextField
        variant="outlined"
        inputRef={u_weight}
        label="weight"
        size="small"
        style={{
          width: "90%",
          marginRight: "0.5rem",
        }}
      />
      <Button
        style={{ width: "10%" }}
        variant="contained"
        color="primary"
        onClick={add}
      >
        입력
      </Button>
    </div>
  );
};
export default FitnessForm;
