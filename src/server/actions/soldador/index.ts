"use server";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  addDoc,
  where,
  updateDoc,
} from "firebase/firestore/lite";
import db from "@/firebase";
import Soldador from "@/types/Soldador";
import actualizarEstatusCredenciales from "@/utils/actualizarStatusCredenciales";

const firestore = getFirestore(db);

export async function getSoldadorById(
  idSoldador: string
): Promise<Soldador | null> {
  try {
    // Referencia a la colección "soldadores"
    const soldadoresCollection = collection(firestore, "soldadores");

    // Crea una consulta para buscar por el campo "idSoldador"
    const soldadorQuery = query(
      soldadoresCollection,
      where("idSoldador", "==", idSoldador)
    );

    // Ejecuta la consulta
    const querySnapshot = await getDocs(soldadorQuery);

    // Si hay un documento en el resultado, mapea el primer documento a un objeto Soldador
    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      const data = docSnapshot.data();

      return {
        idSoldador: data.idSoldador,
        primerNombre: data.primerNombre,
        segundoNombre: data.segundoNombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        correo: data.correo,
        telefono: data.telefono,
        direccion: data.direccion,
        empresaActual: data.empresaActual,
        credenciales: {
          aws: data.credenciales?.aws
            ? {
                ...data.credenciales.aws,
                fechaVencimiento:
                  data.credenciales.aws.fechaVencimiento?.toDate(),
              }
            : undefined,
          ipc: data.credenciales?.ipc
            ? {
                ...data.credenciales.ipc,
                fechaVencimiento:
                  data.credenciales.ipc.fechaVencimiento?.toDate(),
              }
            : undefined,
          custom: data.credenciales?.custom
            ? {
                ...data.credenciales.custom,
                fechaVencimiento:
                  data.credenciales.custom.fechaVencimiento?.toDate(),
              }
            : undefined,
        },
      } as Soldador; // Aseguramos el tipo Soldador con 'as Soldador'
    } else {
      // Si no se encontró un documento, devuelve null
      return null;
    }
  } catch (error) {
    console.error("Error al buscar el soldador por ID:", error);
    throw error; // Lanza el error para manejo adicional si es necesario
  }
}

export async function getSoldadores(
  lastDocCursorParam?: any,
  searchTerm?: string
): Promise<{ soldadores: Soldador[]; lastDocCursor: any | null }> {
  const collectionRef = collection(firestore, "soldadores");
  const constraints = [];

  if (searchTerm) {
    const searchTermLower = searchTerm.toLowerCase().trim();

    // Utilizamos array-contains para buscar en keywords
    constraints.push(where("keywords", "array-contains", searchTermLower));

    // Opcionalmente, podemos ordenar por __name__ (ID del documento)
    constraints.push(orderBy("__name__"));

    // No agregamos startAfter cuando hay searchTerm
    // Establecemos un límite razonable
    constraints.push(limit(20)); // Ajusta el límite según tus necesidades
  } else {
    // Sin searchTerm, usamos paginación normal
    constraints.push(orderBy("nombreCompleto"), orderBy("idSoldador"));

    if (lastDocCursorParam) {
      constraints.push(startAfter(...lastDocCursorParam));
    }

    constraints.push(limit(5));
  }

  const soldadoresQuery = query(collectionRef, ...constraints);

  const querySnapshot = await getDocs(soldadoresQuery);

  const soldadores = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      idSoldador: data.idSoldador,
      primerNombre: data.primerNombre,
      segundoNombre: data.segundoNombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido,
      correo: data.correo,
      telefono: data.telefono,
      direccion: data.direccion,
      empresaActual: data.empresaActual,
      credenciales: {
        aws: data.credenciales?.aws
          ? {
              ...data.credenciales.aws,
              fechaVencimiento:
                data.credenciales.aws.fechaVencimiento?.toDate(),
            }
          : undefined,
        ipc: data.credenciales?.ipc
          ? {
              ...data.credenciales.ipc,
              fechaVencimiento:
                data.credenciales.ipc.fechaVencimiento?.toDate(),
            }
          : undefined,
        custom: data.credenciales?.custom
          ? {
              ...data.credenciales.custom,
              fechaVencimiento:
                data.credenciales.custom.fechaVencimiento?.toDate(),
            }
          : undefined,
      },
    } as Soldador;
  });

  // Obtenemos el último documento para la paginación solo si no hay searchTerm
  let lastDocCursor = null;

  if (!searchTerm && querySnapshot.docs.length > 0) {
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    const lastDocData = lastDoc.data();
    lastDocCursor = [lastDocData.nombreCompleto, lastDocData.idSoldador];
  }

  return {
    soldadores,
    lastDocCursor,
  };
}

