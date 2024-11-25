import Soldador from "@/types/Soldador";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Tooltip } from "@nextui-org/react";
import { useRouter } from 'next/navigation'

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
                                        <div className="flex flex-col gap-1">
                                            <span className="text-default-200">Datos Personales</span>
                                            <section className="flex flex-col gap-2 px-2 text-default-700">
                                                <p>
                                                    {soldador.primerNombre} {soldador.segundoNombre} {soldador.primerApellido} {soldador.segundoApellido}
                                                </p>
                                                <p>
                                                    {soldador.empresaActual}
                                                </p>
                                                <p>
                                                    <a href={`mailto:${soldador.correo}`} style={{ color: 'blue' }}>
                                                        {soldador.correo}
                                                    </a>
                                                </p>
                                                <p>
                                                    <a href={`tel:+${soldador.telefono?.lada}${soldador.telefono?.numero}`} style={{ color: 'blue' }}>
                                                        +{soldador.telefono?.lada} {soldador.telefono?.numero}
                                                    </a>
                                                </p>
                                            </section>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <span className="text-default-200">Direccion</span>
                                            <section className="flex flex-col gap-2 px-2 text-default-700">
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


                                        <div className="flex flex-col gap-1">
                                            <span className="text-default-200">Credenciales</span>
                                            <section className="flex flex-col gap-3 px-2">
                                                {soldador.credenciales?.aws && soldador.credenciales?.aws?.certificaciones && soldador.credenciales.aws.certificaciones.length > 0 && (
                                                    <section className="flex flex-col gap-3 px-2 text-default-500">
                                                        <section className="flex flex-col gap-4">
                                                            <div className="flex flex-row text-center justify-center text-default-400 items-center">
                                                                <span className="flex text-center justify-center text-default-600 font-semibold"> AWS |  </span>
                                                                <p className="capitalize">
                                                                    &nbsp; {soldador.credenciales?.aws?.fechaVencimiento?.toLocaleDateString("es-ES", opciones)} &nbsp;
                                                                </p>
                                                                <Tooltip color="primary" showArrow content="Fecha de Vencimiento">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                                    </svg>
                                                                </Tooltip>
                                                            </div>
                                                            <div className="flex flex-row items-center gap-1">
                                                                <Tooltip color="primary" showArrow content="Numero de Soldador">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                                                                    </svg>

                                                                </Tooltip>
                                                                {soldador.credenciales?.aws?.idSoldador}
                                                            </div>
                                                        </section>
                                                        {soldador.credenciales?.aws?.certificaciones?.map((cert, index) => (
                                                            <div key={index} className={`border-l-4 ${soldador.credenciales?.aws?.active ? "border-green-500" : "border-red-500"} text-default-700 flex flex-col gap-2 rounded-lg bg-slate-100 shadow-md p-2`}>
                                                                <p className="uppercase">
                                                                    {cert.name}
                                                                </p>
                                                                <p className="text-default-400 text-sm">
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
                                                                <Tooltip color="primary" showArrow content="Fecha de Vencimiento">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                                    </svg>
                                                                </Tooltip>
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
                                                                <Tooltip color="primary" showArrow content="Fecha de Vencimiento">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                                    </svg>
                                                                </Tooltip>
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
                                <Button color="primary" className="uppercase" onPress={() => router.push(`/edit/${soldador.idSoldador}`)} >
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