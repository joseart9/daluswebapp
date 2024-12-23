"use client";

// Custom Imports
import DatosGeneralesForm from "./DatosGeneralesForm";
import TelefonoForm from "./TelefonoForm";
import DireccionForm from "./DireccionForm";
import AwsForm from "./CredencialesForm/AwsForm";
import IpcForm from "./CredencialesForm/IpcForm";
import CustomForm from "./CredencialesForm/CustomForm";

import { Button, Divider, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function FormSectionComponent({ loading, control, handleSubmit, watch, setValue, reset, onSubmit }: any) {

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
            {/* Subcomponentes del formulario */}
            <div className="flex flex-col gap-8 container mx-auto px-2">
                <DatosGeneralesForm control={control} />
                <TelefonoForm control={control} watch={watch} />
                <DireccionForm control={control} />
                <AwsForm control={control} setValue={setValue} watch={watch} />
                <Divider />
                <IpcForm control={control} setValue={setValue} watch={watch} />
                <Divider />
                <CustomForm control={control} setValue={setValue} watch={watch} />
            </div>


            {/* Botón de guardar */}
            <div className="flex w-full justify-end container mx-auto px-1 pb-4">
                <Button isLoading={loading} type="submit" className="text-white w-fit font-semibold" variant="solid" color="primary">
                    Guardar
                </Button>
            </div>
        </form>
    );
}
