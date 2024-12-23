import { Controller } from "react-hook-form";
import { Checkbox, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

export default function InfoGeneralForm({ control }: { control: any }) {
    return (
        <div className="flex flex-col gap-1">
            <h3 className="text-primary text-xl font-semibold">Información General</h3>
            <div className="flex flex-col gap-4 p-2">
                <div className="flex flex-row gap-2 w-full">
                    <Controller
                        name="primerNombre"
                        control={control}
                        render={({ field }) => (
                            <Input label="Primer Nombre" {...field} isRequired required />
                        )}
                    />
                    <Controller
                        name="segundoNombre"
                        control={control}
                        render={({ field }) => (
                            <Input label="Segundo Nombre" {...field} />
                        )}
                    />
                    <Controller
                        name="primerApellido"
                        control={control}
                        render={({ field }) => (
                            <Input label="Apellido Paterno" {...field} isRequired required />
                        )}
                    />
                    <Controller
                        name="segundoApellido"
                        control={control}
                        render={({ field }) => (
                            <Input label="Apellido Materno" {...field} isRequired required />
                        )}
                    />
                </div>

                <div className="flex flex-row w-full gap-2">
                    <Controller
                        name="correo"
                        control={control}
                        render={({ field }) => (
                            <Input label="Correo" {...field} isRequired required />
                        )}
                    />
                    <Controller
                        name="empresaActual"
                        control={control}
                        render={({ field }) => (
                            <Input label="Empresa Actual" {...field} />
                        )}
                    />
                </div>

            </div>
        </div>
    );
}
