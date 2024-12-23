"use client";

import React from "react";
import useSoldadores from "@/hooks/useSoldadores";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Input,
} from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";

import Soldador from "@/types/Soldador";
import { Credencial } from "@/types/Credenciales";
import getMostImportantAwsCertification from "@/utils/getMostImportantAwsCertification";

import { useRouter } from "next/navigation"

export default function DesktopViewTable() {
    const [search, setSearch] = React.useState<string>("");
    const [inputValue, setInputValue] = React.useState<string>("");
    const {
        soldadores,
        loading,
        hasMore,
        fetchNextPage,
        resetSoldadores
    } = useSoldadores(search);

    const router = useRouter();

    // Definición de columnas
    const columns = [
        { name: "Información General", uid: "informacion" },
        { name: "Credenciales AWS", uid: "aws" },
        { name: "Credenciales IPC", uid: "ipc" },
        { name: "Credenciales Custom", uid: "custom" },
    ];

    console.log(soldadores);

    function useDebounce(callback: (...args: any[]) => void, delay: number) {
        const timeoutRef = React.useRef<number | undefined>();

        const debouncedFunction = React.useCallback((...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                callback(...args);
            }, delay);
        }, [callback, delay]);

        return debouncedFunction;
    }

    const renderCell = React.useCallback(
        (soldador: Soldador, columnKey: React.Key) => {
            // Renderizado de la columna de información general
            if (columnKey === "informacion") {
                const {
                    primerNombre,
                    segundoNombre,
                    primerApellido,
                    segundoApellido,
                    correo,
                    telefono,
                } = soldador;
                const fullName = [
                    primerNombre,
                    segundoNombre,
                    primerApellido,
                    segundoApellido,
                ]
                    .filter(Boolean)
                    .join(" ");
                const phoneNumber = `+${telefono?.lada} ${telefono?.numero}`;
                return (
                    <div className="flex flex-col w-full h-full gap-2">
                        <p className="text-black font-semibold">{fullName}</p>
                        <div className="flex flex-col gap-1">
                            <p className="text-black/60">{correo}</p>
                            <p className="text-black/60">{phoneNumber}</p>
                        </div>
                    </div>
                );
            }
            // Renderizado de las columnas de credenciales
            else if (["aws", "ipc", "custom"].includes(columnKey as string)) {
                const credencialKey = columnKey as keyof Credencial;
                const credencial = soldador.credenciales?.[credencialKey];
                if (credencialKey === "aws" && credencial && (credencial.certificaciones?.length ?? 0) > 0) {
                    const isActive = credencial.active;
                    const cert = getMostImportantAwsCertification(soldador);
                    const certName = cert ? cert.name : "";
                    return (
                        <div
                            className={`${isActive ? "bg-green-500" : "bg-red-500"
                                } rounded-lg p-2 gap-1 h-full flex flex-col`}
                        >
                            <p className="text-white/80 uppercase">{certName}</p>
                            <p className="text-white font-semibold">{cert?.idCertificado}</p>
                            {cert && "idEndorsement" in cert && <p className="text-white/80">{cert.idEndorsement}</p>}
                        </div>
                    );
                }
                if (credencialKey === "ipc" && credencial) {
                    const isActive = credencial.active;
                    return (
                        <div className="flex flex-col gap-2 h-full">
                            {credencial.certificaciones?.map((cert, index) => (
                                <div
                                    key={index}
                                    className={`gap-1 flex flex-col ${isActive ? "bg-green-500" : "bg-red-500"} rounded-lg p-2`}
                                >
                                    <p className="text-white/80">{cert.name}</p>
                                    <p className="text-white font-semibold">{cert.idCertificado}</p>
                                    {"level" in cert && <p className="text-white/80">{cert.level}</p>}
                                </div>
                            ))}
                        </div>
                    );
                }
                if (credencialKey === "custom" && credencial) {
                    const isActive = credencial.active;
                    const firstCert =
                        credencial.certificaciones && credencial.certificaciones[0];
                    const certName = firstCert ? firstCert.name : "";
                    return (
                        <div className="flex flex-col gap-2 h-full">
                            {credencial.certificaciones?.map((cert, index) => (
                                <div
                                    key={index}
                                    className={`gap-1 flex flex-col ${isActive ? "bg-green-500" : "bg-red-500"} rounded-lg p-2`}
                                >
                                    <p className="text-white/80">{cert.name}</p>
                                    <p className="text-white font-semibold">{cert.idCertificado}</p>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        []
    );

    // Implementación del scroll infinito
    const [loaderRef, scrollerRef] = useInfiniteScroll({
        hasMore,
        onLoadMore: fetchNextPage,
    });

    const debouncedSearch = useDebounce((value: string) => {
        setSearch(value);
        console.log("Searching for:", value);
        if (value === "") {
            resetSoldadores();
        }
    }, 300);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setInputValue(value);
        console.log("User typing:", value);
        debouncedSearch(value);
    };

    const handleEdit = (soldador: Soldador) => {
        router.push(`/edit/${soldador.idSoldador}`);
    }

    if (loading && soldadores.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner color="primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 ">
            <Input placeholder="Buscar por nombre" value={inputValue} onChange={(e) => handleSearch(e)} className="w-2/3" radius="full" startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            } />
            <Table
                aria-label="Tabla de Soldadores"
                color="primary"
                isStriped
                classNames={{
                    tr: "even:bg-primary/5",
                    base: "max-h-[520px] overflow-auto",
                }}
                baseRef={scrollerRef}
                bottomContent={
                    hasMore ? (
                        <div className="flex justify-center">
                            <Spinner ref={loaderRef} color="primary" />
                        </div>
                    ) : null
                }
                className="h-full px-2"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align="start">
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={soldadores}
                >
                    {(soldador) => (
                        <TableRow key={soldador.idSoldador} className="cursor-pointer hover:bg-primary/20" onClick={() => handleEdit(soldador)}>
                            {(columnKey) => (
                                <TableCell>{renderCell(soldador, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
