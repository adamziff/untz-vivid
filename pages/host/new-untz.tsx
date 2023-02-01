import Link from "next/link"
import styles from '../../styles/Home.module.css'
import Head from "next/head"

export default function NewUntz() {
    return (
        <div className={styles.container}>
            <Head>
            <title>üntz</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col">
            <Link href="/">Home</Link>
            <h1 className="basis-full text-7xl font-bold text-center text-white">
              new üntz
            </h1>

            <p className="basis-full text-emerald-300 p-10 text-center">
                your next party starts here
            </p>
            <div className="flex flex-col justify-center items-center">
              <button className="bg-emerald-300 text-black rounded-md px-10 py-1 font-bold">
                <Link href="/host/new-untz">share üntz</Link>
              </button>
            </div>
        </main>
        </div>
    )
}