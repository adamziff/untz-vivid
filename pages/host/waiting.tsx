import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'


const Waiting: NextPage = () => {
    const router = useRouter()
    // const code = router.query.code as string;
    const state = router.query.state as string;
    const [playlistLink, setPlaylistLink] = useState<string | null>(null);
    const [requestInfo, setRequestInfo] = useState<string>('');

    const selectSongs = async (accessCode: string): Promise<{ songs: string[]; partyName: string }> => {
    // const selectSongs = async (accessCode: string) => {
        try {
            setRequestInfo('getting party info')
            const partyResponse = await fetch(`/api/get-party?accessCode=${accessCode}`)
            if (partyResponse.ok) {
                const partyData = await partyResponse.json()
                setRequestInfo('party info accessed, running song selection algorithm')
                const party = partyData.data
              
                const users = party.requests;
                const energyCurve = party.energy_curve;
                const chaos = party.chaos
                const numSongs = Math.round(party.duration/3) // assumes average 3 minutes / song
                const mustPlays = party.mustPlays;
                const doNotPlays = party.doNotPlays;

                console.log('generating playlist')
                const fetchOptions: Partial<RequestInit> & { timeout: number } = {
                timeout: 300000,
                };
                const playlistResponse = await fetch(
                `https://untz-backend.azurewebsites.net/api/generate-playlist?users=${encodeURIComponent(
                // `http://localhost:8000/api/generate-playlist?users=${encodeURIComponent(
                    JSON.stringify(users)
                )}&energy_curve=${encodeURIComponent(
                    JSON.stringify(energyCurve)
                )}&chaos=${chaos}&num_songs_to_select=${numSongs}
                &must_plays=${encodeURIComponent(JSON.stringify(mustPlays))}
                &do_not_plays=${encodeURIComponent(JSON.stringify(doNotPlays))}`,
                fetchOptions
                );
                if (playlistResponse.ok) {
                    const playlist = await playlistResponse.json()
                    setRequestInfo('songs selected! creating spotify playlist')
                    console.log('generated playlist successfully')
                    console.log(playlist)
                    console.log(playlist.tracks.length + ' songs')
                    return {songs: playlist.tracks, partyName: party.name};
                } else {
                    setRequestInfo('song selection algorithm failed')
                    console.log("Playlist returned, response bad")
                    console.log(partyResponse)
                    const playlistError = await playlistResponse.json()
                    console.log(playlistError)
                    return {songs: [], partyName: 'error'};
                }
            } else {
                setRequestInfo('failed to get party info')
                console.log("Failed to get party")
                return {songs: [], partyName: 'error'};
            }

        } catch (error) {
            setRequestInfo('playlist generation failed')
            console.log("Failed to generate playlist")
            console.log(error);
            return {songs: [], partyName: 'error'};
        }
      }

      useEffect(() => {
        async function fetchData() {
            try {
                const accessCode = state;
                const {songs, partyName} = await selectSongs(accessCode);

                // error handling
                if (songs.length === 0) {
                    console.log("Failed to generate playlist")
                }
                else {
                    // Move createPlaylist inside the useEffect hook
                    const createPlaylist = async (songs: string[], partyName: string) => {
                        try {
                            // const createPlaylistRes = await fetch(`/api/create-playlist?songs=${encodeURIComponent(JSON.stringify(songs))}&code=${code}&accessCode=${accessCode}&partyName=${partyName}`);
                            const createPlaylistRes = await fetch(`/api/create-playlist?songs=${encodeURIComponent(JSON.stringify(songs))}&accessCode=${accessCode}&partyName=${partyName}`);
                            if (createPlaylistRes.ok) {
                                const { data, link } = await createPlaylistRes.json()
                                setRequestInfo('spotify playlist created! opening playlist now')
                                console.log(data)
                                console.log(link)
                                setPlaylistLink(link)
                                router.push(link)
                            } else {
                                setRequestInfo('failed to create spotify playlist')
                                console.log("waiting.tsx: Failed to create playlist on user account")
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    // Call createPlaylist after selectSongs
                    await createPlaylist(songs, partyName)
                }
            } catch (error) {
                console.log(error)
            }
        }
        // Only run the effect when both code and state exist
        if (state) {
        // if (code && state) {
            fetchData();
        }
    }, [state]);
    // }, [code, state]);
      

    return (
        <Layout>
            <Head>
                <title>üntz waiting</title>
                <meta name="description" content="playlists for every party" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {playlistLink ? 
                <div className={styles.main}>
                    <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
                        ready!
                    </h1>
                
                    <p className="text-emerald-300 p-10 text-center">
                        ür party playlist is here:
                    </p>
                    <p className='text-white'>{playlistLink}</p> 
                </div>
                :
                <div className={styles.main}>
                    <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
                    generating...
                    </h1>
                
                    <p className="text-emerald-300 p-10 text-center">
                    ür party playlist is on the way (give it a few minutes)
                    </p>
                        
                </div>
            }

            <p className="text-red-400 p-10 text-center">
                {requestInfo}
            </p>

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

export default Waiting
