import { writable } from "svelte/store";

/**
 * Hook input formulir. Hasilnya adalah store yang bisa dibaca dengan $nama
 * di template, ditambah onChange (untuk event input) dan reset.
 */
export function useInput(initial) {
  const { subscribe, set } = writable(initial);
  const onChange = (event) => set(event.target.value);
  const reset = () => set(initial);
  return { subscribe, set, onChange, reset };
}
