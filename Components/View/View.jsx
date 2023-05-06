import React, { useContext, useEffect, useState } from "react";
import Style from "./View.module.css";
import Style2 from "../Vote/Vote.module.css";
import Image from "next/image";
import { ethers } from "ethers";

import winnerImg from "../../public/candidate.jpg";
import { VotingSystemContext } from "@/Hooks/client";

const View = () => {
  const { view, loadCampaign } = useContext(VotingSystemContext);
  const [campaignID, setCampaignID] = useState();
  const [startTime, setStartTime] = useState();
  const [endTIme, setEndTime] = useState();
  const [totalVoters, setTotalVoters] = useState();

  const viewCampaign = (campaignID) => {
    view(campaignID);

    if (loadCampaign) {
      const startDateUnixTimestamp = loadCampaign[4].toNumber();
      console.log(startDateUnixTimestamp);

      //convert timme to milisecond
      const startDate = new Date(startDateUnixTimestamp);

      //getting date and time components as string
      const year = startDate.getFullYear();
      const month = ("0" + (startDate.getMonth() + 1)).slice(-2);
      const day = ("0" + (startDate.getDay() + 1)).slice(-2);
      const hours = ("0" + (startDate.getHours() + 1)).slice(-2);
      const minutes = ("0" + (startDate.getMinutes() + 1)).slice(-2);
      const seconds = ("0" + (startDate.getSeconds() + 1)).slice(-2);

      const formatedStartTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      setStartTime(formatedStartTime);

      //END TIME
      const endDateUnixTimestamp = loadCampaign[5].toNumber();
      console.log(endDateUnixTimestamp);

      //convert timme to milisecond
      const endDate = new Date(endDateUnixTimestamp);

      //getting date and time components as string
      const endYear = endDate.getFullYear();
      const endMonth = ("0" + (endDate.getMonth() + 1)).slice(-2);
      const endDay = ("0" + (endDate.getDay() + 1)).slice(-2);
      const endHours = ("0" + (endDate.getHours() + 1)).slice(-2);
      const endMinutes = ("0" + (endDate.getMinutes() + 1)).slice(-2);
      const endSeconds = ("0" + (endDate.getSeconds() + 1)).slice(-2);

      const formatedEndTime = `${endDay}-${endMonth}-${endYear} ${endHours}:${endMinutes}:${endSeconds}`;
      setEndTime(formatedEndTime);

      //Total Vote Cast
      const totalVoters = loadCampaign[6].toNumber();
      setTotalVoters(totalVoters);
    }
  };

  useEffect(() => {}, [loadCampaign]);

  return (
    <div className={Style.View}>
      <div className={Style.View_box}>
        <div className={Style2.Vote_box}>
          <div className={Style2.Vote_box_form}>
            <label>
              Enter CampaignID:
              <input
                type="number"
                onChange={(e) => setCampaignID(e.target.value)}
                placeholder="Enter Campaign ID"
              />
            </label>
            <button
              className={Style2.Vote_box_btn}
              onClick={() => viewCampaign(campaignID)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Campaign Detail*/}
        {loadCampaign ? (
          <div className={Style.View_box_campaignDetails}>
            <h3>{loadCampaign[1]}</h3>
            <p>Campaign ID:{campaignID} </p>
            <p>Campaign Chairperson:{loadCampaign[0]} </p>
            <p>Start: {startTime}</p>
            <p>End: {endTIme} </p>
            <p>Total Vote Cast: {totalVoters} </p>
            <p>
              Winner: {loadCampaign[7] ? loadCampaign[7] : "No Winner Yet"}{" "}
            </p>
            <Image
              className={Style.View_box_campaignDetails_img}
              src={winnerImg}
              alt="Winner Image"
              width={200}
              height={200}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default View;
