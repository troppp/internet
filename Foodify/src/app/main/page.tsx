'use client';

import type { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Main: NextPage = () => {
  const router = useRouter();
  const [lyricsList, setLyricsList] = useState<JSON[]>([]);
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  useEffect(() => {
    getTracks();
  }, []);

  const getTracks = async () => {
    const lyricsHolder: JSON[] = []; 
    const res = await fetch('/api/topTracks');
    const { items } = await res.json();
  
    await Promise.all(items.map(async (item) => {
      const lyricsRes = await fetch(`/api/lyricsFetcher?id=${item.id}&song=${item.name}`);
      const lyrics = await lyricsRes.json();
      lyricsHolder.push(lyrics);
    }));
  
    setLyricsList(lyricsHolder);
  };
  

  if(status === 'authenticated') {
    return (
      <main className="flex flex-col hero min-h-screen bg-base-200">
        <div>
          <h1>
            Welcome,{' '}
            {status === 'authenticated'
              ? data.user?.name || 'friend'
              : 'stranger'}
            !
          </h1>
        </div>
        <div>
          <button onClick={() => signOut()} className="btn">Sign Out</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Food</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {lyricsList.map((item) => (
              <tr key={item.id}>
                <td>{item.llmResponse.song}</td>
                <td>{item.llmResponse.food}</td>
                <td>{item.llmResponse.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    )
  }
  else {
    return ( 
      <main className="flex flex-col hero min-h-screen bg-base-200">
        <h1>Unauthorized Access</h1>
      </main>
    )
  }
}

export default Main