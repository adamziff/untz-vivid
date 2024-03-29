import styles from '../../styles/Home.module.css'
import Head from "next/head"
import BarChart from "../../components/BarChart"
import SearchBar from "../../components/SearchBar"
import SearchBarRed from "../../components/SearchBarRed"
import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"
import Layout from "../../components/Layout"
import Slider from "rc-slider"
import 'rc-slider/assets/index.css';
import Handle from 'rc-slider/lib/Handles/Handle'
import { SliderProps } from 'rc-slider'
import Section from '../../components/Section'
import DurationInput from '../../components/DurationInput'
import { PartyType } from '../api/models/party'

interface Props extends SliderProps<number> {
  className?: string;
}

const EditUntz: React.FC<Props> = ({ className, ...sliderProps }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [bars, setBars] = useState<number[]>([10, 20, 30, 40]);
  const [chaos, setChaos] = useState<number>(15);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [duration, setDuration] = useState<number>(30);
  const [partyName, setPartyName] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string>('')

  const accessCode = router.query.accessCode as string;

  const getParty = async (accessCode: string): Promise<PartyType | null> => {
    if (!accessCode) return null; // do not fetch if accessCode is not loaded
    try {
      const partyResponse = await fetch(`/api/get-party?accessCode=${accessCode}`)
      if (partyResponse.ok) {
          const partyData = await partyResponse.json()
          const party = partyData.data
        
          return party;

      } else {
          console.log("Failed to get party")
          return null;
      }

    } catch (error) {
        console.log("Failed to get party")
        console.log(error);
        return null;
    }
  }

  useEffect(() => {
    async function fetchData() {
      const party = await getParty(accessCode);
      if (party) {
        setPartyName(party.name);
        setBars(party.energy_curve.map((value: number) => value * 100));
        setChaos(party.chaos);
        setDuration(party.duration);
        setInviteLink(party.invite_link);
      }
    }
    fetchData();
  }, [accessCode]);

  // const updatePartyName = (name: string | null) => {
  //   if (!name) {
  //     setPartyName('')
  //   } else {
  //     setPartyName(name)
  //   }
  // }

  const handleDurationChange = (duration: number) => {
    // if (duration >= 0 && duration <= 300) {
      // Duration is valid and within the allowed range (0-300 minutes)
      setDuration(duration);
    // } else {
    //   // Duration is invalid
    //   alert('Duration must be between 1 and 300 minutes.'); // Display an error message
    // }
  };
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipRef]);

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
    // const partyNameInput = document.getElementById('party-name') as HTMLInputElement
    // const durationInput = document.getElementById('duration') as HTMLInputElement

    if (!partyName || partyName.length < 1) {
      setIsLoading(false)
      alert('enter a party name!')
      return;
    }

    if (duration < 1) {
      setIsLoading(false)
      alert('set a duration!')
      return;
    }

    if (duration > 300) {
      setIsLoading(false)
      alert('your duration is too large- üntz does not currently support playlists longer than five hours')
      return;
    }

    const partyResponse = await fetch("/api/edit-party", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessCode,
        partyName,
        duration,
        bars,
        chaos,
      }),
    })
    if (partyResponse.ok) {
        setIsLoading(false)
        // const data = await response.json()
        console.log(accessCode)
        console.log(inviteLink)
        router.push(`/host/dashboard?accessCode=${accessCode}&inviteLink=${inviteLink}`)
    } else {
      setIsLoading(false)
      console.log("Failed to share üntz")
    }
  }


  return (
      <Layout>
          <Head>
            <title>edit üntz</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.newuntz}>
            {/* <div className="flex flex-col justify-center items-center"> */}
            <h1 className="basis-full text-6xl md:text-7xl font-bold text-center text-emerald-300">
              edit üntz
            </h1>

            {partyName !== null ? 
                <div className="py-5">
                  <label className="text-blue-300 font-bold text-3xl">event name</label>
                  <input
                    id="party-name"
                    placeholder="Charter Friday: Prism"
                    className="form-control md:px-10 p-2 text-white block text-3xl outline-blue-300 bg-gray-700 rounded-lg"
                    defaultValue={partyName}
                    onChange={(event) => setPartyName(event.target.value)}
                  ></input>
                </div> : 
              <h1 className="basis-full text-4xl font-bold text-white">
                loading üntz settings...

                <div className="py-5">
                  <label className="text-blue-300 font-bold text-3xl">event name</label>
                  <input
                    id="party-name"
                    placeholder="Charter Friday: Prism"
                    className="form-control md:px-10 p-2 text-white block text-3xl outline-blue-300 bg-gray-700 rounded-lg"
                    onChange={(event) => setPartyName(event.target.value)}
                  ></input>
                </div>
              </h1> 
            }

            { partyName !== null ? 
              <DurationInput initialDuration={duration} onDurationChange={handleDurationChange}></DurationInput>
            :
              <div></div>
            } 
          
            <div className='z-30'>
            <Section 
              headerClassName='text-blue-300' 
              headerText='chaos' 
              tooltipText='less chaos = the algorithm is more likely to include requests from your friends in the playlists. more chaos = more likely to hear unrequested songs that are recommended based on requested tracks.'
            />
            </div>

            { partyName !== null ? 
            <Slider
              defaultValue={chaos}
              onChange={(value) =>
                setChaos(typeof value === "number" ? value : value[0])
              }
              min={1}
              max={30}
              railStyle={{ backgroundColor: "#d1d5db" }}
              trackStyle={{ backgroundColor: "#10b981" }}
              handleStyle={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
              style={{ width: "full", maxWidth: "500px" }}
            /> 
            : 
            <div></div>
            }

            { partyName !== null ? 
            <div className="flex justify-between text-white">
              <span>{chaos}</span>
            </div>
            :
              <div></div>
            }
            
          
            { partyName !== null ? 
              <BarChart bars={bars} setBars={setBars}></BarChart>
            :
              <div></div>
            }  

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

export default EditUntz;