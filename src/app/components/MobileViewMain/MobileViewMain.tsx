"use client";

import { useRef, useCallback, useState } from "react";
import useSoldadores from "@/hooks/useSoldadores";
import SoldadorCard from "@/app/components/SoldadorCard/SoldadorCard";
import AddSoldadorButton from "@/app/components/AddSoldadorButton/AddSoldadorButton";
import { Input } from "@nextui-org/input";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { FaSearch } from "react-icons/fa";


export default function MobileViewMain() {
    const observer = useRef<IntersectionObserver | null>(null);
    const router = useRouter()
    const [inputValue, setInputValue] = useState<string>("");
    const [search, setSearch] = useState<string>("");

    const {
        soldadores,
        loading,
        hasMore,
        fetchNextPage,
        resetSoldadores
    } = useSoldadores(search);

    const lastSoldadorElementRef = useCallback(
        (node: any) => {
            if (loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchNextPage();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, fetchNextPage]
    );

    console.log(soldadores);

    function useDebounce(callback: (...args: any[]) => void, delay: number) {
        const timeoutRef = useRef<number | undefined>();

        const debouncedFunction = useCallback((...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                callback(...args);
            }, delay);
        }, [callback, delay]);

        return debouncedFunction;
    }

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

    if (loading && soldadores.length === 0) return (
        <main className="flex h-screen w-screen items-center justify-center">
            <CircularProgress color="primary" />
        </main>
    );

    return (
        <main className="flex flex-col space-y-1 h-full w-full">
            <Input placeholder="Buscar por nombre" onChange={(e) => handleSearch(e)} value={inputValue} className="w-2/3 px-4 mt-4" radius="full" startContent={
                <FaSearch className="text-default-400" />
            }
                classNames={{
                    input: "bg-white focus:bg-white",
                    inputWrapper: "bg-white data-[focus=true]:bg-white"
                }}
            />
            <div className="flex flex-col w-full h-full space-y-4 p-3">
                {soldadores.map((soldador, index) => {
                    if (soldadores.length === index + 1) {
                        return (
                            <div ref={lastSoldadorElementRef} key={soldador.idSoldador}>
                                <SoldadorCard soldador={soldador} />
                            </div>
                        );
                    } else {
                        return (
                            <SoldadorCard key={soldador.idSoldador} soldador={soldador} />
                        );
                    }
                })}
            </div>
            {loading && <div className="flex w-screen items-center justify-center">
                <CircularProgress color="primary" />
            </div>}

            <div className="fixed bottom-4 right-4">
                <AddSoldadorButton onClick={() => router.push("/new")} />
            </div>
        </main>
    );
}
