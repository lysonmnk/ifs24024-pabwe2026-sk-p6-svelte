export function getPageLoadErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
