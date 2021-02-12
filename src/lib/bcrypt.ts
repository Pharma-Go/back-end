import { ValueTransformer } from "typeorm";
import { hashSync } from "bcrypt";

export class BCryptTransformer implements ValueTransformer {
  to(value: string) {
    return value && hashSync(value, 10)
  }
  from(value: string) {
    return value
  }
}