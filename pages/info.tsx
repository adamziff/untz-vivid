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
                    follow the instructions below to generate the perfect playlist for every event.
                    {/* let üntz be your dj for the dance floor, dinner party, road trip, and more.  */}
                </p>
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl pb-5">
                step 1: create ür party
            </h2>

            <div className='text-white pb-5 text-center'>
                pick your <p className="font-bold text-emerald-300 inline">must plays</p>, the songs you absolutely have to hear, 
                and your <p className="font-bold text-red-500 inline">do not plays</p>, the songs you wouldn&apos;t be caught dead listening to.
                no matter what any of your guests request, we&apos;ll include/exclude these in any playlist we generate for you.
            </div>

            <div className='text-white pb-5 text-center'>
                set your <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500 inline">~energy curve~</p> to control the flow of the vibes;
                the algorithm will choose the order of the songs in the playlist to match this curve.
            </div>
            <div className='text-white pb-5 text-center'>
                choose how much <p className="font-bold text-yellow-300 inline">chaos</p> you want. 
                less chaos = requests from your guests are very likely to be played.
                more chaos = the algorithm will cater more towards recommended songs based on requests, not the requests themselves.
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl pt-10 pb-5">
                step 2: share with friends
            </h2>

            <div className='text-white pb-5 text-center'>
                send the <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500 inline">invite link</p> to your friends so they can request songs.
            </div>

            <div className='text-white pb-1 text-center'>
                track requests in your <p className="font-bold text-emerald-300 inline">host dashboard</p> to see what your friends want to hear. 
                make sure you save your <p className="font-bold text-emerald-300 inline">host code</p> so you can easily get back to the dashboard.
            </div>
            <div className='text-gray-400 pb-5 text-center'>
                share the host code with your co-hosts so they can access the dashboard too by entering it on the untz.studio home page. guests can&apos;t see what anyone else requests.
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl pt-10 pb-5">
                step 3: generate playlist
            </h2>

            <div className='text-white pb-1 text-center'>
                when you&apos;re ready, click <p className="font-bold text-emerald-300 inline">generate playlist</p>.
                leave the tab open while the song selection algorithm runs- the playlist will open automatically when it&apos;s ready.
            </div>
            <div className='text-gray-400 pb-5 text-center'>
              the playlist songs are sorted to match the energy curve you set, so make sure you play it in order.
            </div>

            <h2 className="font-bold text-center text-emerald-300 text-lg md:text-4xl pt-10 pb-5">
                step 4: relax
            </h2>

            <div className='text-white pb-5 text-center'>
                taking aux is stressful. let<p className="font-bold text-emerald-300 inline"> üntz </p>do the hard part for you.
            </div>
        
            <div className='py-10'>
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
                  <p className="py-2 text-white">
                    Hey y&apos;all! I just graduated from Princeton as a Computer Science major, I&apos;m also an avid
                    musician and songwriter, and I built üntz for my senior thesis.
                    I&apos;m moving to New York after a summer of traveling Europe, and I&apos;m 
                    looking for a product role in the tech industry.
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
                  <div className='py-2 text-white'>
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
