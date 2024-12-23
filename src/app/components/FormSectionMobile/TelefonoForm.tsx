import { useState } from "react";
import { Controller } from "react-hook-form";
import { Checkbox, Input, Select, SelectItem } from "@nextui-org/react";

export default function TelefonoForm({ control, watch }: { control: any; watch: any }) {
    const tipoTelefono = ["Casa", "Celular", "Oficina"];

    return (
        <div className="flex flex-col gap-1">
            <h3 className="text-primary text-xl font-semibold">Teléfono</h3>
            <div className="flex flex-col gap-4 p-2">

                <div className="grid grid-cols-12 gap-2">
                    <Controller
                        name="telefono.lada"
                        control={control}
                        defaultValue="52"
                        render={({ field }) => (
                            <Input
                                label="Lada"
                                startContent={"+"}
                                {...field}
                                className="col-span-4"
                            />
                        )}
                    />

                    <Controller
                        name="telefono.numero"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="Número de Teléfono"
                                {...field}
                                isRequired
                                required
                                className="col-span-8"
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-12 gap-2">
                    <Controller
                        name="telefono.tipo"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Tipo de Teléfono"
                                {...field}
                                isRequired
                                className="col-span-6"
                                required
                                selectedKeys={[field.value]}
                                onSelectionChange={(value) => field.onChange(value)}
                            >
                                {tipoTelefono.map((tipo) => (
                                    <SelectItem key={tipo} value={tipo}>
                                        {tipo}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                    />
                    {watch("telefono.tipo") === "Oficina" && (
                        <Controller
                            name="telefono.extension"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    label="Extensión"
                                    className="col-span-6"
                                    {...field} />

                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
