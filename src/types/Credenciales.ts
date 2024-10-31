import { Custom } from "./Custom";
import { AWS } from "./Aws";
import { IPC } from "./Ipc";

export type Credencial = {
  aws?: AWS;
  ipc?: IPC;
  custom?: Custom;
};
