import React, { useContext, useEffect, useState } from "react";
import Style from "./InitiateForm.module.css";

import { VotingSystemContext } from "@/Hooks/client";

const CandidateInput = () => {
  const {
    uploadToIPFS,
    ipfsUrl,
    addCandidate,
    candidatesLength,
    checkCandidates,
  } = useContext(VotingSystemContext);
  //Candidates Details
  const [campaignID, setCampaignID] = useState();
  const [candidateName, setCandidateName] = useState("");
  const [candidateImg, setCandidateImg] = useState("");
  const [candidateIndex, setCandidateIndex] = useState();

  const handleImageUpload = async (file) => {
    //const imgFile = file.target.files[0];
    setCandidateImg(file.target.files[0]);
    console.log(candidateImg);
    // await uploadToIPFS(imgFile);
  };

  const handleSubmit = async () => {
    await uploadToIPFS(candidateImg).then((url) =>
      addCandidate(campaignID, candidateName, url, candidateIndex)
    );
    // uploadToIPFS((url) =>
    //   addCandidate(campaignID, candidateName, url, candidateIndex)
    // );
    // await handleImageUpload();
    // addCandidate(campaignID, candidateName, candidateImg, candidateIndex);
  };

  useEffect(() => {
    //checkCandidates(campaignID, candidateIndex);

    console.log(campaignID, candidateIndex);
  }, []);
  return (
    <div className={Style.InitiateForm}>
      <div className={Style.InitiateForm_box}>
        {/* Candidate addition */}
        <h3>Add Candidates/Options To a Campaign</h3>
        <div className={Style.candidateBox}>
          {" "}
          <div className={Style.candidate_id}>
            {" "}
            <label className={Style.InitiateForm_box_form_label}>
              Campaign ID:
              <input
                className={Style.InitiateForm_box_form_time}
                type="number"
                onChange={(e) => setCampaignID(e.target.value)}
              />
            </label>
            <label className={Style.InitiateForm_box_form_label}>
              Candidate Index:
              <input
                className={Style.InitiateForm_box_form_time}
                type="number"
                onChange={(e) => setCandidateIndex(e.target.value)}
              />
            </label>
          </div>
          <div className={Style.candidate}>
            <div className={Style.InitiateForm_box_form_name}>
              {" "}
              <label className={Style.InitiateForm_box_form_label}>
                Candidates Name
              </label>
              <input
                className={Style.InitiateForm_box_form_input}
                type="text"
                placeholder="Enter Candidate name"
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>
            <div className={Style.candidate_img}>
              <label className={Style.InitiateForm_box_form_label}>
                Add Image
                <input
                  type="file"
                  name="cadidate Image"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>
        <button
          className={Style.InitiateForm_box_form_btn}
          type="submit"
          onClick={handleSubmit}
        >
          Add Candidate
        </button>
      </div>
    </div>
  );
};

export default CandidateInput;
