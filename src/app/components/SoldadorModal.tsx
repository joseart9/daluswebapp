import React from "react";
import { FormEvent } from "react";
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

export default function SoldadorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {

    async function onSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData.entries());

        // Reorganizar los datos para que coincidan con la estructura de Soldador
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
        <Modal aria-modal="true" role="dialog" isOpen={isOpen} placement="bottom-center" onOpenChange={onClose} scrollBehavior="inside" isDismissable={false}>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">Registrar Soldador</ModalHeader>
                    <ModalBody>
                        <form onSubmit={onSave} className="flex flex-col space-y-2">
                            <h1 className="text-gray-400">
                                Datos Personales
                            </h1>
                            <section className="flex flex-col space-y-2">
                                <Input type="text" name="idSoldador" label="Identificador" size="sm" isRequired required />
                                <Input type="text" name="primerNombre" label="Primer Nombre" size="sm" isRequired required />
                                <Input type="text" name="segundoNombre" label="Segundo Nombre" size="sm" />
                                <Input type="text" name="primerApellido" label="Apellido Paterno" size="sm" />
                                <Input type="text" name="segundoApellido" label="Apellido Materno" size="sm" />
                                <Input type="email" name="correo" label="Correo" size="sm" />
                                <Input type="text" name="empresaActual" label="Empresa Actual" size="sm" />
                            </section>
                            <h1 className="text-gray-400">
                                Telefono
                            </h1>
                            <section className="flex flex-col space-y-3">
                                <div className="flex flex-row space-x-2">
                                    <Input type="tel" name="lada" label="Lada" defaultValue="52" className="w-fit" size="sm" startContent={
                                        <p>
                                            +
                                        </p>
                                    } />
                                    <Input type="tel" name="numero" label="Numero" size="sm" />
                                </div>
                            </section>
                            <h1 className="text-gray-400">
                                Direccion
                            </h1>
                            <section className="flex flex-col space-y-3">
                                <Input type="text" name="calle" label="Calle" size="sm" />
                                <Input type="text" name="numeroExterior" label="Numero Exterior" size="sm" />
                                <Input type="text" name="colonia" label="Colonia" size="sm" />
                                <Input type="text" name="codigoPostal" label="Codigo Postal" size="sm" />
                            </section>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" type="submit">
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
}
