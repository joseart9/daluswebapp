import { Key, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Input, Select, SelectItem, Button, Card, CardBody, CardHeader } from "@nextui-org/react";

import icons from "@/Icons";

export default function AwsForm({ control, setValue, watch }: { control: any; setValue: any; watch: any }) {
    const nombreCertificacionesIpc = [
        { key: "610", label: "610" },
        { key: "620", label: "620" },
        { key: "7711-21", label: "7711-21" },
        { key: "j-std001", label: "J-STD001" },
        { key: "600", label: "600" },
        { key: "esd", label: "ESD" },
    ];

    // Inicializa el valor de certificaciones si está vacío
    useEffect(() => {
        const currentCerts = watch("credenciales.ipc.certificaciones") || [];
        if (currentCerts.length === 0) {
            setValue("credenciales.ipc.certificaciones", []);
        }
    }, [watch, setValue]);

    // Obtén certificaciones directamente desde `watch`
    const certificaciones = watch("credenciales.ipc.certificaciones") || [];

    // Agregar una nueva certificación
    function handleAddNewCert() {
        const updatedCerts = [
            ...certificaciones,
            { name: "", idCertificado: "", idEndorsement: "" },
        ];
        setValue("credenciales.ipc.certificaciones", updatedCerts);
    }

    // Manejar cambios en una certificación
    function handleCertChange(index: number, field: keyof IpcCertificaciones, value: string) {
        const updatedCerts = [...certificaciones];
        updatedCerts[index][field] = value;
        setValue("credenciales.ipc.certificaciones", updatedCerts);
    }

    // Manejar eliminación de una certificación
    function handleDeleteCert(index: number): void {
        const updatedCerts = certificaciones.filter((_: any, i: number) => i !== index);
        setValue("credenciales.ipc.certificaciones", updatedCerts);
    }

    return (
        <div className="flex flex-col gap-1">
            <h3 className="text-primary text-xl font-semibold">IPC</h3>
            <div className="flex flex-col gap-4 p-2">
                <div className="flex flex-row gap-2 w-full">

                    {/* Fecha de Vencimiento */}
                    <Controller
                        name="credenciales.ipc.fechaVencimiento"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                label="Vencimiento"
                                {...field}
                                value={field.value?.toISOString().split("T")[0] || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? new Date(value) : null);
                                }}
                            />
                        )}
                    />
                </div>

                {/* Botón para agregar certificaciones */}
                <Button color="primary" variant="bordered" onPress={handleAddNewCert}>
                    Agregar Certificación IPC
                </Button>

                {/* Lista de certificaciones */}
                {certificaciones.map((cert: { name: any; idCertificado: any; level: any; }, index: Key | null | undefined) => (
                    <Card key={index} className="my-2 bg-white/70 shadow-sm shadow-primary/20">
                        <CardHeader>
                            <div className="flex flex-row w-full justify-between items-center">
                                <h4 className="text-primary/80 text-lg">Certificación IPC {(index as number) + 1}</h4>
                                <Button
                                    onPress={() => handleDeleteCert(index as number)}
                                    color="primary"
                                    variant="light"
                                    isIconOnly
                                >
                                    <icons.trashcan className="text-lg text-red-500" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="flex flex-row gap-2">
                                {/* Nombre de la Certificación */}
                                <Select
                                    label="Certificación"
                                    placeholder="Selecciona una certificación"
                                    selectedKeys={new Set([cert.name || ""])}
                                    onSelectionChange={(value) =>
                                        handleCertChange(index as number, "name", Array.from(value).join(""))
                                    }
                                    isRequired
                                    required
                                >
                                    {nombreCertificacionesIpc.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>

                                {/* ID de Certificación */}
                                <Input
                                    label="Número de Certificación"
                                    value={cert.idCertificado || ""}
                                    onChange={(e) => handleCertChange(index as number, "idCertificado", e.target.value)}
                                    isRequired
                                    required
                                />

                                {/* Endorsement */}
                                <Input
                                    label="Nivel"
                                    value={cert.level || ""}
                                    onChange={(e) => handleCertChange(index as number, "level", e.target.value)}
                                />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
