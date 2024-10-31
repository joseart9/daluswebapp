"use client";

import React, { FormEvent, useEffect, useRef } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { addSoldador } from "@/server/actions/soldador";

export default function SoldadorModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const modalBodyRef = useRef<HTMLDivElement>(null);

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
            idSoldador: formEntries.idSoldador as string,
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
        };

        console.log("Formatted Soldador Data:", soldadorData);

        const res = await addSoldador(soldadorData);

        console.log("Response:", res);

        onClose();
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
                                <h1 className="text-gray-400">Datos Personales</h1>
                                <section className="flex flex-col space-y-2">
                                    <Input variant="bordered" type="text" name="idSoldador" label="Identificador" size="lg" isRequired required />
                                    <Input variant="bordered" type="text" name="primerNombre" label="Primer Nombre" size="lg" isRequired required />
                                    <Input variant="bordered" type="text" name="segundoNombre" label="Segundo Nombre" size="lg" />
                                    <Input variant="bordered" type="text" name="primerApellido" label="Apellido Paterno" size="lg" />
                                    <Input variant="bordered" type="text" name="segundoApellido" label="Apellido Materno" size="lg" />
                                    <Input variant="bordered" type="email" name="correo" label="Correo" size="lg" />
                                    <Input variant="bordered" type="text" name="empresaActual" label="Empresa Actual" size="lg" />
                                </section>
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
                                <h1 className="text-gray-400">Certificaciones</h1>
                                <section className="flex flex-col space-y-3">
                                    <Input variant="bordered" type="text" name="calle" label="Calle" size="lg" />
                                    <Input variant="bordered" type="text" name="numeroExterior" label="Numero Exterior" size="lg" />
                                    <Input variant="bordered" type="text" name="colonia" label="Colonia" size="lg" />
                                    <Input variant="bordered" type="text" name="codigoPostal" label="Codigo Postal" size="lg" />
                                </section>
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
