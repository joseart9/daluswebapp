"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { addSoldador } from "@/server/actions/soldador";
import { useRouter } from 'next/navigation'
import SoldadorFormData from "../components/SoldadorFormData";
import Soldador from "@/types/Soldador";
import { Button } from "@nextui-org/react";

export default function AddNewSoldador() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Soldador>({
        idSoldador: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        correo: "",
        empresaActual: "",
        telefono: {
            lada: "",
            numero: "",
        },
        direccion: {
            calle: "",
            numeroExterior: "",
            colonia: "",
            codigoPostal: "",
            ciudad: "",
            estado: "",
            pais: "",
        },
        credenciales: {
            aws: {
                idSoldador: "",
                certificaciones: [],
                fechaVencimiento: undefined,
                historialPago: {
                    archivoFactura: "",
                    fechaPago: undefined,
                    empleado: "",
                },
                active: false,
            },
            ipc: {
                certificaciones: [],
                fechaVencimiento: undefined,
                historialPago: {
                    archivoFactura: "",
                    fechaPago: undefined,
                    empleado: "",
                },
                active: false,
            },
            custom: {
                certificaciones: [],
                fechaVencimiento: undefined,
                active: false,
            }
        }
    });

    async function onSave() {
        setLoading(true);
        try {
            // Crear una copia de formData con el nuevo idSoldador
            const updatedFormData = {
                ...formData,
                idSoldador: crypto.randomUUID(),
            };

            // Enviar la copia actualizada a la base de datos
            const res = await addSoldador(updatedFormData);

            setLoading(false);
            router.push("/");
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }
    return (
        <main className="flex flex-col space-y-1 p-2 h-full w-full">
            <div className="flex flex-row w-full items-center">
                <Button isIconOnly onPress={() => router.push("/")} className="bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Button>
                <h1 className="flex flex-row w-full justify-center text-default-500 text-xl">Registrar Soldador</h1>
            </div>
            <SoldadorFormData formData={formData} setFormData={setFormData} />
            <section className="flex flex-row w-full justify-end px-4 pt-8 pb-2">
                <Button isLoading={loading} color="primary" className="uppercase" onPress={onSave} type="submit">
                    Guardar
                </Button>
            </section>
        </main>
    );
}
