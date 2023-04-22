
import "./Styles.css";
import { useReducer } from "react";
import ButtonDigit from "./ButtonDigit";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

function reducer (state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      } else if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      return{
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }else if (state.previousOperand == null) {
        return {
          ...state, 
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
      if (state.previousOperand == null || state.currentOperand == null || state.operation == null) {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
        overwrite: true
      }
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state;
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    default: 
      return state;
  }
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatter(operand) {
  if (operand == null) return 
  const [ integer, decimal ] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATER.format(integer);
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

function evaluate ({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);
  
  if (isNaN(current) || isNaN(previous)) return "";
  
  let computation = "";

  switch(operation) {
    case "/":
      computation = previous / current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "+": 
      computation = previous + current;
      break;
    case "-": 
      computation = previous - current;
      break;
    default:
      computation = "";
  }

  return computation.toString();
}

function App() {
  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(reducer, {})
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatter(previousOperand)} {operation}</div>
        <div className="current-operand">{formatter(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>CE</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={ dispatch }/>
      <ButtonDigit digit="1" dispatch={dispatch}/>
      <ButtonDigit digit="2" dispatch={dispatch}/>
      <ButtonDigit digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <ButtonDigit digit="4" dispatch={dispatch}/>
      <ButtonDigit digit="5" dispatch={dispatch}/>
      <ButtonDigit digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <ButtonDigit digit="7" dispatch={dispatch}/>
      <ButtonDigit digit="8" dispatch={dispatch}/>
      <ButtonDigit digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <ButtonDigit digit="." dispatch={dispatch}/>
      <ButtonDigit digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>  
    </div> 
  )
}

export default App;
