import { Key, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Input, Select, SelectItem, Button, Card, CardBody, CardHeader } from "@nextui-org/react";

import icons from "@/Icons";

export default function AwsForm({ control, setValue, watch }: { control: any; setValue: any; watch: any }) {
    const nombreCertificacionesAws = [
        { key: "cw", label: "CW" },
        { key: "cwe", label: "CWE" },
        { key: "cws", label: "CWS" },
        { key: "cawi", label: "CAWI" },
        { key: "cwi", label: "CWI" },
        { key: "scwi", label: "SCWI" },
        { key: "cweng", label: "CWEng" },
    ];

    // Inicializa el valor de certificaciones si está vacío
    useEffect(() => {
        const currentCerts = watch("credenciales.aws.certificaciones") || [];
        if (currentCerts.length === 0) {
            setValue("credenciales.aws.certificaciones", []);
        }
    }, [watch, setValue]);

    // Obtén certificaciones directamente desde `watch`
    const certificaciones = watch("credenciales.aws.certificaciones") || [];

    // Agregar una nueva certificación
    function handleAddNewCert() {
        const updatedCerts = [
            ...certificaciones,
            { name: "", idCertificado: "", idEndorsement: "" },
        ];
        setValue("credenciales.aws.certificaciones", updatedCerts);
    }

    // Manejar cambios en una certificación
    function handleCertChange(index: number, field: keyof AwsCertificaciones, value: string) {
        const updatedCerts = [...certificaciones];
        updatedCerts[index][field] = value;
        setValue("credenciales.aws.certificaciones", updatedCerts);
    }

    // Manejar eliminación de una certificación
    function handleDeleteCert(index: number): void {
        const updatedCerts = certificaciones.filter((_: any, i: number) => i !== index);
        setValue("credenciales.aws.certificaciones", updatedCerts);
    }

    return (
        <div className="flex flex-col gap-1">
            <h3 className="text-primary text-xl font-semibold">AWS</h3>
            <div className="flex flex-col gap-4 p-2">
                <div className="flex flex-row gap-2 w-full">
                    {/* ID del Soldador */}
                    <Controller
                        name="credenciales.aws.idSoldador"
                        control={control}
                        render={({ field }) => <Input label="Número de Soldador AWS" {...field} />}
                    />

                    {/* Fecha de Vencimiento */}
                    <Controller
                        name="credenciales.aws.fechaVencimiento"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                label="Vencimiento"
                                {...field}
                                value={field.value ? field.value.toISOString().split("T")[0] : ""}
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
                    Agregar Certificación AWS
                </Button>

                {/* Lista de certificaciones */}
                {certificaciones.map((cert: { name: any; idCertificado: any; idEndorsement: any; }, index: Key | null | undefined) => (
                    <Card key={index} className="my-2 bg-white/70 shadow-sm shadow-primary/20">
                        <CardHeader>
                            <div className="flex flex-row w-full justify-between items-center">
                                <h4 className="text-primary/80 text-lg">Certificación AWS {(index as number) + 1}</h4>
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
                                    {nombreCertificacionesAws.map((item) => (
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
                                    label="Endorsement"
                                    value={cert.idEndorsement || ""}
                                    onChange={(e) => handleCertChange(index as number, "idEndorsement", e.target.value)}
                                />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
