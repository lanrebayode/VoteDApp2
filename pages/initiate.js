import InitiateForm from "@/Components/InitiateForm/InitiateForm";
import NavBar from "@/Components/NavBar/NavBar";
import React, { useState, useContext, useEffect } from "react";
import Style from "../styles/initiate.module.css";

import { VotingSystemContext } from "@/Hooks/client";

const initiate = () => {
  const { getTotalCampaignID, initiate } = useContext(VotingSystemContext);

  useEffect(() => {
    console.log("gd");
    getTotalCampaignID();
  }, []);
  return (
    <div className={Style.initiate}>
      <NavBar />
      <InitiateForm />
    </div>
  );
};

export default initiate;
