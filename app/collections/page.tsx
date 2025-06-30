"use client";
import { useState, useEffect } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from "../firebaseConfig";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, where, query } from "firebase/firestore";

const Collections = () => {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<{id: string, name: string}[]>([]); 
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [updatedCollectionName, setUpdatedCollectionName] = useState('');
  const router = useRouter();

  // Fetch users collections on render
  useEffect(() => {
    if (session) {
      // console.log('Session Data:', session);
      // console.log('User Email:', session?.user?.email); 
      fetchCollections();
    }
  }, [session]);

const fetchCollections = async () => {
  try {
    const collectionsRef = collection(db, "userCollections");
    // Collections belonging to users email
    const userCollectionsQuery = query(
      collectionsRef,
      where("userEmail", "==", session?.user.email)
    );

    const querySnapshot = await getDocs(userCollectionsQuery);
    const fetchedCollections = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCollections(fetchedCollections as any[]);
  } catch (error) {
    console.error('Error fetching collections:', error);
    setCollections([]);
  }
};

  // Create a collection
  const createCollection = async () => {
    if (!newCollectionName) {
      console.error('Missing collection name');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "userCollections"), {
        name: newCollectionName,
        userEmail: session?.user?.email,
        createdAt: new Date(),
      });
        setCollections([...collections, { id: docRef.id, name: newCollectionName }]);
        setNewCollectionName('');
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  // Delete a collection
const deleteCollection = async (collectionId: string) => {
  try {
    const placesCollectionRef = collection(db, "userCollections", collectionId, "places");
    const placesSnapshot = await getDocs(placesCollectionRef);

    // Collect all placeIds that need to be checked for deletion
    const placeIds = placesSnapshot.docs.map((doc) => doc.data().placeId);
    // Delete all nested documents (places) in collection
    const deletePlacesPromises = placesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePlacesPromises);
    // Delete collection document
    await deleteDoc(doc(db, "userCollections", collectionId));

    // Check if each placeId is still referenced by any other collections and delete if not
    await Promise.all(
      placeIds.map(async (placeId) => {
        const isLocationReferenced = await checkIfLocationReferenced(placeId);
        if (!isLocationReferenced) {
          await deleteDoc(doc(db, "locations", placeId));
          // console.log(`Location ${placeId} deleted from locations collection.`);
        }
      })
    );
    // Update the state to remove the deleted collection
    setCollections(collections.filter((col) => col.id !== collectionId));
  } catch (error) {
    console.error('Error deleting collection and its places:', error);
  }
};

// Helper function/ checks if location referenced in any collection
const checkIfLocationReferenced = async (placeId: string) => {
  const collectionsSnapshot = await getDocs(collection(db, "userCollections"));
  for (const collectionDoc of collectionsSnapshot.docs) {
    const placesCollectionRef = collection(collectionDoc.ref, "places");
    const placesSnapshot = await getDocs(placesCollectionRef);
    if (placesSnapshot.docs.some((placeDoc) => placeDoc.data().placeId === placeId)) {
      return true; // Found reference to location
    }
  }
  return false; // No references found
};

  const handleEditCollection = (collectionId: string, currentName: string) => {
    setEditingCollection(collectionId);
    setUpdatedCollectionName(currentName);
  };

  // Update a collection's name
  const updateCollection = async () => {
    if (!editingCollection || !updatedCollectionName.trim()) return;
    
    try {
        const collectionDocRef = doc(db, "userCollections", editingCollection);
        await updateDoc(collectionDocRef, { name: updatedCollectionName });
        setCollections(collections.map(col =>
          col.id === editingCollection ? { ...col, name: updatedCollectionName } : col
        ));
        setEditingCollection(null);
        setUpdatedCollectionName('');
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  // Navigate inside selected collection 
  const viewCollection = (collectionId: string) => {
    router.push(`/collections/${collectionId}`);
  };

  return session ? (
    <>
    <div className='collections-container'>
      <div className="nav-div">
            <div className="home-content">
            <Image
                src="/images/SpookMap_logo.svg"
                alt="Spooky background image"
                width={300}
                height={200}
                className="ghost-image"
              />
            </div>

            <div className="btn-cont">
              <button className="collections-btn home-btn" onClick={() => window.location.href = '/home'}>
                <span>Home</span>
              </button>
              <a className="signOutBtn" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</a>
            </div>
          </div>
      <div className='manage-container'>
      <p className='cust-heading'>Manage Your Collections</p>
      <div className='coll-input-container'>
        <input
            type="text"
            placeholder="New collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <button className='collections-btn create-btn' onClick={createCollection}>Create Collection</button>
      </div>
      </div>

      <div className="collections-grid">
        {collections.length > 0 ? (
          collections.map(collection => (
            <div 
              key={collection.id} 
              className="collection-card"
              style={{ cursor: 'pointer' }}>
            {editingCollection === collection.id ? (
              <>
                <input
                  type="text"
                  value={updatedCollectionName}
                  onChange={(e) => setUpdatedCollectionName(e.target.value)}
                  placeholder="New collection name"
                />
                <button onClick={updateCollection} className="update-btn">Save</button>
              </>
            ) : (
              <>
                  <Image className='city-img' src="/images/city.jpg" alt="city" width={100} height={100} onClick={() => viewCollection(collection.id)}/>
                  <button onClick={() => handleEditCollection(collection.id, collection.name)} className="edit-btn">Edit</button>
                  <div className='card-content'>
                    <h3 className="collection-name">{collection.name}</h3>
                    <Image onClick={() => deleteCollection(collection.id)} className="delete-btn" src="/images/delete.png" alt="trash icon" width={30} height={30} />
                  </div>
              </>
            )}
          </div>
          ))
        ) : (
          <p>No collections found.</p>
        )}
      </div>
    </div>
    </>
  ) : (
    <p>Please log in to manage your collections.</p>
  );
};

export default Collections;
