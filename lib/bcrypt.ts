import { compare, hash } from "bcrypt";

// Config
const saltRounds = 10;

export function hashData(data: string) {
   return hash(data, saltRounds);
}

export function compareData(data: string, hashedData: string) {
   return compare(data, hashedData);
}
