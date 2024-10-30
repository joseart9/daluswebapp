"use client";

import { useState, useEffect } from "react";
import { getSoldadores } from "@/server/actions/soldador";
import Soldador from "@/types/Soldador";

export default function useSoldadores() {
  const [soldadores, setSoldadores] = useState<Soldador[]>([]);
  const [lastDocId, setLastDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSoldadores = async () => {
    if (loading) return; // Evita cargas múltiples
    setLoading(true);

    console.log("Fetching soldadores...", lastDocId);

    // Llama a getSoldadores con el lastId recibido (si lo hay)
    const result = await getSoldadores(lastDocId || undefined);

    console.log(result);

    if (result && result.soldadores.length > 0) {
      const newSoldadores: Soldador[] = result.soldadores.map(
        (soldador: Soldador) => ({
          ...soldador,
        })
      );

      setSoldadores((prevSoldadores) => [...prevSoldadores, ...newSoldadores]);

      // Actualiza lastDocId para la siguiente página, basado en el último documento recibido
      const newLastDocId = result.lastDocId;
      setLastDocId(newLastDocId || null);

      // Si la cantidad recibida es menor que el límite, no hay más datos
      setHasMore(newSoldadores.length === 2);
    } else {
      setHasMore(false); // No hay más documentos para cargar
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSoldadores(); // Carga inicial de soldadores
  }, []);

  return {
    soldadores,
    loading,
    hasMore,
    fetchNextPage: fetchSoldadores,
  };
}
