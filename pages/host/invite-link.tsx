import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

const InviteLink: NextPage = () => {
  const router = useRouter()
  // console.log(router.query)
  const accessCode = router.query.access_code as string;
  const inviteLink = router.query.invite_link ? router.query.invite_link as string: '/';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy invite link: ', err);
    }
  };

  const copyAccessCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      alert('Access code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy access code: ', err);
    }
  };

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

            <p className="pt-10 text-white">
              congrats on creating your üntz party! here&apos;s what you do next.
            </p>

            <p className="p-10 text-emerald-300">
              1. share the invite link with your friends so they can request songs
            </p>

            <button
              className="text-emerald-300 p-3 text-center border border-emerald-300 rounded-md"
              onClick={copyToClipboard}
            >
              Copy Invite Link
            </button>

            <p className="pt-10 text-emerald-300">
              2. copy and save your party access code somewhere so you can access your dashboard
            </p>
            <p className="pb-10 pt-2 text-gray-400">
              you can enter this code on the home page to get to your party&apos;s dashboard that tracks all your friends&apos; requests
            </p>

            <button
              className="text-emerald-300 p-3 text-center border border-emerald-300 rounded-md"
              onClick={copyAccessCodeToClipboard}
            >
              Copy Access Code
            </button>

            <p className="text-emerald-300 p-10 text-center">
                {/* ür next party starts here */}
                {/* {inviteLink} */}
                3. go to the dashboard to track your friends&apos; requests, and generate your playlist when you&apos;re ready
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
