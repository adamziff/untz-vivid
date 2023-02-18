import Link from "next/link"
import styles from '../../styles/Home.module.css'
import Head from "next/head"
import BarChart from "../../components/BarChart"
import SearchBar from "../../components/SearchBar"
import SearchBarRed from "../../components/SearchBarRed"
import { useRouter } from "next/router"
import { useState } from "react"
import Layout from "../../components/Layout"

export default function NewUntz() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleShareUntz() {
    setIsLoading(true)
    const response = await fetch("/api/add-songs")
    if (response.ok) {
      const response = await fetch("/api/add-party")
      if (response.ok) {
        setIsLoading(false)
        router.push("/")
        // router.push("/host/invite-link")
      } else {
        setIsLoading(false)
        console.log("Failed to share üntz")
      }
    } else {
      setIsLoading(false)
      console.log("Failed to share üntz")
    }
  }

  return (
      <Layout>
          <Head>
            <title>üntz</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.newuntz}>
              {/* <div className="flex flex-col justify-center items-center"> */}
                <h1 className="basis-full text-6xl md:text-7xl font-bold text-center text-emerald-300">
                  new üntz
                </h1>
              
                <div className="py-5">
                  <label className="text-blue-300 text-3xl">party name:</label>
                  <input
                    placeholder="Charter Friday: Prism"
                    className="form-control md:px-10 p-2 bg-black text-emerald-300 placeholder-blue-300::placeholder block text-3xl outline-blue-300"
                  ></input>
                </div>
              
                <div className="py-5">
                  <label className="text-blue-300 text-3xl">duration (min):</label>
                  <input
                    placeholder="180"
                    className="form-control md:px-10 py-2 px-2 bg-black text-emerald-300 placeholder-blue-300::placeholder block text-3xl outline-blue-300"
                  ></input>
                </div>
              
                <h2 className="text-emerald-300 text-3xl font-bold">must play</h2>
                <SearchBar></SearchBar>
              
                <h2 className="text-red-400 text-3xl font-bold pt-4">do not play</h2>
                <SearchBarRed></SearchBarRed>
              
                <BarChart></BarChart>
              
                <button 
                  className="bg-emerald-300 text-black rounded-md px-10 py-1 font-bold"
                  onClick={handleShareUntz}
                  disabled={isLoading}>
                  share üntz
                </button>
              {/* </div> */}
              </div>
      </Layout>
  )
}
