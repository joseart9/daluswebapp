interface AWS {
  idSoldador?: string;
  certificaciones?: AwsCertificaciones[];
  fechaVencimiento?: Date;
  historialPago?: HistorialPago;
  active?: boolean;
}
