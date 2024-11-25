"use client";

import Soldador from "@/types/Soldador";
import { Button, DateInput, DatePicker, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { use, useEffect, useState } from "react";
import { getSoldadorById } from "@/server/actions/soldador";
import { DateValue, parseDate, getLocalTimeZone } from "@internationalized/date";

export default function SoldadorFormData({
    formData,
    setFormData
}: {
    formData: Soldador | null;
    setFormData: React.Dispatch<React.SetStateAction<Soldador>>;

}) {
    const nombreCertificacionesAws = [
        { key: "cw", label: "CW" },
        { key: "cwe", label: "CWE" },
        { key: "cws", label: "CWS" },
        { key: "cawi", label: "CAWI" },
        { key: "cwi", label: "CWI" },
        { key: "scwi", label: "SCWI" },
        { key: "cweng", label: "CWEng" },
    ];

    const nombreCertificacionesIpc = [
        { key: "610", label: "610" },
        { key: "620", label: "620" },
        { key: "7711-21", label: "7711-21" },
        { key: "j-std001", label: "J-STD001" },
        { key: "600", label: "600" },
        { key: "esd", label: "ESD" },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: Soldador) => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: value || "",
            };
        });
    };

    const handleNestedInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof Soldador
    ) => {
        const { name, value } = e.target;
        setFormData((prev: Soldador) => {
            if (!prev) return prev;
            return {
                ...prev,
                [section]: {
                    ...(prev[section] as object),
                    [name]: value,
                },
            };
        });
    };

    const handleCredentialChange = (
        type: keyof Soldador["credenciales"],
        index: number,
        field: "name" | "idCertificado" | "idEndorsement" | "level",
        value: string
    ) => {
        setFormData((prev: Soldador) => {
            if (!prev) return prev;
            const updatedCredenciales = { ...prev.credenciales };
            const certificaciones = (updatedCredenciales[type] as { certificaciones: any[] }).certificaciones || [];
            certificaciones[index] = {
                ...certificaciones[index],
                [field]: value,
            };
            (updatedCredenciales[type] as { certificaciones: any[] }).certificaciones = certificaciones;
            return {
                ...prev,
                credenciales: updatedCredenciales,
            };
        });
    };

    const addCertificacion = (type: keyof Soldador["credenciales"]) => {
        setFormData((prev: Soldador) => {
            if (!prev || !prev.credenciales) return prev;

            // Define la nueva certificación basada en el tipo
            let newCertificacion;
            if (type === "aws") {
                newCertificacion = { name: "", idCertificado: "", idEndorsement: "" };
            } else if (type === "ipc") {
                newCertificacion = { name: "", idCertificado: "", level: "" };
            } else if (type === "custom") {
                newCertificacion = { name: "", idCertificado: "" };
            } else {
                return prev; // Si el tipo no es válido, no hace nada
            }

            return {
                ...prev,
                credenciales: {
                    ...prev.credenciales,
                    [type]: {
                        ...(typeof prev.credenciales[type as keyof Soldador["credenciales"]] === 'object'
                            ? prev.credenciales[type as keyof Soldador["credenciales"]]
                            : {}),
                        certificaciones: [
                            ...((prev.credenciales[type as keyof Soldador["credenciales"]] as { certificaciones: any[] })?.certificaciones || []),
                            newCertificacion,
                        ],
                    },
                },
            };
        });
    };

    const onSave = (e: any) => {
        e.preventDefault();
        console.log("Nuevo objeto formData:", formData);
    };

    const removeCertificacion = (type: string, index: number) => {
        setFormData((prev: Soldador) => {
            if (!prev || !prev.credenciales) return prev;

            const updatedCredenciales = { ...prev.credenciales };
            const certificaciones = (updatedCredenciales[type as keyof Soldador["credenciales"]] as { certificaciones: any[] }).certificaciones || [];

            // Remove the certification at the specified index
            certificaciones.splice(index, 1);

            (updatedCredenciales[type as keyof Soldador["credenciales"]] as { certificaciones: any[] }).certificaciones = certificaciones;

            return {
                ...prev,
                credenciales: updatedCredenciales,
            };
        });
    };

    console.log(formData?.credenciales);

    return (
        <section className="p-4">
            <form onSubmit={onSave} className="flex flex-col space-y-8">
                {/* Datos personales */}
                <section className="flex flex-col space-y-2">
                    <h1 className="text-gray-400">Datos Personales</h1>
                    <section className="flex flex-col space-y-4">
                        <Input
                            value={formData?.primerNombre || ""}
                            onChange={handleInputChange}
                            variant="bordered"
                            type="text"
                            name="primerNombre"
                            label="Primer Nombre"
                            size="lg"
                            required
                        />
                        <Input
                            value={formData?.segundoNombre || ""}
                            onChange={handleInputChange}
                            variant="bordered"
                            type="text"
                            name="segundoNombre"
                            label="Segundo Nombre"
                            size="lg"
                        />
                        <Input
                            value={formData?.primerApellido || ""}
                            onChange={handleInputChange}
                            variant="bordered"
                            type="text"
                            name="primerApellido"
                            label="Apellido Paterno"
                            size="lg"
                        />
                        <Input
                            value={formData?.segundoApellido || ""}
                            onChange={handleInputChange}
                            variant="bordered"
                            type="text"
                            name="segundoApellido"
                            label="Apellido Materno"
                            size="lg"
                        />
                        <Input
                            value={formData?.correo || ""}
                            onChange={handleInputChange}
                            variant="bordered"
                            type="email"
                            name="correo"
                            label="Correo"
                            size="lg"
                        />
                        <Input
                            value={formData?.empresaActual || ""}
                            onChange={handleInputChange}
                            variant="bordered"
                            type="text"
                            name="empresaActual"
                            label="Empresa Actual"
                            size="lg"
                        />
                    </section>
                </section>

                {/* Teléfono */}
                <section className="flex flex-col space-y-2">
                    <h1 className="text-gray-400">Teléfono</h1>
                    <section className="flex flex-row space-x-2">
                        <Input
                            value={formData?.telefono?.lada || ""}
                            onChange={(e) => handleNestedInputChange(e, "telefono")}
                            type="tel"
                            name="lada"
                            label="Lada"
                            size="lg"
                            variant="bordered"
                            startContent={<p>+</p>}
                        />
                        <Input
                            value={formData?.telefono?.numero || ""}
                            onChange={(e) => handleNestedInputChange(e, "telefono")}
                            variant="bordered"
                            type="tel"
                            name="numero"
                            label="Número"
                            size="lg"
                        />
                    </section>
                </section>

                {/* Dirección */}
                <section className="flex flex-col space-y-2">
                    <h1 className="text-gray-400">Dirección</h1>
                    <section className="flex flex-col space-y-3">
                        <Input
                            value={formData?.direccion?.calle || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="calle"
                            label="Calle"
                            size="lg"
                        />
                        <Input
                            value={formData?.direccion?.numeroExterior || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="numeroExterior"
                            label="Número Exterior"
                            size="lg"
                        />
                        <Input
                            value={formData?.direccion?.colonia || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="colonia"
                            label="Colonia"
                            size="lg"
                        />
                        <Input
                            value={formData?.direccion?.ciudad || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="ciudad"
                            label="Ciudad"
                            size="lg"
                        />
                        <Input
                            value={formData?.direccion?.estado || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="estado"
                            label="Estado"
                            size="lg"
                        />
                        <Input
                            value={formData?.direccion?.pais || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="pais"
                            label="Pais"
                            size="lg"
                        />
                        <Input
                            value={formData?.direccion?.codigoPostal || ""}
                            onChange={(e) => handleNestedInputChange(e, "direccion")}
                            variant="bordered"
                            type="text"
                            name="codigoPostal"
                            label="Código Postal"
                            size="lg"
                        />
                    </section>
                </section>

                {/* Certificaciones */}
                <h1 className="text-gray-400">Certificaciones</h1>
                <section className="flex flex-col space-y-10">
                    {formData?.credenciales &&
                        Object.entries(formData.credenciales).map(([type, cred]) => (
                            <section key={type} className="flex flex-col space-y-4">
                                <h1 className="text-lg font-bold text-gray-600 text-center">{type.toUpperCase()}</h1>
                                {type === "aws" && "idSoldador" in cred && (
                                    <Input label="Número de Soldador" variant="bordered" size="lg" value={cred.idSoldador} />
                                )}
                                <DatePicker onChange={(date) =>
                                    setFormData((prev) => {
                                        if (!prev || !prev.credenciales) return prev;
                                        return {
                                            ...prev,
                                            credenciales: {
                                                ...prev.credenciales,
                                                [type]: {
                                                    ...(prev.credenciales[type as keyof Soldador["credenciales"]] as object),
                                                    fechaVencimiento: date ? new Date(date.toDate(getLocalTimeZone()).toISOString()) : null,
                                                },
                                            },
                                        };
                                    })} label="Fecha de Vencimiento" variant="bordered" size="lg" value={cred.fechaVencimiento ? parseDate(new Date(cred.fechaVencimiento).toISOString().split("T")[0]) : undefined} />
                                {Array.isArray(cred.certificaciones) &&
                                    cred.certificaciones.map((cert, index) => (
                                        <div key={index} className="space-y-4 border p-2 rounded-2xl shadow-md">
                                            <div className="flex flex-row justify-between">
                                                <p className="text-md text-default-500">
                                                    Certificación {type.toUpperCase()} {index + 1}
                                                </p>
                                                <Button className="bg-transparent" isIconOnly radius="full" size="sm" color="default" onPress={() => removeCertificacion(type, index)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-700">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </Button>
                                            </div>
                                            {type === "custom" ? (
                                                <Input
                                                    value={cert.name || ""}
                                                    onChange={(e) =>
                                                        handleCredentialChange(
                                                            type as keyof Soldador["credenciales"],
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    variant="bordered"
                                                    type="text"
                                                    label="Nombre Certificación"
                                                    size="lg"
                                                />
                                            ) : (
                                                <Select
                                                    variant="bordered"
                                                    name={`${type}CertificacionName-${index}`}
                                                    label={`Nombre Certificación ${type.toUpperCase()}`}
                                                    selectedKeys={cert.name ? [cert.name] : []}
                                                    onSelectionChange={(value) =>
                                                        handleCredentialChange(
                                                            type as keyof Soldador["credenciales"],
                                                            index,
                                                            "name",
                                                            Array.isArray(value) ? value[0] : [...value][0]
                                                        )
                                                    }
                                                    size="lg"
                                                >
                                                    {(type === "aws" ? nombreCertificacionesAws : nombreCertificacionesIpc).map(
                                                        (certOption) => (
                                                            <SelectItem key={certOption.key} value={certOption.key}>
                                                                {certOption.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </Select>
                                            )}
                                            <Input
                                                value={cert.idCertificado || ""}
                                                onChange={(e) =>
                                                    handleCredentialChange(
                                                        type as keyof Soldador["credenciales"],
                                                        index,
                                                        "idCertificado",
                                                        e.target.value
                                                    )
                                                }
                                                variant="bordered"
                                                type="text"
                                                label="Número Certificado"
                                                size="lg"
                                            />
                                            {"level" in cert && (
                                                <Input
                                                    value={cert.level || ""}
                                                    onChange={(e) =>
                                                        handleCredentialChange(
                                                            type as keyof Soldador["credenciales"],
                                                            index,
                                                            "level",
                                                            e.target.value
                                                        )
                                                    }
                                                    variant="bordered"
                                                    type="text"
                                                    label="Nivel"
                                                    size="lg"
                                                />
                                            )}
                                            {"idEndorsement" in cert && (
                                                <Input
                                                    value={cert.idEndorsement || ""}
                                                    onChange={(e) =>
                                                        handleCredentialChange(
                                                            type as keyof Soldador["credenciales"],
                                                            index,
                                                            "idEndorsement",
                                                            e.target.value
                                                        )
                                                    }
                                                    variant="bordered"
                                                    type="text"
                                                    label="Número Endorsement"
                                                    size="lg"
                                                />
                                            )}
                                        </div>
                                    ))}
                                <Button
                                    color="primary"
                                    variant="bordered"
                                    onClick={() => addCertificacion(type as keyof Soldador["credenciales"])}
                                >
                                    Agregar Certificación {type.toUpperCase()}
                                </Button>
                                <Divider />
                            </section>
                        ))}
                </section>
            </form>
        </section>
    );
}