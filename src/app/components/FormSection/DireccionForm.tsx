import { Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";

export default function DireccionForm({ control }: { control: any }) {
    return (
        <div className="flex flex-col gap-1">
            <h3 className="text-primary text-xl font-semibold">Dirección</h3>
            <div className="flex flex-col gap-4 p-2">
                <Controller
                    name="direccion.calle"
                    control={control}
                    render={({ field }) => <Input label="Calle" {...field} isRequired required />}
                />
                <div className="flex flex-row gap-2">
                    <Controller
                        name="direccion.numeroExterior"
                        control={control}
                        render={({ field }) => <Input label="Número Exterior" {...field} isRequired required
                            type="number" />}
                    />
                    <Controller
                        name="direccion.numeroInterior"
                        control={control}
                        render={({ field }) => <Input label="Número Interior" {...field}
                            type="number" />}
                    />
                </div>

                <Controller
                    name="direccion.colonia"
                    control={control}
                    render={({ field }) => <Input label="Colonia" isRequired required {...field} />}
                />
                <div className="flex flex-row gap-2">
                    <Controller
                        name="direccion.ciudad"
                        control={control}
                        render={({ field }) => <Input label="Ciudad" isRequired required {...field} />}
                    />
                    <Controller
                        name="direccion.estado"
                        control={control}
                        render={({ field }) => <Input label="Estado" isRequired required {...field} />}
                    />
                </div>

                <div className="grid grid-cols-3 w-full gap-2">
                    <Controller
                        name="direccion.pais"
                        control={control}
                        render={({ field }) => <Input label="País" isRequired required className="col-span-2" {...field} />}
                    />
                    <Controller
                        name="direccion.codigoPostal"
                        control={control}
                        render={({ field }) => <Input label="Código Postal" isRequired required {...field} />}
                    />
                </div>
            </div>
        </div>
    );
}
