"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { addSoldador } from "@/server/actions/soldador";
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import SoldadorFormData from "../components/SoldadorFormData";
import Soldador from "@/types/Soldador";
import { Button } from "@nextui-org/react";
import FormSectionComponent from "../components/FormSection/FormSectionComponent";
import FormSectionComponentMobile from "../components/FormSectionMobile";
import { useForm } from "react-hook-form";
import defaultValues from "@/app/components/FormSection/defaultValues";
import alert from "@/utils/Alert";
import useScreenSize from "@/hooks/useScreenSize";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function AddNewSoldador() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, watch, setValue, reset } = useForm<Soldador>({ defaultValues });
    const screenSize = useScreenSize();

    // useEffect(() => {
    //     reset(data);
    // }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);

        // Verificar y agregar `idSoldador` si no existe
        const dataToSubmit = {
            ...data,
            idSoldador: data.idSoldador || uuidv4(),
        };

        console.log("Formulario enviado", dataToSubmit);

        try {
            await addSoldador(dataToSubmit);
            alert("Soldador agregado correctamente", "success");
            reset();
        } catch (error) {
            console.error("Error al agregar el soldador:", error);
            alert("Error al agregar el soldador, contacte con un administrador", "error");
        } finally {
            setLoading(false);
        }
    };

    if (screenSize === "desktop") {
        return (
            <main className="flex flex-col space-y-1 p-2 h-full w-full">
                <FormSectionComponent loading={loading} onSubmit={onSubmit} reset={reset} control={control} handleSubmit={handleSubmit} setValue={setValue} watch={watch} />
            </main>
        );
    } else {
        return (
            <main className="flex flex-col space-y-1 p-2 h-full w-full">
                <div className="flex flex-row w-full items-center mb-4">
                    <Button disableRipple isIconOnly onPress={() => router.push("/")} className="bg-transparent">
                        <IoMdArrowRoundBack className="size-6 text-default-500" />
                    </Button>
                    <h1 className="flex flex-row w-full justify-start text-default-500 font-semibold text-xl mb-[2px]">Agregar Soldador</h1>
                </div>
                <FormSectionComponentMobile loading={loading} onSubmit={onSubmit} reset={reset} control={control} handleSubmit={handleSubmit} setValue={setValue} watch={watch} />
            </main>
        );
    }
}
