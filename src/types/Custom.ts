import { Timestamp } from "firebase/firestore";

export interface Custom {
  certificaciones?: CustomCertificaciones[];
  fechaVencimiento?: Date;
  active?: boolean;
}
