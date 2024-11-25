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

    if (result && result.soldadores.length > 0) {
      const newSoldadores: Soldador[] = result.soldadores;

      // Filtra duplicados basados en idSoldador
      setSoldadores((prevSoldadores) => {
        const combined = [...prevSoldadores, ...newSoldadores];
        return combined.filter(
          (soldador, index, self) =>
            index ===
            self.findIndex((s) => s.idSoldador === soldador.idSoldador)
        );
      });

      // Actualiza lastDocId para la siguiente página
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

  // Resetea el estado si se necesita una nueva búsqueda inicial
  const resetSoldadores = () => {
    setSoldadores([]);
    setLastDocId(null);
    setHasMore(true);
  };

  return {
    soldadores,
    loading,
    hasMore,
    fetchNextPage: fetchSoldadores,
    resetSoldadores,
  };
}
