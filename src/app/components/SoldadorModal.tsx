"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    SelectItem,
    Divider,
} from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { Select } from "@nextui-org/select";
import { addSoldador } from "@/server/actions/soldador";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase/firestore";

export default function SoldadorModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const modalBodyRef = useRef<HTMLDivElement>(null);

    const certificaciones = [
        { key: "aws", label: "AWS" },
        { key: "ipc", label: "IPC" },
        { key: "custom", label: "Custom" },
    ];

    // Estados para las certificaciones dinámicas
    const [awsCertificaciones, setAwsCertificaciones] = useState<{ id: number }[]>([]);
    const [ipcCertificaciones, setIpcCertificaciones] = useState<{ id: number }[]>([]);
    const [customCertificaciones, setCustomCertificaciones] = useState<{ id: number }[]>([]);

    // Funciones para agregar y eliminar certificaciones dinámicamente
    const addCertificacion = (type: string) => {
        if (type === "aws") setAwsCertificaciones([...awsCertificaciones, { id: Date.now() }]);
        if (type === "ipc") setIpcCertificaciones([...ipcCertificaciones, { id: Date.now() }]);
        if (type === "custom") setCustomCertificaciones([...customCertificaciones, { id: Date.now() }]);
    };

    const removeCertificacion = (type: string, id: number) => {
        if (type === "aws") setAwsCertificaciones(awsCertificaciones.filter((c) => c.id !== id));
        if (type === "ipc") setIpcCertificaciones(ipcCertificaciones.filter((c) => c.id !== id));
        if (type === "custom") setCustomCertificaciones(customCertificaciones.filter((c) => c.id !== id));
    };

    // Desplazamiento suave al hacer foco en un input
    useEffect(() => {
        if (isOpen && modalBodyRef.current) {
            const inputs = modalBodyRef.current.querySelectorAll("input, textarea, select");

            inputs.forEach((input) => {
                input.addEventListener("focus", () => {
                    // Espera a que el teclado se abra y centra el input en pantalla
                    setTimeout(() => {
                        input.scrollIntoView({
                            behavior: "auto",
                            block: "center",
                            inline: "center",

                        });
                    }, 100);
                });
            });

            // Limpia los listeners al cerrar el modal
            return () => {
                inputs.forEach((input) => input.removeEventListener("focus", () => { }));
            };
        }
    }, [isOpen]);

    async function onSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData.entries());

        const soldadorData = {
            idSoldador: crypto.randomUUID(),
            primerNombre: formEntries.primerNombre as string,
            segundoNombre: formEntries.segundoNombre as string,
            primerApellido: formEntries.primerApellido as string,
            segundoApellido: formEntries.segundoApellido as string,
            correo: formEntries.correo as string,
            empresaActual: formEntries.empresaActual as string,
            telefono: {
                lada: formEntries.lada as string,
                numero: formEntries.numero as string,
            },
            direccion: {
                calle: formEntries.calle as string,
                numeroExterior: formEntries.numeroExterior as string,
                colonia: formEntries.colonia as string,
                codigoPostal: formEntries.codigoPostal as string,
            },
            credenciales: {
                aws: {
                    idSoldador: formEntries.awsIdSoldador as string,
                    certificaciones: awsCertificaciones.map((_, index) => ({
                        name: formEntries[`awsCertificacionName-${index}`] as string,
                        idCertificado: formEntries[`awsIdCertificado-${index}`] as string,
                        idEndorsement: formEntries[`awsIdEndorsement-${index}`] as string,
                    })),
                    fechaVencimiento: formEntries.awsFechaVencimiento
                        ? new Date(formEntries.awsFechaVencimiento as string)
                        : undefined,
                    historialPago: {
                        archivoFactura: formEntries.awsArchivoFactura as string,
                        fechaPago: formEntries.awsFechaPago
                            ? new Date(formEntries.awsFechaPago as string)
                            : undefined,
                        empleado: formEntries.awsEmpleado as string,
                    },
                    active: formEntries.awsActive === "true",
                },
                ipc: {
                    certificaciones: ipcCertificaciones.map((_, index) => ({
                        name: formEntries[`ipcCertificacionName-${index}`] as string,
                        idCertificado: formEntries[`ipcIdCertificado-${index}`] as string,
                        level: formEntries[`ipcLevel-${index}`] as string,
                    })),
                    fechaVencimiento: formEntries.ipcFechaVencimiento
                        ? new Date(formEntries.ipcFechaVencimiento as string)
                        : undefined,
                    historialPago: {
                        archivoFactura: formEntries.ipcArchivoFactura as string,
                        fechaPago: formEntries.ipcFechaPago
                            ? new Date(formEntries.ipcFechaPago as string)
                            : undefined,
                        empleado: formEntries.ipcEmpleado as string,
                    },
                    active: formEntries.ipcActive === "true",
                },
                custom: {
                    certificaciones: customCertificaciones.map((_, index) => ({
                        name: formEntries[`customCertificacionName-${index}`] as string,
                        idCertificado: formEntries[`customIdCertificado-${index}`] as string,
                    })),
                    fechaVencimiento: formEntries.customFechaVencimiento
                        ? new Date(formEntries.customFechaVencimiento as string)
                        : undefined,
                    active: formEntries.customActive === "true",
                }
            }
        };

        console.log("Formatted Soldador Data:", soldadorData);

        const res = await addSoldador(soldadorData);

        console.log("Response:", res);

        onClose();

        // revalidatePath("/")
    }

    return (
        <Modal
            aria-modal="true"
            role="dialog"
            isOpen={isOpen}
            placement="bottom-center"
            onOpenChange={onClose}
            scrollBehavior="inside"
            isDismissable={false}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">Registrar Soldador</ModalHeader>
                    <ModalBody >
                        <div ref={modalBodyRef}>
                            <form onSubmit={onSave} className="flex flex-col space-y-2">
                                {/* Datos personales */}
                                <h1 className="text-gray-400">Datos Personales</h1>
                                <section className="flex flex-col space-y-2">
                                    <Input variant="bordered" type="text" name="primerNombre" label="Primer Nombre" size="lg" required />
                                    <Input variant="bordered" type="text" name="segundoNombre" label="Segundo Nombre" size="lg" />
                                    <Input variant="bordered" type="text" name="primerApellido" label="Apellido Paterno" size="lg" />
                                    <Input variant="bordered" type="text" name="segundoApellido" label="Apellido Materno" size="lg" />
                                    <Input variant="bordered" type="email" name="correo" label="Correo" size="lg" />
                                    <Input variant="bordered" type="text" name="empresaActual" label="Empresa Actual" size="lg" />
                                </section>

                                {/* Teléfono */}
                                <h1 className="text-gray-400">Telefono</h1>
                                <section className="flex flex-col space-y-3">
                                    <div className="flex flex-row space-x-2">
                                        <Input
                                            type="tel"
                                            name="lada"
                                            label="Lada"
                                            defaultValue="52"
                                            className="w-fit"
                                            size="lg"
                                            variant="bordered"
                                            startContent={<p>+</p>}
                                        />
                                        <Input variant="bordered" type="tel" name="numero" label="Numero" size="lg" />
                                    </div>
                                </section>

                                {/* Certificaciones */}
                                <h1 className="text-gray-400">Certificaciones</h1>
                                <section className="flex flex-col space-y-3">
                                    <h1 className="flex text-lg font-bold w-full items-center justify-center text-gray-600">
                                        AWS
                                    </h1>
                                    <Input variant="bordered" type="text" name="awsIdSoldador" label="Numero Soldador" size="lg" />
                                    {awsCertificaciones.map((cert, index) => (
                                        <div key={cert.id} className="space-y-2 border p-2 rounded-lg">
                                            <div className="flex flex-row items-center justify-between">
                                                <h2>Certificación {index + 1}</h2>
                                                <Button className="bg-transparent" isIconOnly radius="full" size="sm" color="default" onPress={() => removeCertificacion("aws", cert.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-700">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Button>
                                            </div>

                                            <Input variant="bordered" type="text" name={`awsCertificacionName-${index}`} label="Nombre Certificación AWS" size="lg" />
                                            <Input variant="bordered" type="text" name={`awsIdCertificado-${index}`} label="Numero Certificado" size="lg" />
                                            <Input variant="bordered" type="text" name={`awsIdEndorsement-${index}`} label="Numero Endorsement" size="lg" />

                                        </div>
                                    ))}
                                    <Input variant="bordered" type="date" name="awsFechaVencimiento" label="Vencimiento" size="lg" />
                                    <Button color="primary" onPress={() => addCertificacion("aws")}>Agregar Certificación AWS</Button>

                                    <Divider />

                                    <h1 className="flex text-lg font-bold w-full items-center justify-center text-gray-600">
                                        IPC
                                    </h1>
                                    {ipcCertificaciones.map((cert, index) => (
                                        <div key={cert.id} className="space-y-2 border p-2 rounded-lg">
                                            <div className="flex flex-row items-center justify-between">
                                                <h2>Certificación {index + 1}</h2>
                                                <Button className="bg-transparent" isIconOnly radius="full" size="sm" color="default" onPress={() => removeCertificacion("ipc", cert.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-700">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Button>
                                            </div>
                                            <Input variant="bordered" type="text" name={`ipcCertificacionName-${index}`} label="Nombre Certificación IPC" size="lg" />
                                            <Input variant="bordered" type="text" name={`ipcIdCertificado-${index}`} label="Numero Certificado" size="lg" />
                                            <Input variant="bordered" type="text" name={`ipcLevel-${index}`} label="Nivel Certificado" size="lg" />
                                        </div>
                                    ))}
                                    <Input variant="bordered" type="date" name="ipcFechaVencimiento" label="Vencimiento" size="lg" />
                                    <Button color="primary" onPress={() => addCertificacion("ipc")}>Agregar Certificación IPC</Button>

                                    <Divider />

                                    <h1 className="flex w-full text-lg font-bold items-center justify-center text-gray-600">
                                        Custom
                                    </h1>
                                    {customCertificaciones.map((cert, index) => (
                                        <div key={cert.id} className="space-y-2 border p-2 rounded-lg">
                                            <div className="flex flex-row items-center justify-between">
                                                <h2>Certificación {index + 1}</h2>
                                                <Button className="bg-transparent" isIconOnly radius="full" size="sm" color="default" onPress={() => removeCertificacion("custom", cert.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-700">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Button>
                                            </div>
                                            <Input variant="bordered" type="text" name={`customCertificacionName-${index}`} label="Nombre Certificación Personalizada" size="lg" />
                                            <Input variant="bordered" type="text" name={`customIdCertificado-${index}`} label="Numero Certificación" size="lg" />
                                        </div>
                                    ))}
                                    <Input variant="bordered" type="date" name="customFechaVencimiento" label="Vencimiento" size="lg" />
                                    <Button color="primary" onPress={() => addCertificacion("custom")}>Agregar Certificación Custom</Button>
                                </section>

                                {/* Dirección */}
                                <h1 className="text-gray-400">Direccion</h1>
                                <section className="flex flex-col space-y-3">
                                    <Input variant="bordered" type="text" name="calle" label="Calle" size="lg" />
                                    <Input variant="bordered" type="text" name="numeroExterior" label="Numero Exterior" size="lg" />
                                    <Input variant="bordered" type="text" name="colonia" label="Colonia" size="lg" />
                                    <Input variant="bordered" type="text" name="codigoPostal" label="Codigo Postal" size="lg" />
                                </section>

                                <ModalFooter>
                                    <Button color="default" variant="flat" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button color="primary" type="submit">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </div>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
}
