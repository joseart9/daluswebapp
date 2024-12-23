import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import Soldador from "@/types/Soldador";
import { useRouter } from 'next/navigation'
import SoldadorCardCredenciales from "./SoldadorCardCredenciales";
import SoldadorModal from "../SoldadorModal";
import { useDisclosure } from "@nextui-org/react";

export default function SoldadorCard({ soldador }: { soldador: Soldador }) {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

    function handleCardClick(event: any): void {
        // router.push(`/edit/${soldador.idSoldador}`);
        onOpen();
    }

    return (
        <Card disableRipple isPressable className="w-full shadow-lg" onPress={handleCardClick}>
            <CardHeader className="flex gap-3">
                <div className="flex flex-col w-full text-left">
                    <p className="text-md">{soldador.primerApellido} {soldador.segundoApellido} {soldador.primerNombre}</p>
                    <p className="text-small text-default-500">{soldador.empresaActual}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <SoldadorCardCredenciales soldador={soldador} />
            </CardBody>
            <Divider />
            <SoldadorModal soldador={soldador} onOpen={onOpen} onOpenChange={onOpenChange} isOpen={isOpen} />
        </Card>
    );
}
