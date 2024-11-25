import Soldador from "@/types/Soldador";

export default function getMostImportantAwsCertification(
  soldador: Soldador
): AwsCertificaciones | null {
  if (
    !soldador.credenciales?.aws ||
    !Array.isArray(soldador.credenciales.aws.certificaciones)
  ) {
    return null; // No hay certificaciones AWS
  }

  const nombreCertificacionesAws = [
    { key: "cw", label: "CW" },
    { key: "cwe", label: "CWE" },
    { key: "cws", label: "CWS" },
    { key: "cawi", label: "CAWI" },
    { key: "cwi", label: "CWI" },
    { key: "scwi", label: "SCWI" },
    { key: "cweng", label: "CWEng" },
  ];

  const { certificaciones } = soldador.credenciales.aws;

  // Ordenar las certificaciones AWS por importancia basada en `nombreCertificacionesAws`
  const sortedCertifications = certificaciones.sort((a, b) => {
    const indexA = nombreCertificacionesAws.findIndex(
      (cert) => cert.key === a.name
    );
    const indexB = nombreCertificacionesAws.findIndex(
      (cert) => cert.key === b.name
    );

    // Certificaciones desconocidas van al final
    return (
      (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity)
    );
  });

  // La primera certificación después de ordenar es la más importante
  return sortedCertifications[0] || null;
}
