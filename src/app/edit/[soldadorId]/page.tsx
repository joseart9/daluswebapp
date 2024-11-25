"use client";

import { useEffect, useState, use } from "react";
import {
    Button,
    CircularProgress,
} from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { getSoldadorById, updateSoldador } from "@/server/actions/soldador";
import Soldador from "@/types/Soldador";
import SoldadorFormData from "@/app/components/SoldadorFormData";

export default function EditSoldador({
    params,
}: {
    params: Promise<{ soldadorId: string }>;
}) {
    const router = useRouter()
    const { soldadorId: soldadorId } = use(params);
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [formData, setFormData] = useState<Soldador>(
        {
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
        }
    );

    useEffect(() => {
        setLoading(true)
        async function fetchSoldador() {
            const res = await getSoldadorById(soldadorId)
            if (res) {
                setFormData(res);
            } else {
                setLoading(false);
            }
            setLoading(false)
        }
        fetchSoldador()
    }, [])

    const handleUpdateSoldador = async () => {
        setLoadingUpdate(true)
        try {
            await updateSoldador(formData)
            setLoadingUpdate(false)
            router.push("/")
        } catch (error) {
            console.error(error)
            setLoadingUpdate(false)
        }
    }

    if (!formData) return (
        <main className="flex h-screen w-screen items-center justify-center">
            <CircularProgress color="primary" />
        </main>
    );



    if (loading) return (
        <main className="flex h-screen w-screen items-center justify-center">
            <CircularProgress color="primary" />
        </main>
    );


    return (
        <div className="flex w-full flex-col">
            <div className="flex flex-row w-full items-center">
                <Button isIconOnly onPress={() => router.push("/")} className="bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Button>
                <h1 className="flex flex-row w-full justify-center text-default-500 text-xl">Editar Soldador</h1>
            </div>
            {formData && <SoldadorFormData formData={formData} setFormData={setFormData} />}
            <section className="flex flex-row w-full justify-end px-4 pt-4 pb-4">
                <Button isLoading={loadingUpdate} color="primary" className="uppercase" onPress={handleUpdateSoldador} type="submit">
                    Guardar
                </Button>
            </section>
        </div>
    )
}
