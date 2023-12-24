import { db } from "@/app/firebase";
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where,
    getDoc,
    collection,
    getDocs,
} from 'firebase/firestore'

export const GET = async (request, { params }) => {
    const url = new URL(request.url)
    const gifId = url.searchParams.get('gifId')
    console.log(gifId);
  

    const querySnapshot = await getDocs(
        query(
            collection(db, 'giphy'),
            where('favourite', 'array-contains', gifId),
            where('userId', '==', ...params.userId)
        )
    )

    if (!querySnapshot.empty) {
        await updateDoc(doc(db, 'giphy', ...params.userId), {
            favourite: arrayRemove(gifId),
        })
    } else {
        await updateDoc(doc(db, 'giphy', ...params.userId), {
            favourite: arrayUnion(gifId),
        })
    }

    const userFavourite = await getDoc(doc(db, 'giphy', ...params.userId))

    return new Response(JSON.stringify(userFavourite.data()?.favourite), { status: 200 })
}