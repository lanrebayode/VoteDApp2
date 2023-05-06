import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Style from "./Vote.module.css";
import candidate from "../../public/candidate.jpg";

import { VotingSystemContext } from "@/Hooks/client";
import loadingGif from "../../public/loading.gif";

const Vote = () => {
  const { getTotalCandidates, checkCandidates, view, loadCampaign, vote } =
    useContext(VotingSystemContext);
  const [campaignID, setCampaignID] = useState(0);
  const [candidatesArray, setCandidatesArray] = useState([]);
  const [loading, setLoading] = useState(false);

  let totalCandidates;
  let eachCandidates;
  let candidates = [];

  const handleSubmit = async (campaignID) => {
    setLoading(true);
    // const timeOut = setTimeout(() => {
    //   alert("taking too long to load data, please check your network");
    // }, 10000);
    totalCandidates = getTotalCandidates(campaignID).then((totalCandidates) => {
      for (let i = 0; i < totalCandidates; i++) {
        console.log(totalCandidates);
        async function data() {
          console.log("E reach");
          const campaign = view(campaignID);
          const candidateData = await checkCandidates(campaignID, i);
          const candidateName = candidateData[0];
          const candidateId = candidateData[1].toNumber();
          const candidateImg = candidateData[2];
          const candidateVoteCount = candidateData[3].toNumber();
          const candidatePosition = candidateData[4].toNumber();
          const candidateObject = {
            name: `${candidateName}`,
            id: `${candidateId}`,
            imageUrl: `${candidateImg}`,
            voteCount: `${candidateVoteCount}`,
          };
          let array = [];
          array.push(candidateObject);
          candidates.push(candidateObject);
          setCandidatesArray(candidates);
          console.log(candidateId);
          return candidateData;
        }
        data();
      }
    });
  };
  console.log(totalCandidates);

  const handleVote = async (campaignID, candidateId) => {
    console.log(candidateId);
    vote(campaignID, candidateId);
  };

  console.log("candidatesArray", candidatesArray);
  console.log("Candidate1", candidatesArray[0]);
  console.log("CandiatesArrayLength:", candidatesArray.length);

  useEffect(() => {
    //const candidateData = checkCandidates(campaignID, 1);
    setLoading(false);
  }, [candidatesArray]);

  return (
    <div className={Style.Vote}>
      <div className={Style.Vote_box}>
        <div className={Style.Vote_box_form}>
          <label>
            Enter CampaignID:
            <input
              type="number"
              onChange={(e) => setCampaignID(e.target.value)}
              placeholder="Enter Campaign ID"
            />
          </label>
          <button
            className={Style.Vote_box_btn}
            onClick={() => handleSubmit(campaignID)}
          >
            Search
          </button>
        </div>
      </div>

      {loadCampaign && !loading && candidatesArray.length > 0 ? (
        <div className={Style.Vote_voteDisplay}>
          <h2>{loadCampaign[1]}</h2>
          <div className={Style.Vote_voteDisplayTab}>
            {candidatesArray.map((el, i) => (
              <div
                className={Style.Vote_voteDisplay_option}
                el={el}
                key={i + 1}
              >
                <h4>{candidatesArray[i].name}</h4>
                <Image
                  className={candidatesArray[i].i}
                  src={candidate}
                  alt="candidate Image"
                  width={200}
                  height={200}
                />
                <br />
                <button
                  className={Style.Vote_voteDisplay_option_btn}
                  onClick={() => handleVote(campaignID, i + 1)}
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}

      {loading ? (
        <div className={Style.loading}>
          <Image
            className={Style.loadingImg}
            src={loadingGif}
            alt="loading gif"
            width={100}
            height={100}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Vote;
