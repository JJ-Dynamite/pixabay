'use client';
import Head from 'next/head';
export default function Home() {
  return (
    <>
      <Head><title>pixabay</title></Head>
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">pixabay</h1>
          <p className="text-gray-400">Free stock photos, video, music</p>
        </div>
      </main>
    </>
  );
}
