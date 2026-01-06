type UserCredits = {
  usedFree: boolean;
  credits: number;
};

const creditStore = new Map<string, UserCredits>();

export function getUserCredits(email: string): UserCredits {
  if (!creditStore.has(email)) {
    creditStore.set(email, { usedFree: false, credits: 0 });
  }
  return creditStore.get(email)!;
}

export function addCredits(email: string, amount: number) {
  const user = getUserCredits(email);
  user.credits += amount;
}

export function consumeCredit(email: string) {
  const user = getUserCredits(email);
  if (user.credits > 0) {
    user.credits -= 1;
  }
}

export function markFreeUsed(email: string) {
  const user = getUserCredits(email);
  user.usedFree = true;
}
