import Soldador from "@/types/Soldador";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Tooltip } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { FiExternalLink } from "react-icons/fi";
import { FaIdCard } from "react-icons/fa";

export default function SoldadorModal({ soldador, isOpen, onOpen, onOpenChange }: { soldador: Soldador, isOpen: boolean, onOpen: () => void, onOpenChange: () => void }) {
    const router = useRouter();

    const opciones: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short", // Muestra el mes completo
        day: "numeric",
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex fles-row items-center gap-2">
                                    <Button isIconOnly className="bg-transparent" onPress={onClose} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                        </svg>
                                    </Button>
                                </div>

                            </ModalHeader>
                            <ModalBody>
                                <section>
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-3">
                                            <span className="text-default-400 uppercase">Datos Personales</span>
                                            <section className="flex flex-col gap-2 px-2 text-default-800">
                                                <p>
                                                    {soldador.primerNombre} {soldador.segundoNombre} {soldador.primerApellido} {soldador.segundoApellido}
                                                </p>
                                                <p>
                                                    {soldador.empresaActual}
                                                </p>
                                                <a href={`mailto:${soldador.correo}`} style={{ color: 'blue' }} className="flex flex-row items-center">
                                                    {soldador.correo} <br /> <FiExternalLink className="size-3 ml-1" />
                                                </a>
                                                <p>
                                                    <a href={`tel:+${soldador.telefono?.lada}${soldador.telefono?.numero}`} style={{ color: 'blue' }} className="flex flex-row items-center">
                                                        +{soldador.telefono?.lada} {soldador.telefono?.numero} <FiExternalLink className="size-3 ml-1" />
                                                    </a>
                                                </p>
                                            </section>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <span className="text-default-400 uppercase">Dirección</span>
                                            <section className="flex flex-col gap-2 px-2 text-default-800">
                                                <p>
                                                    {soldador.direccion?.calle} {soldador.direccion?.numeroExterior} {soldador.direccion?.numeroInterior}, {soldador.direccion?.colonia}
                                                </p>
                                                <p>
                                                    {soldador.direccion?.ciudad}, {soldador.direccion?.estado}, {soldador.direccion?.pais}
                                                </p>
                                                <p>
                                                    {soldador.direccion?.codigoPostal}
                                                </p>
                                            </section>
                                        </div>


                                        <div className="flex flex-col gap-3">
                                            <span className="text-default-400 uppercase">Credenciales</span>
                                            <section className="flex flex-col gap-3 px-2">
                                                {soldador.credenciales?.aws && soldador.credenciales?.aws?.certificaciones && soldador.credenciales.aws.certificaciones.length > 0 && (
                                                    <section className="flex flex-col gap-3 px-2 text-default-500">
                                                        <section className="flex flex-col gap-4">
                                                            <div className="flex flex-row text-center justify-center text-default-400 items-center">
                                                                <span className="flex text-start text-default-800 font-semibold"> AWS |  </span>
                                                                <p className="capitalize text-default-500">
                                                                    &nbsp; {soldador.credenciales?.aws?.fechaVencimiento?.toLocaleDateString("es-ES", opciones)} &nbsp;
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-row items-center gap-1">
                                                                <FaIdCard className="size-5 " /> {soldador.credenciales?.aws?.idSoldador}
                                                            </div>
                                                        </section>
                                                        {soldador.credenciales?.aws?.certificaciones?.map((cert, index) => (
                                                            <div key={index} className={`border-l-4 ${soldador.credenciales?.aws?.active ? "border-green-500" : "border-red-500"} text-default-700 flex flex-col gap-2 rounded-lg bg-slate-100 shadow-md p-2`}>
                                                                <p className="uppercase text-default-900">
                                                                    {cert.name}
                                                                </p>
                                                                <p className="text-default-500 text-sm">
                                                                    {cert.idCertificado}
                                                                </p>
                                                                {cert.idEndorsement && <p className="text-default-400 text-sm">
                                                                    Endorsement {cert.idEndorsement}
                                                                </p>}
                                                            </div>
                                                        ))}
                                                    </section>
                                                )}

                                                {soldador.credenciales?.ipc && soldador.credenciales?.ipc?.certificaciones && soldador.credenciales.ipc.certificaciones.length > 0 && (
                                                    <section className="flex flex-col gap-3 px-2 text-default-700 pt-8">
                                                        <section className="flex flex-col gap-4">
                                                            <div className="flex flex-row text-center justify-center text-default-400 items-center">
                                                                <span className="flex text-center justify-center text-default-600 font-semibold"> IPC |  </span>
                                                                <p className="capitalize">
                                                                    &nbsp; {soldador.credenciales?.ipc?.fechaVencimiento?.toLocaleDateString("es-ES", opciones)} &nbsp;
                                                                </p>
                                                            </div>
                                                        </section>
                                                        {soldador.credenciales?.ipc?.certificaciones?.map((cert, index) => (
                                                            <div key={index} className={`border-l-4 ${soldador.credenciales?.ipc?.active ? "border-green-500" : "border-red-500"} text-default-700 flex flex-col gap-2 rounded-lg bg-slate-100 shadow-md p-2`}>
                                                                <p className="uppercase">
                                                                    {cert.name}
                                                                </p>
                                                                <p className="text-default-400 text-sm">
                                                                    {cert.idCertificado}
                                                                </p>
                                                                {cert.level && <p className="text-default-400 text-sm">
                                                                    {cert.level}
                                                                </p>}
                                                            </div>
                                                        ))}
                                                    </section>
                                                )}

                                                {soldador.credenciales?.custom && soldador.credenciales?.custom?.certificaciones && soldador.credenciales.custom.certificaciones.length > 0 && (
                                                    <section className="flex flex-col gap-3 px-2 text-default-700 pt-8">
                                                        <section className="flex flex-col gap-4">
                                                            <div className="flex flex-row text-center justify-center text-default-400 w-full items-center">
                                                                <span className="flex text-center justify-center text-default-600 font-semibold"> CUSTOM |  </span>
                                                                <p className="capitalize text-ellipsis">
                                                                    &nbsp;{soldador.credenciales?.custom?.fechaVencimiento?.toLocaleDateString("es-ES", opciones)}&nbsp;
                                                                </p>
                                                            </div>
                                                        </section>
                                                        {soldador.credenciales?.custom?.certificaciones?.map((cert, index) => (
                                                            <div key={index} className={`border-l-4 ${soldador.credenciales?.custom?.active ? "border-green-500" : "border-red-500"} text-default-700 flex flex-col gap-2 rounded-lg bg-slate-100 shadow-md p-2`}>
                                                                <p className="uppercase">
                                                                    {cert.name}
                                                                </p>
                                                                <p className="text-default-400 text-sm" >
                                                                    {cert.idCertificado}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </section>
                                                )}
                                            </section>
                                        </div>
                                    </div>
                                </section>
                            </ModalBody>
                            <ModalFooter className="flex flex-row w-full justify-end">
                                <Button color="primary" className="text-white font-semibold" onPress={() => router.push(`/edit/${soldador.idSoldador}`)} >
                                    Editar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}