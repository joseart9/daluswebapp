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

export async function getSoldadores(
  lastDocId?: string
): Promise<{ soldadores: Soldador[]; lastDocId: string | null }> {
  let soldadoresQuery;

  if (lastDocId) {
    // Obtén el documento completo a partir del ID
    const lastDocRef = doc(firestore, "soldadores", lastDocId);
    const lastDocSnapshot = await getDoc(lastDocRef); // Obtener snapshot completo

    // Solo procede si el documento realmente existe
    if (lastDocSnapshot.exists()) {
      soldadoresQuery = query(
        collection(firestore, "soldadores"),
        orderBy("primerNombre"),
        startAfter(lastDocSnapshot), // Usamos el snapshot completo aquí
        limit(2)
      );
    } else {
      // Si no existe, devuelve un resultado vacío
      return {
        soldadores: [],
        lastDocId: null,
      };
    }
  } else {
    // Consulta inicial sin paginación
    soldadoresQuery = query(
      collection(firestore, "soldadores"),
      orderBy("primerNombre"),
      limit(2)
    );
  }

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
    } as Soldador; // Aseguramos el tipo Soldador con 'as Soldador'
  });

  console.log(soldadores);

  // Verifica si hay un último documento solo si hay resultados
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  return {
    soldadores,
    lastDocId: lastDoc ? lastDoc.id : null,
  };
}

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

export async function addSoldador(soldador: Soldador) {
  const soldadorData = actualizarEstatusCredenciales(soldador);

  try {
    // Referencia a la colección "soldadores"
    const soldadoresCollection = collection(firestore, "soldadores");

    // Agrega el documento a Firestore
    const docRef = await addDoc(soldadoresCollection, soldadorData);

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
