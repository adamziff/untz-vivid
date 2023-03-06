import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


const Waiting: NextPage = () => {
    const router = useRouter()
    const code = router.query.code as string;
    const state = router.query.state as string;
    // console.log('code')
    // console.log(code)
    // console.log('state')
    // console.log(state)

    // const createPlaylist = async (songs: string[]) => {
    // try {
    //     console.log('waiting.tsx: generatePlaylistCalled')
    //     // console.log('code')
    //     // console.log(code)
    //     // console.log('state')
    //     // console.log(state)
    //     console.log(songs)
    //     const createPlaylistRes = await fetch(`/api/create-playlist?songs=${encodeURIComponent(JSON.stringify(songs))}&code=${code}`);
    //     if (createPlaylistRes.ok) {
    //         console.log('playlist created! now notify the user')
    //     } else {
    //         console.log("dashboard.tsx: Failed to create playlist on user account")
    //     }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const selectSongs = async (accessCode: string) => {
        try {
            const fetchOptions: Partial<RequestInit> & { timeout: number } = {
                timeout: 300000,
              };
            const res = await fetch(`/api/select-songs?accessCode=${encodeURIComponent(JSON.stringify(accessCode))}`, fetchOptions);
            if (res.ok) {
                const songs = await res.json()
                //   console.log('selected songs')
                //   console.log(songs)
                //   console.log(songs.data.tracks.uri)
                return (songs.data.tracks)
                } else {
                const error = await res.json()
                console.log("dashboard.tsx: Failed to select songs")
                console.log(error)
                }
        } catch (error) {
          console.log(error);
        }
      }

      useEffect(() => {
        async function fetchData() {
            try {
                const accessCode = state;
                const songs = await selectSongs(accessCode);
                // console.log('waiting.tsx: songs returned from selectSongs in waiting.tsx')
                // console.log(songs)
                
                // Move createPlaylist inside the useEffect hook
                const createPlaylist = async (songs: string[]) => {
                    try {
                        // console.log('waiting.tsx: generatePlaylistCalled')
                        // console.log('code')
                        // console.log(code)
                        // console.log('state')
                        // console.log(state)
                        // console.log('waiting.tsx: songs inside createPlaylist')
                        console.log(songs)
                        const createPlaylistRes = await fetch(`/api/create-playlist?songs=${encodeURIComponent(JSON.stringify(songs))}&code=${code}&accessCode=${accessCode}`);
                        if (createPlaylistRes.ok) {
                            console.log('playlist created! now notify the user')
                        } else {
                            console.log("dashboard.tsx: Failed to create playlist on user account")
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                // Call createPlaylist after selectSongs
                await createPlaylist(songs)
            } catch (error) {
                console.log(error)
            }
        }
        // Only run the effect when both code and state exist
        if (code && state) {
            fetchData();
        }
    }, [code, state]);
    

    // useEffect(() => {
    //     async function fetchData() {
    //       try {
    //             const accessCode = state // using the unique party id as the state
    //             const songs = await selectSongs(accessCode);
    //             console.log('songs returned from selectSongs in waiting.tsx')
    //             console.log(songs)
    //             // do something with the playlist data
    //             const playlistResponse = await createPlaylist(songs)
    //             console.log(playlistResponse)
    //       } catch (error) {
    //         // handle errors
    //         console.log(error)
    //       }
    //     }
    //     // Only run the effect when both code and state exist
    //     if (code && state) {
    //       fetchData();
    //     }
    //   }, [code && state]);
      

    return (
        <Layout>
            <Head>
                <title>üntz waiting</title>
                <meta name="description" content="playlists for every party" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <main className='bg-black'> */}
                <div className={styles.main}>
                    <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
                    generating...
                    </h1>
                
                    <p className="text-emerald-300 p-10 text-center">
                    ür party playlist is on the way
                    </p>
                        
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

export default Waiting
