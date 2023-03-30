import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'


const Home: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  // const accessCode = 0;
  const [accessCode, setAccessCode] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(event.target.value);
  }

  const handleKeyDown =  async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && accessCode) {
      const res = await fetch(`/api/check-access-code?accessCode=${accessCode}`)
      if (res.ok) {
        console.log(res)
        const inviteLink = await res.json()
        console.log(inviteLink)
        router.push(`/host/dashboard?accessCode=${accessCode}&inviteLink=${inviteLink.inviteLink}`);
      }
      else {
        alert('invalid host code')
      }
    }
  }

  useEffect(() => {
    axios.get('https://untz-backend.azurewebsites.net/api/data').then(response => {
    // axios.get('http://127.0.0.1:8000/api/data').then(response => {
      setData(response.data.data);
    });
    // getDataFromAzure(setData);
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
        
            {/* {data ? <p className='text-white'>Song Selection Server is live!</p> : <p className='text-white'>Checking on Song Selection server...</p>} */}
            {/* <div className='p-3'></div> */}
        
            <Link href="/host/new-untz">
              <button className="bg-emerald-300 text-black rounded-md px-20 py-1 font-bold">
                get started
              </button>
            </Link>

            <div className='p-10'></div>
            <Link href="/info">
              <button className="bg-black text-emerald-300 rounded-md px-3 py-1 font-bold border border-emerald-300 rounded:md">
                not sure what to do? click here
              </button>
            </Link>

            <div className="py-4 md:p-10">
              <p className="text-white p-3">already have a host code? enter it here:</p>
              <input
                type="text"
                placeholder="Host Code"
                className="p-2 w-full border border-emerald-300 bg-gray-700 text-white rounded-lg"
                value={accessCode}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className='p-3'></div>
            {/* <Link href={`/guest/request-songs?accessCode=${accessCode}`}>
              <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                request songs
              </button>
            </Link> */}
        </div>
    </Layout>
  )
}

export default Home
