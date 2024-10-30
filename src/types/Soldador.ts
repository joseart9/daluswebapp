import Direccion from "./Direccion";
import Telefono from "./Telefono";

export default interface Soldador {
  idSoldador: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  correo?: string;
  telefono?: Telefono;
  direccion?: Direccion;
  empresaActual?: string;
}