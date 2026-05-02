let intentionalDisconnect = false;

function markIntentionalDisconnect() {
  intentionalDisconnect = true;
}

function consumeIntentionalDisconnect() {
  if (!intentionalDisconnect) return false;

  intentionalDisconnect = false;
  return true;
}

export { markIntentionalDisconnect, consumeIntentionalDisconnect };
