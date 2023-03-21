import styles from '../../styles/Home.module.css'
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { NextPage } from 'next'
import Layout from '../../components/Layout'
import SearchBar from '../../components/SearchBar'
import Head from 'next/head'

const RequestSongs: NextPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [savedSongs, setSavedSongs] = useState<any[]>([]);
  const [name, setName] = useState<string | null>(null);
  // const [bars, setBars] = useState<number[]>([]);
//   const accessCode = '0';
  const guestCode = router.query.guestCode as string;
  const inviteLink = 'https://www.untz.studio/guest/request-songs?guestCode=' + guestCode;

  const getName = async (guestCode: string): Promise<string | null> => {
    if (!guestCode) return null; // do not fetch if accessCode is not loaded
    try {
      const partyResponse = await fetch(`/api/get-party-by-guest-code?guestCode=${guestCode}`)
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
      const result = await getName(guestCode);
      setName(result);
    }
    fetchData();
  }, [guestCode]);

  async function handleSubmitSongs() {
    if (savedSongs.length > 5) {
      alert('you can only request up to five songs! click on some of them to unselect them')
      return;
    }
    if (savedSongs.length < 1) {
      alert('request at least one song to submit!')
      return;
    }
    setIsLoading(true)
    const response = await fetch("/api/save-songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guestCode,
        savedSongs,
      }),
    })
    if (response.ok) {
        router.push(`/guest/request-submitted?invite_link=${inviteLink}`)
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
              {name ? 
                <h1 className="basis-full text-4xl md:text-7xl font-bold text-center text-emerald-300">
                  request songs for {name}
                </h1> : 
                <h1 className="basis-full text-4xl md:text-7xl font-bold text-center text-emerald-300">
                  request songs
                </h1> 
              }
              
                <div className="py-5">
                  <p className='text-blue-300 text-xl'> pick up to five songs that you want to request for the event </p>
                </div>
              
                <h2 className="text-emerald-300 text-3xl font-bold">requests</h2>
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

export default RequestSongs
