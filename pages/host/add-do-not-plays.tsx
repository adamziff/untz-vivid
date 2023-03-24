import styles from '../../styles/Home.module.css'
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { NextPage } from 'next'
import Layout from '../../components/Layout'
import SearchBar from '../../components/SearchBar'
import Head from 'next/head'

const AddDoNotPlays: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [savedSongs, setSavedSongs] = useState<any[]>([]);
  const [name, setName] = useState<string | null>(null);
  // const [bars, setBars] = useState<number[]>([]);
//   const accessCode = '0';
  const accessCode = router.query.accessCode as string;
  const inviteLink = router.query.inviteLink as string;

  const getName = async (accessCode: string): Promise<string | null> => {
    if (!accessCode) return null; // do not fetch if accessCode is not loaded
    try {
      const partyResponse = await fetch(`/api/get-party?accessCode=${accessCode}`)
      if (partyResponse.ok) {
          const partyData = await partyResponse.json()
          const party = partyData.data
        
          const name = party.name;
          return name;

      } else {
          console.log("Failed to get party")
          return '';
      }

    } catch (error) {
        console.log("Failed to get party")
        console.log(error);
        return '';
    }
  }

  useEffect(() => {
    async function fetchData() {
      const result = await getName(accessCode);
      setName(result);
    }
    fetchData();
  }, [accessCode]);

  async function handleSubmitSongs() {
    if (savedSongs.length < 1) {
      alert('pick at least one song to submit!')
      return;
    }
    setIsLoading(true)
    const response = await fetch("/api/add-do-not-plays", {
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
        router.push(`/host/dashboard?accessCode=${accessCode}&inviteLink=${inviteLink}`);
    } else {
      setIsLoading(false)
      console.log("Failed to share üntz")
    }
  }


  return (
      <Layout>
          <Head>
            <title>add do not plays</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.newuntz}>
              {name ? 
                <h1 className="basis-full text-4xl md:text-7xl font-bold text-center text-emerald-300">
                  add do not play songs for {name}
                </h1> : 
                <h1 className="basis-full text-4xl md:text-7xl font-bold text-center text-emerald-300">
                  add do not play songs
                </h1> 
              }
              
                <div className="py-5">
                  <p className='text-blue-300 text-xl'> pick songs that you do not want played at the event </p>
                </div>
              
                <h2 className="text-emerald-300 text-lg md:text-3xl font-bold">do not plays</h2>
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

export default AddDoNotPlays
