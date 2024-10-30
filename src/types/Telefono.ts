export default interface Telefono {
  lada: string;
  numero: string;
  tipo?: "Celular" | "Casa" | "Oficina";
  extension?: string;
}
