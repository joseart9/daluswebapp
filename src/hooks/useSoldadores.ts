import { useState, useEffect } from "react";
import { getSoldadores } from "@/server/actions/soldador";
import Soldador from "@/types/Soldador";

export default function useSoldadores(searchTerm?: string) {
  const [soldadores, setSoldadores] = useState<Soldador[]>([]);
  const [lastDocCursor, setLastDocCursor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSoldadores = async () => {
    if (loading) return; // Evita cargas múltiples
    setLoading(true);

    console.log("Fetching soldadores...", lastDocCursor);

    // Pasa searchTerm a getSoldadores
    const result = await getSoldadores(lastDocCursor, searchTerm);

    if (result && result.soldadores.length > 0) {
      const newSoldadores: Soldador[] = result.soldadores;

      setSoldadores((prevSoldadores) => {
        if (lastDocCursor === null) {
          // Si es la primera carga o se cambió el searchTerm, reemplazamos la lista
          return newSoldadores;
        } else {
          // De lo contrario, concatenamos los nuevos soldadores
          return [...prevSoldadores, ...newSoldadores];
        }
      });

      // Actualiza lastDocCursor para la siguiente página solo si no hay searchTerm
      if (!searchTerm) {
        setLastDocCursor(result.lastDocCursor);
        // Actualiza hasMore en función de si hay más documentos
        setHasMore(!!result.lastDocCursor);
      } else {
        // Si hay searchTerm, no paginamos
        setHasMore(false);
      }
    } else {
      setHasMore(false); // No hay más documentos para cargar
    }

    setLoading(false);
  };

  useEffect(() => {
    setSoldadores([]); // Resetea la lista de soldadores
    setLastDocCursor(null); // Resetea el cursor
    setHasMore(true);
    fetchSoldadores(); // Carga inicial de soldadores
  }, [searchTerm]);

  const resetSoldadores = () => {
    setSoldadores([]);
    setLastDocCursor(null);
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
