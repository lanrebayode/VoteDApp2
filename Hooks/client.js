import React, { useState, useEffect, useContext, createContext } from "react";
import { ethers } from "ethers";
import Router, { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { base64 } from "ethers/lib/utils.js";
import { getContract, getProvider, goerli } from "@wagmi/core";
import { Wallet } from "ethers";

//import { Network, Alchemy, Wallet, ContractFactory } from "alchemy-sdk";

import {
  VotingSystemAddress,
  VotingSystemABI,
  VotingSystemByteCode,
  PRIVATEKEY,
} from "./constants";

//SETTING IPFS VARIALES
const projectID = "2LWUEG6JFlknkH2Ve2z4qZeLT7D";
const projectSecetKey = "5effcb36f69f0ac5bf8e2f14ce764b78";
const auth = `Basic ${Buffer.from(`${projectID}:${projectSecetKey}`).toString(
  "base64"
)}`;

const subDomain = "lanre-nft-marketplace.infura-ipfs.io";

//IPFS_CLIENT
const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: { authorization: auth },
});

//let wallet = new Wallet(PRIVATEKEY, alchemy);
const ALCHEMY_ID = "6fkLLSLHmiQzd943SK9A4kNEUcr1dvTf";
const networkUrl =
  "https://eth-sepolia.g.alchemy.com/v2/6fkLLSLHmiQzd943SK9A4kNEUcr1dvTf";
const provider = new ethers.providers.JsonRpcProvider(networkUrl);
const signer = new ethers.Wallet(PRIVATEKEY, provider);
const contracto = new ethers.Contract(
  VotingSystemAddress,
  VotingSystemABI,
  signer
);

console.log(contracto);

//Using Context to make SC functions available to every part of the App
export const VotingSystemContext = React.createContext();

export const VotingSystemProvider = ({ children }) => {
  const [loadCampaign, setLoadCampaign] = useState();
  const [candidates, setCandidates] = useState([]);
  const [candidatesLength, setCandidatesLength] = useState();
  const [newCampaignID, setNewCampaignId] = useState();

  //GETTING TOTAL CAMPAIGNID
  const getTotalCampaignID = async () => {
    const campaignID = await contracto.totalCampaignID();
    const num = campaignID.toNumber();
    console.log("TotalCampaign:", num);
  };

  //Initiating a Voting Campaign
  const initiate = async (
    campaignName,
    restriction,
    campaignDuration,
    startTime
  ) => {
    if (!campaignName || !campaignDuration || !startTime) {
      alert("Incomplete inpute, please fill all required input.");
    }
    try {
      const gasLimit = ethers.BigNumber.from(33000);
      const transaction = await contracto.startCampaign(
        campaignName,
        restriction,
        campaignDuration,
        startTime
      );
      // Got total campaignLength to calc the next ID
      const x = await contracto.totalCampaignID();
      const y = x.toNumber();
      setNewCampaignId(y + 1);

      contracto.on(
        "StartCampaign",
        (
          name,
          chairperson,
          restriction,
          duration,
          start,
          end,
          totalCampaignID
        ) => {
          const campaignId = totalCampaignID.toNumber();
          console.log("NEWID:", campaignId);
          return campaignId;
        }
      );
      console.log(transaction);

      // alert(
      //   `Successfully Initiated a Campaign, please hold to get your CampaignId`
      // );
    } catch (error) {
      console.log("initiation of Campaign failed", error);
    }
    return newCampaignID;
  };
  console.log("NewCampaignID", newCampaignID);

  //APPROVE SPECIFIC ADDRESS TO VOTE IN A RESTRICTED CAMPAIGN
  const approve = async (campaignID, address) => {
    const gasLimit = ethers.BigNumber.from(50000);
    //convert string to address type
    const addr = ethers.utils.getAddress(address);
    try {
      const transaction = await contracto.approveAddressToVote(
        campaignID,
        addr,
        {
          gasLimit,
        }
      );
      alert(`Successfully Approved ${address} to vote`);
      console.log(transaction);
    } catch (error) {
      console.log(`Error while approving ${address}`, error);
    }
  };

  //VIEW A CAMPAIGN
  const view = async (campaignID) => {
    const campaign = await contracto.CampaignByID(campaignID);
    setLoadCampaign(campaign);
    console.log(campaign);
  };

  //UPLOADING TO IPFS
  const uploadToIPFS = async (file) => {
    try {
      const addFileToIPFS = await client.add({ content: file }); //will generate a unique hash to the file
      const url = `https://${subDomain}/ipfs/${addFileToIPFS.path}`; //turning generated hash into ipfs link
      ipfsUrl = url;
      setCandidateImageHash(url);
      console.log(ipfsUrl);
      //alert(`Image has been added to IPFS Server @ ${url}`);
      console.log(url);
      return url;
    } catch (error) {
      console.log("Unable to upload to IPFS Server");
    }
  };

  //CHECH CANDIDATE IN CAMPAIGN
  const checkCandidates = async (campaignID, candidateID) => {
    console.log("function was called");
    const candidate = await contracto.candidateToCampaignID(
      campaignID,
      candidateID
    );
    //alert("View in Console");
    console.log(candidate);
    return candidate;
  };

  //ADD A CANDIDATE/OPTION
  const addCandidate = async (
    campaignID,
    candidateName,
    imgHash,
    candidateID
  ) => {
    try {
      const transaction = await contracto.addVoteOptions(
        campaignID,
        candidateName,
        imgHash,
        candidateID
      );
      alert(`Successfully added ${candidateName}`);
      console.log(transaction);
    } catch (error) {
      console.log("something went wrong while adding candidate", error);
    }
  };

  //GET ARRAY LENGTH OF CANDIDATES IN A PARTICULAR CAMPAIGN
  const getTotalCandidates = async (campaignID) => {
    let length;
    try {
      const result = await contracto.getCandidatesArrayLength(campaignID);
      const length = result.toNumber();
      console.log(length);
      return length;
    } catch (error) {
      console.log("Unable to get Total Candidates Length", error);
    }
  };

  //VOTING OPERATION
  const vote = async (campaignID, candidateID) => {
    const gasLimit = ethers.BigNumber.from(50000);
    try {
      const transaction = await contracto.vote(campaignID, candidateID, {
        gasLimit,
      });
      console.log("voting successful", transaction);
      alert("Congratulations, you have voted the candidate of your choice");
    } catch (error) {
      console.log("Unable to perform voting operation", error);
    }
  };

  return (
    <VotingSystemContext.Provider
      value={{
        getTotalCampaignID,
        initiate,
        approve,
        view,
        uploadToIPFS,
        addCandidate,
        checkCandidates,
        getTotalCandidates,
        vote,
        loadCampaign,
        candidatesLength,
        newCampaignID,
      }}
    >
      {children}
    </VotingSystemContext.Provider>
  );
};
