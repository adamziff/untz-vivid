import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

const RequestSubmitted: NextPage = () => {
  const router = useRouter()
  // console.log(router.query)
  const inviteLink = router.query.invite_link ? router.query.invite_link as string: '/';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy invite link: ', err);
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
              requests submitted!
            </h1>

            <p className="pt-10 text-white">
              congrats on submitting requests for your üntz party!
            </p>

            <p className="p-10 text-emerald-300">
              share the invite link with your friends so they can request songs too!
            </p>

            <button
              className="text-emerald-300 p-3 text-center border border-emerald-300 rounded-md"
              onClick={copyToClipboard}
            >
              Copy Invite Link
            </button>

            <p className="text-emerald-300 p-10 text-center">
                ready to create your own üntz party? click here:
              </p>
                    
            <Link href={'/host/new-untz'}>
              <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                get started
              </button>
            </Link>

            <p className="text-emerald-300 p-10 text-center">
                {/* ür next party starts here */}
                {/* {inviteLink} */}
                want more info? click here:
              </p>
                    
            <Link href={'/info'}>
              <button className="bg-emerald-300 text-black rounded-md px-3 py-1 font-bold">
                info & FAQs
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

export default RequestSubmitted
