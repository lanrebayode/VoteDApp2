//SPDX-License-Identifier:MIT

pragma solidity 0.8.18;

contract VotingSystemV1 {
    //EVENTS
    event StartCampaign(
        string name,
        address indexed chairPerson,
        bool restricted,
        uint duration,
        uint startingTime,
        uint endingTime,
        uint totalCampaignID
    );
    //Total count of campaigns initiated
    uint public totalCampaignID;

    //Campaign Data
    struct VotingCampaign {
        address chairPerson;
        string campaignName;
        bool isRestricted;
        uint campaignDuration;
        uint startTime;
        uint endTime;
        uint totalVoters;
        string winner;
        string winnerImageUrl;
    }

    //Campaign ID mapped to VotingCampaign
    mapping(uint => VotingCampaign) public CampaignByID;

    //Options/Candidates Data
    struct Candidate {
        string name;
        uint candidateID;
        string imageUrl;
        uint voteCount;
        uint currentPosition;
    }

    // Candidate[] public candidate;

    //Mapping the Campaign ID to the Candidates
    mapping(uint => Candidate[]) public candidateToCampaignID;

    //Voter Info
    struct Voter {
        address voterAddress;
        bool isAppoved;
        bool voted;
    }

    mapping(uint => mapping(address => bool)) public approvedVoterToCampaignID;
    mapping(uint => mapping(address => bool)) public votedToCampaignID;

    mapping(uint => Voter) public voterToCampaignID;
    Voter[] public voters;

    //FUNCTIONS

    //Start Campaign
    function startCampaign(
        string memory _campaignName,
        bool _isRestricted,
        uint _campaignDuration,
        uint _startTime
    ) public returns (uint _campaignID) {
        require(_campaignDuration > 1, "Duration must be greater than 1second");
        require(_startTime > block.timestamp, "Time has to be future not past");
        VotingCampaign memory votingCampaign = VotingCampaign({
            chairPerson: msg.sender,
            campaignName: _campaignName,
            isRestricted: _isRestricted,
            campaignDuration: _campaignDuration,
            startTime: _startTime,
            endTime: _startTime + _campaignDuration,
            totalVoters: 0,
            winner: "",
            winnerImageUrl: ""
        });

        totalCampaignID += 1;
        CampaignByID[totalCampaignID] = votingCampaign;
        emit StartCampaign(
            _campaignName,
            msg.sender,
            _isRestricted,
            _campaignDuration,
            _startTime,
            _startTime + _campaignDuration,
            totalCampaignID
        );
        return totalCampaignID;
    }

    //Assign Accreditation
    function approveAddressToVote(uint _campaignID, address _voter) public {
        require(
            CampaignByID[_campaignID].chairPerson != address(0),
            "Campaign doen not exist"
        );
        require(_voter != address(0), "Address is not valid");
        require(
            msg.sender == CampaignByID[_campaignID].chairPerson,
            "Only Chairperson of this Campaign can call this function"
        );
        require(
            CampaignByID[_campaignID].isRestricted == true,
            "This Campaign is not restricted"
        );

        if (CampaignByID[_campaignID].isRestricted == true) {
            approvedVoterToCampaignID[_campaignID][_voter] = true;
            voterToCampaignID[_campaignID].isAppoved = true;
        }
    }

    //Add Candidates
    function addVoteOptions(
        uint _campaignID,
        string memory _optionName,
        string memory _imageUrl,
        uint _candidateID
    ) public {
        require(
            msg.sender == CampaignByID[_campaignID].chairPerson,
            "Only Chairperson of Campaign can call this function"
        );

        Candidate memory option = Candidate({
            name: _optionName,
            candidateID: _candidateID,
            imageUrl: _imageUrl,
            voteCount: 0,
            currentPosition: 0
        });
        candidateToCampaignID[_campaignID].push(option);
    }

    //Get Candidates Array Length
    function getCandidatesArrayLength(
        uint _campaignID
    ) public view returns (uint) {
        uint length = candidateToCampaignID[_campaignID].length;
        return length;
    }

    //Compare
    function compareCandidateID(
        uint _campaignID,
        uint _candidateID
    ) internal view returns (bool ans) {
        return
            candidateToCampaignID[_campaignID][_candidateID - 1].candidateID ==
            _candidateID;
    }

    //Voting
    function vote(
        uint _campaignID,
        uint _candidateID
    ) public returns (bool success) {
        require(
            CampaignByID[_campaignID].chairPerson != address(0),
            "Campaign doen not exist"
        ); //check if campaign exist
        require(
            block.timestamp >= CampaignByID[_campaignID].startTime,
            "Yet to start"
        );
        require(
            block.timestamp <= CampaignByID[_campaignID].endTime,
            "Campaign Ended"
        );
        require(
            votedToCampaignID[_campaignID][msg.sender] == false,
            "can't vote more than once"
        );

        if (CampaignByID[_campaignID].isRestricted == true) {
            require(
                approvedVoterToCampaignID[_campaignID][msg.sender] == true,
                "Unauthorized to Vote in this campaign"
            ); //check if voteris eligible
        }

        //Voting Process
        //  keccak256(
        //     bytes(candidateToCampaignID[_campaignID][_candidateIndex].name) ==
        //         keccak256(bytes(_choice))
        // );
        bool choice = compareCandidateID(_campaignID, _candidateID);
        if (choice) {
            candidateToCampaignID[_campaignID][_candidateID - 1].voteCount += 1;
            CampaignByID[_campaignID].totalVoters += 1;
            voterToCampaignID[_campaignID].voted = true;
            votedToCampaignID[_campaignID][msg.sender] = true;
        }
        return true;
    }

    //Delete an Option/Candidate
    function deleteCandidate(uint _campaignID, uint _candidateID) public {
        require(
            _candidateID - 1 < candidateToCampaignID[_campaignID].length,
            "Array OverFloat"
        );
        require(
            CampaignByID[_campaignID].startTime > block.timestamp,
            "Cant perfom this operation after during campaign"
        );
        require(
            msg.sender == CampaignByID[_campaignID].chairPerson,
            "Restricted to Chairperson"
        );
        for (
            uint i = _candidateID - 1;
            i < candidateToCampaignID[_campaignID].length;
            i++
        ) {
            candidateToCampaignID[_campaignID][i] = candidateToCampaignID[
                _campaignID
            ][i + 1];
        }
        candidateToCampaignID[_campaignID].pop();
    }

    //Get Total Voters In a Campaign
    function getTotalVotersInCampaign(
        uint _campaignID
    ) public view returns (uint totalVoters) {
        require(
            CampaignByID[_campaignID].chairPerson != address(0),
            "No such Campaign"
        );
        return CampaignByID[_campaignID].totalVoters;
    }

    function getWinnerOfCampaign(
        uint _campaignID
    ) public returns (string memory _winner) {
        //decided not to restrict it to election chairperwson to assure transparency
        require(
            block.timestamp > CampaignByID[_campaignID].endTime,
            "Campaign is yet to End"
        );
        require(
            block.timestamp > CampaignByID[_campaignID].startTime,
            "Campaign is yet to start"
        );
        uint highestVote;

        //getHighestVote
        for (uint i = 0; i < candidateToCampaignID[_campaignID].length; i++) {
            if (candidateToCampaignID[_campaignID][i].voteCount > highestVote) {
                highestVote = candidateToCampaignID[_campaignID][i].voteCount;
                CampaignByID[_campaignID].winner = candidateToCampaignID[
                    _campaignID
                ][i].name;
                candidateToCampaignID[_campaignID][i].currentPosition = 1;
            }
        }

        return CampaignByID[_campaignID].winner;

        //getCandidtes with the highest number of votes
        //This is done to ensure that in case where more than one option/candidate has the highest vote,
        //more than one winner is gotten, however if only one option got the highest vote, only one winner is sent
        // for (uint i = 0; i < candidateToCampaignID[_campaignID].length; i++) {
        //     if (
        //         candidateToCampaignID[_campaignID][i].voteCount == highestVote
        //     ) {
        //         CampaignByID[_campaignID].winner = candidateToCampaignID[
        //             _campaignID
        //         ][i].name;
        //     }
        //     return candidateToCampaignID[_campaignID][i].name;
        // }
    }
}

//END OF CONTRCT!!!
