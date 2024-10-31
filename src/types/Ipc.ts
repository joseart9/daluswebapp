import { Timestamp } from "firebase/firestore";

export interface IPC {
  certificaciones?: IpcCertificaciones[];
  historialPago?: HistorialPago;
  fechaVencimiento?: Date;
  active?: boolean;
}
