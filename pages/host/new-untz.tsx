import Link from "next/link"
import styles from '../../styles/Home.module.css'
import Head from "next/head"
import BarChart from "../../components/BarChart"
import SearchBar from "../../components/SearchBar"

export default function NewUntz() {
    return (
        <div className={styles.container}>
            <Head>
            <title>üntz</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="">
            <Link href="/">Home</Link>
            <div className="flex flex-col justify-center items-center">
                <h1 className="basis-full text-7xl font-bold text-center text-emerald-300">
                new üntz
                </h1>

                <div className="py-5">
                  <label className="text-blue-300">party name:</label>
                  <input
                    placeholder="Charter Friday: Prism"
                    className="form-control px-10 py-2 bg-black text-emerald-300 placeholder-blue-300::placeholder block text-3xl"
                  ></input>
                </div>

                <div className="py-5">
                  <label className="text-blue-300">duration (min):</label>
                  <input
                    placeholder="180"
                    className="form-control px-10 py-2 bg-black text-emerald-300 placeholder-blue-300::placeholder block text-3xl"
                  ></input>
                </div>

                <SearchBar></SearchBar>

                <BarChart></BarChart>
                
                <button className="bg-emerald-300 text-black rounded-md px-10 py-1 font-bold">
                    <Link href="/host/new-untz">share üntz</Link>
                </button>
            </div>
        </main>
        </div>
    )
}