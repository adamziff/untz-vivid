import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'


const Waiting: NextPage = () => {
    const router = useRouter()
    // const accessCode = router.query.accessCode as string;
    // const name = router.query.name as string;
    // const [playlistLink, setPlaylistLink] = useState<string | null>(null);
    // const [requestInfo, setRequestInfo] = useState<string>('');

    // const selectSongs = async (accessCode: string): Promise<{ songs: string[] }> => {
    //     try {
    //             console.log('generating playlist')
    //             setRequestInfo('running song selection algorithm')
    //             const fetchOptions: Partial<RequestInit> & { timeout: number } = {
    //             timeout: 300000,
    //             };
    //             const playlistResponse = await fetch(
    //                 `https://untz-backend.azurewebsites.net/api/generate-playlist?accessCode=${
    //                 // `http://localhost:8000/api/generate-playlist?accessCode=${
    //                     accessCode
    //                 }`,
    //                 fetchOptions
    //             );
    //             if (playlistResponse.ok) {
    //                 const playlist = await playlistResponse.json()
    //                 setRequestInfo('songs selected! creating spotify playlist')
    //                 console.log('generated playlist successfully')
    //                 console.log(playlist)
    //                 console.log(playlist.tracks.length + ' songs')
    //                 return {songs: playlist.tracks};
    //             } else {
    //                 setRequestInfo('song selection algorithm failed')
    //                 console.log("Playlist returned, response bad")
    //                 const playlistError = await playlistResponse.json()
    //                 console.log(playlistError)
    //                 return {songs: []};
    //             }

    //     } catch (error) {
    //         setRequestInfo('playlist generation failed')
    //         console.log("Failed to generate playlist")
    //         console.log(error);
    //         return {songs: []};
    //     }
    //   }

    //   useEffect(() => {
    //     if (!accessCode) return; // do not fetch if accessCode is not loaded
    //     if (!name) return; // do not fetch if name is not loaded
    //     async function fetchData() {
    //         try {
    //             const {songs} = await selectSongs(accessCode);

    //             // error handling
    //             if (songs.length === 0) {
    //                 console.log("Failed to generate playlist")
    //             }
    //             else {
    //                 // Move createPlaylist inside the useEffect hook
    //                 const createPlaylist = async (songs: string[], partyName: string) => {
    //                     try {
    //                         const createPlaylistRes = await fetch(`/api/create-playlist?songs=${encodeURIComponent(JSON.stringify(songs))}&accessCode=${accessCode}&partyName=${partyName}`);
    //                         if (createPlaylistRes.ok) {
    //                             const { data, link } = await createPlaylistRes.json()
    //                             setRequestInfo('spotify playlist created! opening playlist now')
    //                             console.log(data)
    //                             console.log(link)
    //                             setPlaylistLink(link)
    //                             router.push(link)
    //                         } else {
    //                             setRequestInfo('failed to create spotify playlist')
    //                             console.log("waiting.tsx: Failed to create playlist on user account")
    //                         }
    //                     } catch (error) {
    //                         console.log(error);
    //                     }
    //                 }
    //                 // Call createPlaylist after selectSongs
    //                 await createPlaylist(songs, name)
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     // Only run the effect when both code and state exist
    //     if (accessCode && name) {
    //         fetchData();
    //     }
    // }, [accessCode, name]);
      

    return (
        <Layout>
            <Head>
                <title>üntz waiting</title>
                <meta name="description" content="playlists for every party" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* {playlistLink ? 
                <div className={styles.main}>
                    <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
                        ready!
                    </h1>
                
                    <p className="text-emerald-300 py-5 px-3 text-center">
                        ür party playlist is here:
                    </p>
                    <p className='text-white'>{playlistLink}</p> 
                </div>
                :
                <div className={styles.main}>
                    <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
                    generating...
                    </h1>
                
                    <p className="text-emerald-300 py-5 px-3 text-center">
                    ür party playlist is on the way (give it a few minutes)
                    </p>
                        
                </div>
            } */}

            <div className={styles.main}>
                <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
                playlist generation is unavailable
                </h1>
            
                <p className="text-emerald-300 py-5 px-3 text-center">
                ür developer ran out of school funding for Azure credits :)
                </p>

                <p className="text-gray-400 py-5 px-3 text-center">
                here&apos;s an example of a playlist created with üntz: 
                </p>

                <Link href="https://open.spotify.com/playlist/5TtsyVFjPfez96xm8GbLfa">
                    <p className="text-gray-400 underline hover:text-gray-600">Charter Overgrown party playlist</p>
                </Link>

                    
            </div>

            {/* <p className="text-red-400 p-10 text-center">
                {requestInfo}
            </p> */}

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
