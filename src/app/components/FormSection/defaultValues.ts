import Soldador from "@/types/Soldador";

const defaultValues: Soldador = {
  // Datos Generales
  idSoldador: "",
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  correo: "",
  empresaActual: "",
  // Telefono
  telefono: {
    lada: "52",
    numero: "",
    tipo: undefined,
    extension: "",
  },
  // Direccion
  direccion: {
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    colonia: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
    pais: "",
  },
  // Credenciales
  credenciales: {},
};

export default defaultValues;

// const [formData, setFormData] = useState<Soldador>({
//   idSoldador: "",
//   primerNombre: "",
//   segundoNombre: "",
//   primerApellido: "",
//   segundoApellido: "",
//   correo: "",
//   empresaActual: "",
//   telefono: {
//       lada: "",
//       numero: "",
//   },
//   direccion: {
//       calle: "",
//       numeroExterior: "",
//       colonia: "",
//       codigoPostal: "",
//       ciudad: "",
//       estado: "",
//       pais: "",
//   },
//   credenciales: {
//       aws: {
//           idSoldador: "",
//           certificaciones: [],
//           fechaVencimiento: undefined,
//           historialPago: {
//               archivoFactura: "",
//               fechaPago: undefined,
//               empleado: "",
//           },
//           active: false,
//       },
//       ipc: {
//           certificaciones: [],
//           fechaVencimiento: undefined,
//           historialPago: {
//               archivoFactura: "",
//               fechaPago: undefined,
//               empleado: "",
//           },
//           active: false,
//       },
//       custom: {
//           certificaciones: [],
//           fechaVencimiento: undefined,
//           active: false,
//       }
//   }
// });
