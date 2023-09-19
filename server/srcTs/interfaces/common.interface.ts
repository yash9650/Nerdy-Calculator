export interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface ICalculation {
  id: number;
  name: string;
  calculation: string;
  result: string;
  user?: IUser;
}
