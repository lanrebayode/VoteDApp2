import React, { useState, useContext, useEffect } from "react";
import Style from "./InitiateForm.module.css";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { VotingSystemContext } from "@/Hooks/client";
import loadingGif from "../../public/loadinggif.gif";
const InitiateForm = () => {
  const { initiate, approve, newCampaignID } = useContext(VotingSystemContext);

  const [campaignName, setCampaignName] = useState("");
  const [isRestricted, setIsResrticted] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, mins: 0 });
  const [startTime, setStartTime] = useState({ hours: 0, mins: 0 });
  const [address, setAddress] = useState("");
  const [campaignID, setCampaignID] = useState();
  const [ID, setID] = useState();
  const [idReady, setIdReady] = useState(false);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [addressCount, setAddressCount] = useState(0);

  const handleDurationChange = (e) => {
    setDuration({ ...duration, [e.target.name]: e.target.value });
  };
  //calc duration in seconds
  const durationInSec = duration.hours * 3600 + duration.mins * 60;

  const handleStartTimeChange = (e) => {
    setStartTime({ ...startTime, [e.target.name]: e.target.value });
  };
  //calc startTime in seconds
  const startTimeInSec =
    Date.now() + startTime.hours * 3600 + startTime.mins * 60;

  //function will handle how details will be passed to the contract and initiate a campaign
  const handleSubmit = (event) => {
    setLoading(true);
    try {
      initiate(campaignName, isRestricted, durationInSec, startTimeInSec);
      console.log(campaignName);
      console.log(isRestricted);
      console.log(durationInSec);
      console.log(startTimeInSec);
    } catch (error) {}

    setIdReady(true);
    setCampaignID(ID);
  };

  //function will approve address to vote in campaign
  const handleApprove = async (campaignID, address) => {
    setApproveLoading(true);
    approve(campaignID, address);
    setApproved(true);
    setAddressCount(addressCount + 1);

    //TimeOut to make success message dissappear
    setTimeout(() => {
      setApproved(false);
    }, 10000);
  };

  useEffect(() => {
    setLoading(false);
    setApproveLoading(false);
  }, [newCampaignID, addressCount]);

  return (
    <div className={Style.InitiateForm}>
      <div className={Style.InitiateForm_box}>
        <h3>Initiate a Voting Campaign</h3>
        <div className={Style.InitiateForm_box_form}>
          {" "}
          <form onSubmit={handleSubmit}>
            <div className={Style.InitiateForm_box_form_name}>
              {" "}
              <label className={Style.InitiateForm_box_form_label}>
                Campaign Name
              </label>
              <input
                className={Style.InitiateForm_box_form_input}
                type="text"
                placeholder="Enter Polls Tittle"
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div className={Style.InitiateForm_box_form_res}>
              {" "}
              <label className={Style.InitiateForm_box_form_label}>
                Restricted
                <input
                  className={Style.InitiateForm_box_form_check}
                  type="checkbox"
                  checked={isRestricted}
                  onChange={(e) => setIsResrticted(e.target.checked)}
                />
              </label>
            </div>
            <div className={Style.InitiateForm_box_form_duration}>
              {" "}
              <label className={Style.InitiateForm_box_form_label}>
                Duration
              </label>
              <label className={Style.InitiateForm_box_form_Timelabel}>
                Hours:
                <input
                  className={Style.InitiateForm_box_form_time}
                  name="hours"
                  type="number"
                  value={duration.hours}
                  onChange={handleDurationChange}
                />
              </label>
              <label className={Style.InitiateForm_box_form_Timelabel}>
                mins:
                <input
                  className={Style.InitiateForm_box_form_time}
                  name="mins"
                  type="number"
                  value={duration.mins}
                  onChange={handleDurationChange}
                />
              </label>
            </div>

            <div className={Style.InitiateForm_box_form_start}>
              <label className={Style.InitiateForm_box_form_label}>
                Starting In:
              </label>
              <label className={Style.InitiateForm_box_form_Timelabel}>
                Hours:
                <input
                  className={Style.InitiateForm_box_form_time}
                  name="hours"
                  type="number"
                  value={startTime.hours}
                  onChange={handleStartTimeChange}
                />
              </label>
              <label className={Style.InitiateForm_box_form_Timelabel}>
                mins:
                <input
                  className={Style.InitiateForm_box_form_time}
                  name="mins"
                  type="number"
                  value={startTime.mins}
                  onChange={handleStartTimeChange}
                />
              </label>
            </div>
          </form>
          {idReady && (
            <p className={Style.appovalMessage}>
              Your CampaignID:{newCampaignID}
            </p>
          )}
        </div>
        <button
          className={Style.InitiateForm_box_form_btn}
          type="submit"
          onClick={() => handleSubmit()}
        >
          {loading ? (
            <Image src={loadingGif} alt="loading gif" width={20} height={20} />
          ) : (
            "Start Campaign"
          )}
        </button>

        {/* APPROVE ADDRESS TO VOTE FOR RESRICTED CAMPAIGN */}
        <div className={Style.approve}>
          <div className={Style.approveLabel}>
            <label>
              CampaignID:
              <input
                className={Style.campaignIdInput}
                name="campaignID"
                type="number"
                onChange={(e) => setCampaignID(e.target.value)}
              />
            </label>
          </div>
          <br />
          <label className={Style.InitiateForm_box_form_label}>Address</label>
          <input
            className={Style.InitiateForm_box_form_input}
            type="text"
            placeholder="Enter Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          className={Style.InitiateForm_box_form_btn}
          type="submit"
          onClick={() => handleApprove(campaignID, address)}
        >
          {approveLoading ? (
            <Image src={loadingGif} alt="loading gif" width={20} height={20} />
          ) : (
            "Start Campaign"
          )}
        </button>
        {approved && (
          <p className={Style.appovalMessage}>
            {address} has been approved to vote.
          </p>
        )}
      </div>
    </div>
  );
};

export default InitiateForm;
