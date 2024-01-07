import { FormBlock } from "../Models/Question";

//MARKER: Array Helper Functions
export function duplicateItemAtIndex(arr: FormBlock[], index: number) {
  let item = { ...arr[index] };
  return [...arr.slice(0, index + 1), item, ...arr.slice(index + 1)];
}
export function addItemAfterIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index + 1), newValue, ...arr.slice(index + 1)];
}
export function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex<T>(arr: T[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
