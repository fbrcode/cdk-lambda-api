import { SpaceEntry } from "../model/model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Missing field: ${missingField}`);
  }
}

export function validateAsSpaceEntry(arg: any) {
  if (!(arg as SpaceEntry).id) throw new MissingFieldError("id");
  if (!(arg as SpaceEntry).location) throw new MissingFieldError("location");
  if (!(arg as SpaceEntry).name) throw new MissingFieldError("name");
}
