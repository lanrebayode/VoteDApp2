const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  Contract,
} = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("VotingSystemV1", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVotingSystem() {
    const [owner, otherAccount] = await ethers.getSigners();
    const VoteContract = await ethers.getContractFactory("VotingSystemV1");
    const contract = await VoteContract.deploy();

    return { contract, owner, otherAccount };
  }

  async function startCampaign1() {
    const { contract } = await loadFixture(deployVotingSystem);

    const [campaignOwner, otherElectionAccount] = await ethers.getSigners();

    const campaignName = "Election";
    const isRestricted = true;
    const campaignDuration = 60;
    const startTime = (await time.latest()) + 5; //start in 5sec
    const endTime = (await time.latest()) + 60; //ends 60secs later
    await contract.startCampaign(
      campaignName,
      isRestricted,
      campaignDuration,
      startTime
    );
    return {
      campaignOwner,
      otherElectionAccount,
      campaignDuration,
      campaignName,
      isRestricted,
      startTime,
      endTime,
    };
  }
  describe("StartCampaign", function () {
    it("should increament the campaignID", async function () {
      const { contract } = await loadFixture(deployVotingSystem);
      const { campaignName, campaignOwner } = await loadFixture(startCampaign1);

      expect(await contract.totalCampaignID()).to.equal(1);
      expect(await contract.CampaignByID[1].chairperson).to.equal(
        campaignOwner
      );
    });
  });
});
