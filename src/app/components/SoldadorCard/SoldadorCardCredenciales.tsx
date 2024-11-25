import Soldador from "@/types/Soldador";
import getMostImportantAwsCertification from "@/utils/getMostImportantAwsCertification";
import { Card, CardBody, Chip, Divider } from "@nextui-org/react";

export default function SoldadorCardCredenciales({ soldador }: { soldador: Soldador }) {
    const certifiacionAws = getMostImportantAwsCertification(soldador);
    return (
        <div className="flex flex-col w-full h-full flex-wrap gap-4">
            {/* AWS */}
            {soldador.credenciales?.aws && soldador.credenciales?.aws?.certificaciones && soldador.credenciales.aws.certificaciones.length > 0 && (
                <Card className={`w-full border-2 shadow-none`}
                >
                    <CardBody>
                        <div className="flex flex-row items-center w-full justify-between px-1">
                            <section className="w-full pr-4">
                                {certifiacionAws && (
                                    <>
                                        <p className="text-small text-default-700 uppercase">{certifiacionAws.name}</p>
                                        <p className="text-small text-default-500">{certifiacionAws.idCertificado}</p>
                                        {certifiacionAws.idEndorsement && <p className="text-small text-default-500">Endorsement: {certifiacionAws.idEndorsement}</p>}
                                    </>
                                )}
                                <Divider className="my-2" />
                                <p className="text-small text-default-700">{soldador.credenciales.aws.fechaVencimiento && new Date(soldador.credenciales.aws.fechaVencimiento).toDateString()}</p>
                            </section>
                            <Chip variant="bordered" color={`${soldador.credenciales?.aws.active ? "success" : "danger"}`} className="font-semibold mt-2">AWS</Chip>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* IPC */}
            {soldador.credenciales?.ipc && soldador.credenciales?.ipc?.certificaciones && soldador.credenciales.ipc.certificaciones.length > 0 && (
                <Card className={`w-full border-2 shadow-none`}
                >
                    <CardBody>
                        <div className="flex flex-row items-center w-full justify-between px-1">
                            <section className="w-full pr-4">
                                {soldador.credenciales?.ipc.certificaciones && soldador.credenciales?.ipc.certificaciones.map((cert, index) => (
                                    <div key={index} className="flex flex-col mt-2">
                                        <p className="text-small text-default-700 uppercase">{cert.name}</p>
                                        <p className="text-small text-default-500">{cert.idCertificado}</p>
                                        {cert.level && <p className="text-small text-default-500">{cert.level}</p>}
                                    </div>
                                ))}
                                <Divider className="my-2" />
                                <p className="text-small text-default-700">{soldador.credenciales?.ipc.fechaVencimiento && new Date(soldador.credenciales?.ipc.fechaVencimiento).toDateString()}</p>
                            </section>
                            <Chip variant="bordered" color={`${soldador.credenciales?.ipc.active ? "success" : "danger"}`} className="font-semibold mt-2">IPC</Chip>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Custom */}

            {soldador.credenciales?.custom && soldador.credenciales?.custom?.certificaciones && soldador.credenciales.custom.certificaciones.length > 0 && (
                <Card className={`w-full border-2 shadow-none`}
                >
                    <CardBody>
                        <div className="flex flex-row items-center w-full justify-between px-1">
                            <section className="w-full pr-4">
                                {soldador.credenciales?.custom.certificaciones && soldador.credenciales?.custom.certificaciones.map((cert, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className="text-small text-default-700 uppercase">{cert.name}</p>
                                        <p className="text-small text-default-500">{cert.idCertificado}</p>
                                    </div>
                                ))}
                                <Divider className="my-2" />
                                <p className="text-small text-default-700">{soldador.credenciales?.custom.fechaVencimiento && new Date(soldador.credenciales?.custom.fechaVencimiento).toDateString()}</p>
                            </section>
                            <Chip variant="bordered" color={`${soldador.credenciales?.custom.active ? "success" : "danger"}`} className="font-semibold mt-2">Custom</Chip>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div >
    )
}