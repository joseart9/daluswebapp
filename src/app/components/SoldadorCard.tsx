import { Card, CardHeader, CardBody, CardFooter, Divider, Link } from "@nextui-org/react";
import Soldador from "@/types/Soldador";

export default function SoldadorCard({ soldador }: { soldador: Soldador }) {
    if (!soldador) return null;

    const renderCertifications = (certifications: any) => {
        // Asegura que certifications sea un array; si es un objeto, lo coloca en un array.
        const certArray = Array.isArray(certifications) ? certifications : [certifications];
        return certArray.map((cert, index) => (
            <div key={index} className="ml-4 mb-2">
                <p className="text-small text-default-500">Nombre: {cert.name}</p>
                <p className="text-small text-default-500">ID Certificado: {cert.idCertificado}</p>
                {cert.level && <p className="text-small text-default-500">Nivel: {cert.level}</p>}
                {cert.idEndorsement && <p className="text-small text-default-500">ID Endorsement: {cert.idEndorsement}</p>}
            </div>
        ));
    };

    return (
        <Card className="max-w-[400px] shadow-lg">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md">{soldador.primerApellido} {soldador.segundoApellido} {soldador.primerNombre}</p>
                    <p className="text-small text-default-500">{soldador.empresaActual}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <div>
                    <h3 className="text-lg font-bold">Credenciales</h3>
                    {soldador.credenciales?.aws && (
                        <div>
                            <h4 className="font-semibold mt-2">AWS</h4>
                            <p className="text-small text-default-500">ID Soldador: {soldador.credenciales.aws.idSoldador}</p>
                            <p className="text-small text-default-500">Fecha de Vencimiento: {soldador.credenciales.aws.fechaVencimiento && new Date(soldador.credenciales.aws.fechaVencimiento).toLocaleDateString()}</p>
                            {soldador.credenciales.aws.certificaciones && renderCertifications(soldador.credenciales.aws.certificaciones)}
                        </div>
                    )}
                    {soldador.credenciales?.ipc && (
                        <div>
                            <h4 className="font-semibold mt-2">IPC</h4>
                            <p className="text-small text-default-500">Fecha de Vencimiento: {soldador.credenciales.ipc.fechaVencimiento && new Date(soldador.credenciales.ipc.fechaVencimiento).toLocaleDateString()}</p>
                            {soldador.credenciales.ipc.certificaciones && renderCertifications(soldador.credenciales.ipc.certificaciones)}
                        </div>
                    )}
                    {soldador.credenciales?.custom && (
                        <div>
                            <h4 className="font-semibold mt-2">Custom</h4>
                            <p className="text-small text-default-500">Fecha de Vencimiento: {soldador.credenciales.custom.fechaVencimiento && new Date(soldador.credenciales.custom.fechaVencimiento).toLocaleDateString()}</p>
                            {soldador.credenciales.custom.certificaciones && renderCertifications(soldador.credenciales.custom.certificaciones)}
                        </div>
                    )}
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <div className="flex flex-col justify-between">
                    {soldador.telefono && <Link href={`tel:${soldador.telefono.numero}`}>{soldador.telefono.numero}</Link>}
                </div>
            </CardFooter>
        </Card>
    );
}
