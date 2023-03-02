import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'


async function getDataFromAzure(setData: any) {
  try {
    const response = await fetch("/api/select-songs");
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setData(data);
    } else {
      throw new Error("Failed to access select-songs");
    }
  } catch (error) {
    console.error(error);
    // handle error here (e.g. display an error message)
  }
}


const Home: NextPage = () => {
  const [data, setData] = useState<any>(null);
  const accessCode = 0;
  useEffect(() => {
    // axios.get('https://untz-backend.azurewebsites.net/api/data').then(response => {
    axios.get('http://127.0.0.1:8000/api/data').then(response => {
      setData(response.data.data);
    });
    getDataFromAzure(setData);
  }, []);
  return (
    <Layout>
      <Head>
        <title>üntz</title>
        <meta name="description" content="playlists for every party" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        {/* <div className={styles.index}> */}
            <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
              welcome to üntz
            </h1>
        
            <p className="text-emerald-300 p-10 text-center">
              ür next party starts here
            </p>
        
            {data ? <p>{data}</p> : <p>Loading...</p>}
            <div className='p-3'></div>
        
            <Link href="/host/new-untz">
              <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                get started
              </button>
            </Link>
            <div className='p-3'></div>
            <Link href={`/guest/request-songs?accessCode=${accessCode}`}>
              <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                request songs
              </button>
            </Link>
        </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </Layout>
  )
}

export default Home
