import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout'

const InviteLink: NextPage = () => {

  const accessCode = 0;

  return (
    <Layout>
      <Head>
        <title>üntz invite link</title>
        <meta name="description" content="playlists for every party" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className='bg-black'> */}
        <div className={styles.main}>
            <h1 className="font-bold text-center text-white text-4xl md:text-7xl">
              invite link
            </h1>
        
            <p className="text-emerald-300 p-10 text-center">
              ür next party starts here
            </p>
                    
            <Link href={`/host/dashboard?accessCode=${accessCode}`}>
              <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                dashboard
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

export default InviteLink
