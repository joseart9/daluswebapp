"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import useSoldadores from "@/hooks/useSoldadores";
import SoldadorCard from "@/app/components/SoldadorCard";
import AddSoldadorButton from "@/app/components/AddSoldadorButton/AddSoldadorButton";
import SoldadorModal from "@/app/components/SoldadorModal";
import { Input } from "@nextui-org/input";
import { Button, CircularProgress } from "@nextui-org/react";

export default function Home() {
  const { soldadores, loading, hasMore, fetchNextPage } = useSoldadores();
  const [isModalOpen, setModalOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

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

  if (loading && soldadores.length === 0) return (
    <main className="flex h-screen w-screen items-center justify-center">
      <CircularProgress color="primary" />
    </main>
  );

  return (
    <main className="flex flex-col space-y-1 p-2 h-full w-full">
      <Input placeholder="Buscar" className="w-2/3" radius="full" startContent={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      } />
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
        <AddSoldadorButton onClick={() => setModalOpen(true)} />
      </div>
      <SoldadorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