export async function addSoldador(soldador: Soldador) {
  const soldadorData = actualizarEstatusCredenciales(soldador);

  function generateKeywords(names: any[]) {
    const permutations = new Set();

    for (let i = 1; i <= names.length; i++) {
      for (let j = 0; j <= names.length - i; j++) {
        const keyword = names.slice(j, j + i).join(" ");
        permutations.add(keyword);
      }
    }

    return Array.from(permutations);
  }

  const names = [
    soldadorData.primerNombre,
    soldadorData.segundoNombre || "",
    soldadorData.primerApellido || "",
    soldadorData.segundoApellido || "",
  ].map((name) => name.toLowerCase().trim());

  const nombreCompleto = names.join(" ");

  const keywords = generateKeywords(names);

  const soldadorDataWithExtraFields = {
    ...soldadorData,
    nombreCompleto,
    keywords,
  };

  try {
    // Referencia a la colección "soldadores"
    const soldadoresCollection = collection(firestore, "soldadores");

    // Agrega el documento a Firestore
    const docRef = await addDoc(
      soldadoresCollection,
      soldadorDataWithExtraFields
    );

    console.log("Soldador agregado con ID:", docRef.id);
    return docRef.id; // Devuelve el ID del documento agregado si es necesario
  } catch (error) {
    console.error("Error al agregar el soldador:", error);
    throw error; // Lanza el error para manejo adicional si es necesario
  }
}

export async function updateSoldador(soldador: Soldador): Promise<void> {
  try {
    // Referencia a la colección "soldadores"
    const soldadoresCollection = collection(firestore, "soldadores");

    // Crea una consulta para encontrar el documento con el idSoldador especificado
    const soldadorQuery = query(
      soldadoresCollection,
      where("idSoldador", "==", soldador.idSoldador)
    );

    // Ejecuta la consulta
    const querySnapshot = await getDocs(soldadorQuery);

    // Verifica si se encontró el documento
    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0]; // Obtén el primer documento encontrado
      const docRef = doc(firestore, "soldadores", docSnapshot.id);

      // Actualiza el campo "active" en las credenciales antes de guardar
      const updatedSoldador = actualizarEstatusCredenciales(soldador);

      // Actualiza el documento en Firestore con los nuevos datos
      await updateDoc(docRef, updatedSoldador);

      console.log(
        `Soldador con ID ${soldador.idSoldador} actualizado correctamente.`
      );
    } else {
      console.error(
        `No se encontró un soldador con el ID ${soldador.idSoldador}.`
      );
      throw new Error(`Soldador con ID ${soldador.idSoldador} no encontrado.`);
    }
  } catch (error) {
    console.error("Error al actualizar el soldador:", error);
    throw error; // Lanza el error para manejo adicional si es necesario
  }
}

export async function updateSoldadoresWithNombreCompleto() {
  const soldadoresSnapshot = await getDocs(collection(firestore, "soldadores"));

  soldadoresSnapshot.forEach(async (docSnapshot) => {
    const data = docSnapshot.data();

    const nombreCompleto = [
      data.primerNombre,
      data.segundoNombre,
      data.primerApellido,
      data.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    await updateDoc(doc(firestore, "soldadores", docSnapshot.id), {
      nombreCompleto,
    });
  });
}
