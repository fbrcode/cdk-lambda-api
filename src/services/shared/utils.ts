import { InvalidJsonError } from "./validator";
import { randomUUID } from "crypto";

export function parseJSON(arg: string): any {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new InvalidJsonError(error.message);
  }
}

export function getRandomId(): string {
  return randomUUID();
}
