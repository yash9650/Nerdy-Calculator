import { UserEntity } from "../Database/Entities/user.entity";

declare global {
  namespace Express {
    export interface User extends Partial<UserEntity> {}

    export interface Request {}
  }
}
