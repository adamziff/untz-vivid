import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'


const Info: NextPage = () => {
  useEffect(() => {
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
              hey. welcome to üntz.
            </h1>
        
            <p className="text-emerald-300 pt-8 pb-2 text-center">
              ür next party starts here. 
            </p>

            <div className='text-white pb-10 text-center'>
                <p className="text-gray-400">
                    use üntz.studio to create playlists with your friends for the dance floor, dinner party, road trip, and more.
                </p>
                <p className="text-gray-400">
                    follow the instructions below to generate the perfect playlist for your event.
                    {/* let üntz be your dj for the dance floor, dinner party, road trip, and more.  */}
                </p>
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl">
                step 1: create ür party
            </h2>

            <div className='text-white p-5 text-center'>
                pick your <p className="font-bold text-emerald-300 inline">must plays</p>, the songs you absolutely have to hear, 
                and your <p className="font-bold text-red-500 inline">do not plays</p>, the songs you wouldn&apos;t be caught dead listening to.
            </div>

            <div className='text-white pb-5 text-center'>
                set your <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500 inline">energy curve</p> to control the flow of the vibes,
                and choose how much <p className="font-bold text-yellow-300 inline">chaos</p> you want- more chaos means less catering to requests.
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl pt-10">
                step 2: share with friends
            </h2>

            <div className='text-white p-5 text-center'>
                send the <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500 inline">invite link</p> to your friends so they can request songs.
            </div>

            <div className='text-white pb-5 text-center'>
                track requests in your <p className="font-bold text-emerald-300 inline">dashboard</p> to see what your friends want to hear. 
                make sure you save your <p className="font-bold text-emerald-300 inline">access code</p> so you can easily get back to the dashboard.
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl pt-10">
                step 3: generate playlist
            </h2>

            <div className='text-white p-5 text-center'>
                when you&apos;re ready, click <p className="font-bold text-emerald-300 inline">generate playlist</p>.
                leave the tab open while the song selection algorithm runs- we&apos;ll let you know when your playlist is ready.
            </div>
        
            <div className='pb-10'>
                <Link href="/host/new-untz">
                <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                    get started
                </button>
                </Link>
            </div>


            <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
              meet the team.
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="pt-5 md:px-2">
                  <h2 className="font-bold text-center text-emerald-300 text-xl md:text-4xl pb-4">
                    Adam Ziff
                  </h2>
                  <Image src="/Headshot_No_Tie.jpg" alt="DJ Ziff" width={300} height={280} />
                  <p className="py-2">
                    Hey y&apos;all! I&apos;m a senior Computer Science major at Princeton, and
                    I&apos;m building üntz for my senior thesis. I&apos;m also an avid
                    musician and songwriter, and I hope to work in the music tech industry
                    after I graduate this spring.
                  </p>
                  <Link href="https://www.linkedin.com/in/adamziff/">
                    <p className="text-gray-400 underline hover:text-gray-600">LinkedIn</p>
                  </Link>
                </div>
                <div className="pt-5 md:px-2">
                  <h2 className="font-bold text-center text-emerald-300 text-xl md:text-4xl pb-4">
                    DJ ZIFF
                  </h2>
                  <Image src='/Hotel_Chantelle.JPG' alt="DJ Ziff" width={300} height={280} objectFit="cover" objectPosition="center"/>
                  <div className='py-2'>
                    DJ ZIFF is an <Link href='https://www.papermag.com/fresh-pressed-sundays-finest-maneros-2659362969.html'><p className='text-gray-400 underline inline hover:text-gray-600'>&quot;up-and-comer&quot;</p></Link> DJ in the NYC nightlife scene. 
                    With a focus on house, disco, and hyperpop, his electric sets are taking the city by storm, and he&apos;s only just getting started.
                  </div>
                  <Link href='https://www.instagram.com/dj.ziff/'>
                    <p className='text-gray-400 underline hover:text-gray-600'>Instagram</p>
                  </Link>
                  <Link href='https://soundcloud.com/dj-ziff'>
                    <p className='text-gray-400 underline hover:text-gray-600'>Soundcloud</p>
                  </Link>
                </div>
            </div>

        </div>

      <footer className={styles.footer}>
      </footer>
    </Layout>
  )
}

export default Info
