"use client";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Collections = () => {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<{id: number, name: string}[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const router = useRouter();

  // Fetch users collections on render
  useEffect(() => {
    if (session) {
      console.log('Session Data:', session);
      console.log('User Email:', session?.user?.email); 
      fetchCollections();
    }
  }, [session]);

  const fetchCollections = async () => {
    try {
      const res = await fetch(`/api/collections?userId=${session?.user?.email}`);
      const data = await res.json();
      console.log('Fetched Collections:', data); 
      setCollections(data.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  // Create a collection
  const createCollection = async () => {
    try {
      const res = await fetch('/api/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName, userId: session?.user?.email })
      });
      
      const data = await res.json();
      console.log('Created Collection:', data);
      if (data.success) {
        setCollections([...collections, { id: data.collectionId, name: newCollectionName }]);
        setNewCollectionName('');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  // Delete a collection
  const deleteCollection = async (collectionId: number) => {
    try {
      await fetch('/api/collections/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId })
      });

      console.log('Deleted Collection ID:', collectionId);
      setCollections(collections.filter(col => col.id !== collectionId));

    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  // Navigate inside selected collection 
  const viewCollection = (collectionId: number) => {
    router.push(`/collections/${collectionId}`);
  };

  return session ? (
    <div>
      <h1>Manage Your Collections</h1>
      <div>
        <input
          type="text"
          placeholder="New Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <button onClick={createCollection}>Create Collection</button>
        <button onClick={() => window.location.href = '/dashboard'}>Dashboard</button>
      </div>

      <div className="collections-grid">
        {collections.map(collection => (
          <div key={collection.id} className="collection-card" >
            {/* <h3 onClick={() => window.location.href = `/collections/${collection.id}`}>{collection.name}</h3> */}
            <h3 onClick={() => viewCollection(collection.id)}>{collection.name}</h3>
            <button onClick={() => deleteCollection(collection.id)} className="delete-btn">Delete</button>          
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Please log in to manage your collections.</p>
  );
};

export default Collections;
