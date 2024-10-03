"use client";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

const Collections = () => {
  const { data: session } = useSession();
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Fetch users collections
  useEffect(() => {
    if (session) {
      fetch(`/api/collections?userId=${session.user?.email}`)
        .then(res => res.json())
        .then(data => setCollections(data.collections));
    }
  }, [session]);

  // Create a collection
  const createCollection = async () => {
    const res = await fetch('/api/collections/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCollectionName, userId: session?.user?.email })
    });

    const data = await res.json();
    if (data.success) {
      setCollections([...collections, { id: data.collectionId, name: newCollectionName }]);
      setNewCollectionName('');
    }
  };

  // Delete a collection
  const deleteCollection = async (collectionId: number) => {
    await fetch('/api/collections/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionId })
    });
    setCollections(collections.filter(col => col.id !== collectionId));
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
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>
            <h3>{collection.name}</h3>
            <button onClick={() => deleteCollection(collection.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Please log in to manage your collections.</p>
  );
};

export default Collections;
