import { Timestamp } from "firebase/firestore";

export interface AWS {
  idSoldador?: string;
  certificaciones?: AwsCertificaciones[];
  fechaVencimiento?: Date;
  historialPago?: HistorialPago;
  active?: boolean;
}
