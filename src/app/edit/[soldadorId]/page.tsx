"use client";
import FormSectionComponent from "@/app/components/FormSection/FormSectionComponent";
import FormSectionComponentMobile from "@/app/components/FormSectionMobile";
import Soldador from "@/types/Soldador";
import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import useScreenSize from "@/hooks/useScreenSize";

import { getSoldadorById, updateSoldador } from "@/server/actions/soldador";
import alert from "@/utils/Alert";
import { Button, Spinner } from "@nextui-org/react";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function EditSoldador({
    params,
}: {
    params: Promise<{ soldadorId: string }>;
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, watch, setValue, reset } = useForm<Soldador>({});
    const { soldadorId: soldadorId } = use(params);
    const [loadingData, setLoadingData] = useState(true);
    const screenSize = useScreenSize();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSoldadorById(soldadorId);
            if (data) {
                reset(data);
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await updateSoldador(data);
            alert("Soldador actualizado correctamente", "success");
            router.push("/");
        } catch (error) {
            console.error("Error al actualizar el soldador:", error);
            alert("Error al actualizar el soldador, contacte con un administrador", "error");
        } finally {
            setLoading(false);
        }
    }

    if (loadingData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-semibold text-primary/50">Cargando información...</h1>
                    <div className="flex gap-2">
                        <Spinner color="primary" />
                    </div>
                </div>
            </div>
        )
    }


    if (screenSize === "desktop") {
        return (
            <>
                <div>
                    <div className="flex flex-row w-full items-center mb-4">
                        <Button disableRipple isIconOnly onPress={() => router.push("/")} className="bg-transparent">
                            <IoMdArrowRoundBack className="size-6 text-default-500" />
                        </Button>
                        <h1 className="flex flex-row w-full justify-start text-default-500 font-semibold text-xl mb-[2px]">Editar Soldador</h1>
                    </div>
                    <FormSectionComponent loading={loading} onSubmit={onSubmit} control={control} watch={watch} handleSubmit={handleSubmit} setValue={setValue} />
                </div>
            </>
        )
    }

    if (screenSize === "mobile" || screenSize === "tablet") {
        return (
            <>
                <div>
                    <div className="flex flex-row w-full items-center mb-4">
                        <Button disableRipple isIconOnly onPress={() => router.push("/")} className="bg-transparent">
                            <IoMdArrowRoundBack className="size-6 text-default-500" />
                        </Button>
                        <h1 className="flex flex-row w-full justify-start text-default-500 font-semibold text-xl mb-[2px]">Editar Soldador</h1>
                    </div>
                    <FormSectionComponentMobile loading={loading} onSubmit={onSubmit} control={control} watch={watch} handleSubmit={handleSubmit} setValue={setValue} />
                </div>
            </>
        )
    }
}
