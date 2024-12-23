"use client";

import { useState, useEffect } from "react";
import { getSoldadores } from "@/server/actions/soldador";
import Soldador from "@/types/Soldador";

export default function useSoldadores() {
  const [soldadores, setSoldadores] = useState<Soldador[]>([]);
  const [lastDocIdStack, setLastDocIdStack] = useState<string[]>([]); // Pila de lastDocId
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(-1); // Índice de la página actual
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Función para obtener soldadores, navegando a la página indicada
  const fetchSoldadores = async (pageIndex: number) => {
    if (loading) return; // Evita cargas múltiples
    setLoading(true);

    let lastIdToUse = null;

    if (pageIndex > 0 && lastDocIdStack[pageIndex - 1]) {
      lastIdToUse = lastDocIdStack[pageIndex - 1];
    }

    console.log("Fetching soldadores...", lastIdToUse);

    // Llama a getSoldadores con lastIdToUse (puede ser null)
    const result = await getSoldadores(lastIdToUse || undefined);

    if (result && result.soldadores.length > 0) {
      const newSoldadores: Soldador[] = result.soldadores;

      // Reemplaza el estado de soldadores con los nuevos datos
      setSoldadores(newSoldadores);

      const newLastDocId = result.lastDocId || null;

      // Actualiza la pila y el índice de página si estamos avanzando
      if (pageIndex === lastDocIdStack.length) {
        setLastDocIdStack((prevStack) => [...prevStack, newLastDocId || ""]);
      }

      setCurrentPageIndex(pageIndex);

      // Actualiza hasMore según si hay más datos para cargar
      setHasMore(!!newLastDocId);
    } else {
      setHasMore(false); // No hay más documentos para cargar
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSoldadores(0); // Carga inicial de soldadores en la página 0
  }, []);

  // Función para obtener la siguiente página y reemplazar los soldadores anteriores
  const fetchNextPage = () => {
    const nextPageIndex = currentPageIndex + 1;
    fetchSoldadores(nextPageIndex);
  };

  // Función para obtener la página anterior
  const fetchPrevPage = () => {
    if (currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      fetchSoldadores(prevPageIndex);
    }
  };

  // Función para reiniciar la lista de soldadores
  const resetSoldadores = () => {
    setSoldadores([]);
    setLastDocIdStack([]);
    setCurrentPageIndex(-1);
    setHasMore(true);
    fetchSoldadores(0); // Reinicia la paginación y obtiene la primera página
  };

  return {
    soldadores,
    loading,
    hasMore,
    fetchNextPage,
    fetchPrevPage,
    resetSoldadores,
    currentPageIndex,
  };
}
