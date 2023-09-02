import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { boxDays } from "../data/Days";
import Box from "../Components/Box";
import { TiTime } from "react-icons/ti";
import SlideIn from "../Components/SlideIn";
import { useSelector, useDispatch } from "react-redux";
import {
  setClaimed,
  setDailyClaim,
  setPoint,
} from "../store/reducers/AppReducer";
import { motion } from "framer-motion";
import axios from "axios";
import { PacmanLoader } from "react-spinners";
import AccessAlarmsRounded from "@mui/icons-material/AccessAlarmsRounded";
import Footer from "@/Components/Footer";
import BackToTopButton from "@/Components/BackToTopButton";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import CountdownToLaunch from "@/Components/CountdownToLaunch";

const Claim = (props) => {
  const dispatch = useDispatch();
  const { Claimed, User } = useSelector((state) => state.App);
  const [timeLeft, setTimeLeft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState(null);
  const [totalLeft, setTotalLeft] = useState(null);

  const [lastClaimed, setLastClaimed] = useState(null);
  const [dailyClaimed, setDailyClaimed] = useState(null);
  const { theme } = useSelector((state) => state.Theme);
  const textTheme = theme ? "text-slate-950" : "text-slate-300";
  const textTheme2 = theme ? "text-teal-100" : "text-teal-950";
  const colorTheme = theme ? "bg-[#EDF1E4]" : "bg-slate-950";
  const colorTheme2 = !theme ? "bg-[#EDF1E4]" : "bg-slate-950";
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://bandbindex.com/"
      : "http://localhost:3000";
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  // UseEffect
  useEffect(() => {
    if (lastClaimed !== null) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const hours = 23 - now.getHours();
        const minutes = 59 - now.getMinutes();

        const seconds = 59 - now.getSeconds();
        const timeString = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setTimeLeft(timeString.split("-").join(""));
      }, 1000);

      // Clean up the interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [lastClaimed]);

  useEffect(() => {
    // Get the current date and set the time to 00:00:00.000
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    // Assuming lastClaim is a Date object, set the time to 00:00:00.000

    let lastClaimDate = new Date(lastClaimed);
    lastClaimDate.setHours(0, 0, 0, 0);
    // console.log(now.getTime() > lastClaimDate.getTime());
    now.getTime() > lastClaimDate.getTime()
      ? dispatch(setClaimed(false))
      : dispatch(setClaimed(true));

    if (points == null) {
      dispatch(setClaimed(false));
      return;
    }
  }, [lastClaimed]);

  const updatePoints = () => {
    const address = User;

    // Define the baseUrl
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://bandbindex.com"
        : "http://localhost:3000";

    // Make a POST request to /api/totalClaim to get total index left

    axios
      .post(`${baseUrl}/api/totalClaim`)
      .then((res) => {
        const indexLeft = 1000000 - res.data.totalPoints;
        setTotalLeft(indexLeft);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .post(`${baseUrl}/api/points`, { address })
      .then((res) => {
        const claimData = res.data;
        // Update the state variable with the returned points
        console.log(claimData);
        setPoints(claimData.points);
        setLastClaimed(claimData.lastClaim);
        setDailyClaimed(claimData.dailyClaim);
        dispatch(setDailyClaim(claimData.dailyClaim));
        dispatch(setPoint(claimData.points));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!points) {
      updatePoints();
    }
  });

  // FUNCTIONS;
  const sendPoints = async (address, points) => {
    try {
      const result = await axios.post(`${baseUrl}/api/claim`, {
        address: address,
        points: points,
        lastClaim: new Date(),
      });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onClaim = () => {
    dispatch(setClaimed(true));
    setIsOpen(true);
    sendPoints(User, dailyClaimed);
  };

  return (
    <div className={textTheme}>
      <div className={` ${colorTheme} relative flex flex-col`}>
        <div className='relative top-10'>
          <CountdownToLaunch />
        </div>
        <div className='min-h-[100vh] px-5 flex items-center'>
          {points === null ? (
            <PacmanLoader
              color={"#F5900C"}
              loading={points === null ? true : false}
              cssOverride={override}
              size={28}
              aria-label='Loading Spinner'
              data-testid='loader'
            />
          ) : (
            <div className='max-w-max mx-auto flex flex-col items-center'>
              <motion.h1
                initial={{ scale: [0], rotate: [0] }}
                animate={{
                  scale: [0, 0.2, 0.4, 1, 0.8, 1],
                  rotate: [],
                }}
                className='mb-5 absolute top-5 right-4 text-sm flex items-center justify-center font-normal space-x-1'
              >
                <AnnouncementOutlinedIcon
                  color='white'
                  style={{ fontSize: 25, color: "#F5900C" }}
                />
                <div className={textTheme}>
                  <a
                    href='https://discord.com/channels/1141795377180311563/1141795377968853166'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Give Feedback
                  </a>
                </div>
              </motion.h1>

              <motion.h1
                initial={{ scale: [0], rotate: [0] }}
                animate={{
                  scale: [0, 0.2, 0.4, 1, 0.8, 1],
                  rotate: [],
                }}
                className='mb-5 text-xl font-bold'
              >
                <center>
                  <Image
                    src={"/assets/images/token.png"}
                    alt='Logo'
                    width={100}
                    height={100}
                    className='rotating-image' // Apply the CSS class here
                  />
                </center>
                <div className={textTheme}>
                  You have {points || 0} Index Rewards!
                </div>
              </motion.h1>
              <div className=' flex flex-col items-start text-[13px] mb-5 rectangular-component'>
                <h2 className='mb-5'>{props.title}</h2>
                <div className='flex flex-wrap md:flex-nowrap'>
                  {boxDays.map((box) => {
                    return (
                      <Box key={box.day} day={box.day} sticks={box.points} />
                    );
                  })}
                </div>
                <p className='mt-4'>
                  Get ready to claim{" "}
                  <span className='text-teal-600 font-bold'>
                    {dailyClaimed}
                  </span>{" "}
                  $INDEX 🚀 next time you log in!
                </p>

                <p className='mb-2'>
                  Unlock bigger rewards by logging in for 7 days straight.
                </p>

                <button
                  onClick={onClaim}
                  disabled={Claimed}
                  className={`w-full py-2 flex justify-center items-center rounded ${colorTheme2} ${textTheme2} disabled:bg-gray-500`}
                >
                  {Claimed ? (
                    <>
                      Come back in <TiTime /> {timeLeft}
                    </>
                  ) : (
                    <> Collect {dailyClaimed} Sticks</>
                  )}{" "}
                </button>

                <SlideIn
                  isOpen={isOpen}
                  onClose={() => {
                    setIsOpen(false);
                    updatePoints();
                  }}
                />
              </div>
              {totalLeft !== null && (
                <motion.h1
                  initial={{ scale: [0], rotate: [0] }}
                  animate={{
                    scale: [0, 0.2, 0.4, 1, 0.8, 1],
                    rotate: [],
                  }}
                  className='mb-5 text-sm flex items-center font-normal'
                >
                  <AccessAlarmsRounded
                    color='white'
                    style={{ fontSize: 25, color: "#F5900C" }}
                  />
                  &nbsp;
                  <div className={textTheme}>
                    There&apos;s only{" "}
                    <span className='font-bold'>
                      {totalLeft.toLocaleString()} Index
                    </span>{" "}
                    left to claim
                  </div>
                </motion.h1>
              )}
            </div>
          )}
        </div>
        <b>
          <BackToTopButton />
        </b>
      </div>
      <Footer />
    </div>
  );
};

export default Claim;
