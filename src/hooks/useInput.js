import { writable } from "svelte/store";

/** Hook input formulir berbasis Svelte store. */
export function useInput(initialValue = "") {
  const value = writable(initialValue);
  const onChange = (event) => value.set(event.target.value);
  const reset = () => value.set(initialValue);
  return { value, onChange, reset };
}
