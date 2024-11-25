export default function actualizarEstatusCredenciales(soldador: any): any {
  const fechaActual = new Date();

  // Iterar sobre las credenciales del soldador
  for (const key in soldador.credenciales) {
    if (soldador.credenciales.hasOwnProperty(key)) {
      const credencial = soldador.credenciales[key];

      // Verificar si la credencial tiene una fecha de vencimiento válida
      if (credencial.fechaVencimiento) {
        const fechaVencimiento = new Date(credencial.fechaVencimiento);

        // Actualizar el campo "active" según la comparación con la fecha actual
        credencial.active = fechaVencimiento > fechaActual;
      }
    }
  }

  // Retornar el objeto soldador actualizado
  return soldador;
}
