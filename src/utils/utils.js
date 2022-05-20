export function postMsgToParent(message) {
  window.parent.postMessage(message, '*');
}
