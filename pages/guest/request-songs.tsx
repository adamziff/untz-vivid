import styles from '../../styles/Home.module.css'
import Head from "next/head"
import SearchBar from "../../components/SearchBar"
import { useRouter } from "next/router"
import { useState } from "react"
import Layout from "../../components/Layout"
import { Song } from "../api/models/song"
import { Party } from "../api/models/party"

export default function RequestSongs() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [savedSongs, setSavedSongs] = useState<any[]>([]);
  // const [bars, setBars] = useState<number[]>([]);
//   const accessCode = '0';
  const accessCode = router.query.accessCode as string;

  async function handleSubmitSongs() {
    setIsLoading(true)
    const response = await fetch("/api/save-songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessCode,
        savedSongs,
      }),
    })
    if (response.ok) {
        router.push('/')
    } else {
      setIsLoading(false)
      console.log("Failed to share üntz")
    }
  }


  return (
      <Layout>
          <Head>
            <title>request songs</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.newuntz}>
              {/* <div className="flex flex-col justify-center items-center"> */}
                <h1 className="basis-full text-6xl md:text-7xl font-bold text-center text-emerald-300">
                  party name here
                </h1>
              
                <div className="py-5">
                  <p className='text-blue-300 text-xl'> some important text describing the situation </p>
                </div>
              
                <h2 className="text-emerald-300 text-3xl font-bold">must play</h2>
                <SearchBar savedSongs={savedSongs} setSavedSongs={setSavedSongs}></SearchBar>
                            
                <button 
                  className="bg-emerald-300 text-black rounded-md px-10 py-1 font-bold"
                  onClick={handleSubmitSongs}
                  disabled={isLoading}>
                  submit
                </button>
              {/* </div> */}
              </div>
      </Layout>
  )
}
