import styles from '../../styles/Home.module.css'
import Head from "next/head"
import BarChart from "../../components/BarChart"
import SearchBar from "../../components/SearchBar"
import SearchBarRed from "../../components/SearchBarRed"
import { useRouter } from "next/router"
import { useState } from "react"
import Layout from "../../components/Layout"
import Slider from "rc-slider"
import 'rc-slider/assets/index.css';
import Handle from 'rc-slider/lib/Handles/Handle'
import { SliderProps } from 'rc-slider'

interface Props extends SliderProps<number> {
  className?: string;
}

const NewUntz: React.FC<Props> = ({ className, ...sliderProps }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [savedSongs, setSavedSongs] = useState<any[]>([]);
  const [savedSongsRed, setSavedSongsRed] = useState<any[]>([]);
  const [bars, setBars] = useState<number[]>([10, 20, 30, 40]);
  const [chaos, setChaos] = useState<number>(50);

  const handle = (props: any) => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Handle value={value} {...restProps}>
        <div className="bg-emerald-300 w-8 h-8 rounded-full flex items-center justify-center text-white">
          {value}
        </div>
      </Handle>
    );
  };

  async function handleShareUntz() {
    setIsLoading(true)
    const partyNameInput = document.getElementById('party-name') as HTMLInputElement
    const durationInput = document.getElementById('duration') as HTMLInputElement

    if (partyNameInput.value.length < 1) {
      setIsLoading(false)
      alert('enter a party name!')
      return;
    }

    if (durationInput.value.length < 1) {
      setIsLoading(false)
      alert('enter a duration!')
      return;
    }

    const partyResponse = await fetch("/api/add-party", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        savedSongs,
        savedSongsRed,
        partyName: partyNameInput.value,
        duration: parseInt(durationInput.value),
        bars,
        chaos,
      }),
    })
    if (partyResponse.ok) {
      const { message, accessCode, inviteLink } = await partyResponse.json()
      const response = await fetch("/api/add-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          savedSongs,
          savedSongsRed,
          accessCode
        }),
      })
      if (response.ok) {
        setIsLoading(false)
        // const data = await response.json()
        router.push(`/host/invite-link?access_code=${accessCode}&invite_link=${inviteLink}`)
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
            <title>new üntz</title>
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
                id="party-name"
                placeholder="Charter Friday: Prism"
                className="form-control md:px-10 p-2 text-white block text-3xl outline-blue-300 bg-gray-700 rounded-lg"
              ></input>
            </div>
          
            <div className="py-5">
              <label className="text-blue-300 text-3xl">duration (min):</label>
              <input
                id="duration"
                placeholder="180"
                className="form-control md:px-10 py-2 px-2 text-white block text-3xl outline-blue-300 bg-gray-700 rounded-lg"
              ></input>
            </div>
          
            <h2 className="text-emerald-300 text-3xl font-bold">must play</h2>
            <SearchBar
              savedSongs={savedSongs}
              setSavedSongs={setSavedSongs}
            ></SearchBar>
          
            <h2 className="text-red-400 text-3xl font-bold pt-4">do not play</h2>
            <SearchBarRed
              savedSongsRed={savedSongsRed}
              setSavedSongsRed={setSavedSongsRed}
            ></SearchBarRed>
          
            <h2 className="text-blue-300 text-3xl font-bold py-2">chaos</h2>
            <Slider
              defaultValue={chaos}
              onChange={(value) =>
                setChaos(typeof value === "number" ? value : value[0])
              }
              railStyle={{ backgroundColor: "#d1d5db" }}
              trackStyle={{ backgroundColor: "#10b981" }}
              handleStyle={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
              style={{ width: "full", maxWidth: "500px" }}
            />
            <div className="flex justify-between">
              <span>{chaos}</span>
            </div>
          
            <BarChart bars={bars} setBars={setBars}></BarChart>
          
            <div className="p-10"></div>
          
            <button
              className="bg-emerald-300 text-black rounded-md px-10 py-1 font-bold"
              onClick={handleShareUntz}
              disabled={isLoading}
            >
              share üntz
            </button>
            {/* </div> */}
          </div>
      </Layout>
  )
}

export default NewUntz;