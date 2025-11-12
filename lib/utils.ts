export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
