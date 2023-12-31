import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCampaign = ({ token }) => {
  const [campaignName, setCampaignName] = useState("");
  const [fundGoal, setFundGoal] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailDesc, setDetailDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [campaignImageLink, setCampaignImageLink] = useState("");
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState({
    campaignName: "",
    fundGoal: 0,
    campaignType: "",
    shortDesc: "",
    detailDesc: "",
    campaignImageLink: "",
    owner: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/campaign/${campaignId}`,
          {
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: token,
            }),
            method: "GET",
          }
        );

        if (response.status === 200) {
          const result = await response.json();
          setCampaign(result.campaign);
        } else {
          console.log("Campaign not found");
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchData();
  }, [campaignId, token]);

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();

    try {
      if (!campaign) {
        console.error("Campaign data is undefined or null.");
        return;
      }
      const getS3Link = async () => {
        try {
          const file = imageFile;

          // Fetch to the server to get the S3 link
          const res = await fetch(
            "http://localhost:4000/campaign/campaignimage/makeurl",
            {
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: token,
              }),
              method: "POST",
            }
          );

          const response = await res.json();
          const url = response.url;

          // Fetch to S3 to upload the image
          await fetch(url, {
            method: "PUT",
            headers: new Headers({
              "Content-Type": "multipart/form-data",
            }),
            body: file,
          });

          // Extract the image URL from the S3 link
          const campaignImageLink = url.split("?")[0];

          return campaignImageLink;
        } catch (error) {
          console.error("Error getting S3 link:", error);

          return null;
        }
      };

      const response = await fetch(
        `http://localhost:4000/campaign/update/${campaignId}`,
        {
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: token,
          }),
          method: "PUT",
          body: JSON.stringify({
            campaignName: campaign.campaignName,
            fundGoal: campaign.fundGoal,
            campaignType: campaign.campaignType,
            shortDesc: campaign.shortDesc,
            detailDesc: campaign.detailDesc,
            campaignImageLink: campaign.campaignImageLink,
            owner: campaign.owner,
          }),
        }
      );
      const results = await response.json();
      if (response.status === 200) {
        console.log("Campaign updated successfully");
        navigate(`/campaign`, {
          state: { campaignId: results.updatedCampaign._id },
        });
      } else {
        console.log("Failed to update campaign");
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  return (
    <div className="p-5 sm:p-0">
      <div className="flex flex-col items-center justify-center overflow">
        <div className="w-full max-w-md bg-cyan-900 rounded-xl shadow-md py-8 px-8 md:mt-40">
          <h2 className="text-[28px] font-bold text-white mb-6 text-center">
            Edit Campaign
          </h2>
          <form className="flex flex-col" onSubmit={handleUpdateCampaign}>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="campaignName"
              >
                Campaign Name
              </label>
              <input
                className="w-full bg-teal-50 text-cyan-800 font-bold border-0 rounded-md p-2 mb-4 focus:bg-teal-100 focus:outline-none transition ease-in-out duration-150 placeholder-cyan-900"
                id="campaignName"
                type="text"
                placeholder="Enter your campaign name"
                value={campaign.campaignName}
                onChange={(e) =>
                  setCampaign({ ...campaign, campaignName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="fundraisingGoal"
              >
                Fundraising Goal ($)
              </label>
              <input
                className="w-full bg-teal-50 text-cyan-900 font-bold border-0 rounded-md p-2 mb-4 focus:bg-teal-100 focus:outline-none transition ease-in-out duration-150 placeholder-cyan-900"
                id="fundraisingGoal"
                type="number"
                placeholder="Enter your fundraising goal"
                value={campaign.fundGoal}
                onChange={(e) =>
                  setCampaign({ ...campaign, fundGoal: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="campaignType"
                className="block text-white text-sm font-bold mb-2"
              >
                Select an Option
              </label>
              <select
                className="w-full bg-teal-50 text-cyan-900 font-bold border-0 rounded-md p-2 mb-4 focus:bg-teal-100 focus:outline-none transition ease-in-out duration-150 placeholder-cyan-900"
                id="campaignType"
                name="dropdown"
                value={campaign.campaignType}
                onChange={(e) =>
                  setCampaign({ ...campaign, campaignType: e.target.value })
                }
              >
                <option value="Select">Select an Option</option>
                <option value="Medical">Medical</option>
                <option value="Memorial">Memorial</option>
                <option value="Emergency">Emergency</option>
                <option value="Non-profit">Nonprofit</option>
                <option value="Financial Emergency">Financial Emergency</option>
                <option value="Animals">Animals</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="shortDesc"
              >
                Short Description
              </label>
              <input
                className="w-full bg-teal-50 text-cyan-900 font-bold border-0 rounded-md p-2 mb-4 focus:bg-teal-100 focus:outline-none transition ease-in-out duration-150 placeholder-cyan-900"
                id="shortDesc"
                type="text"
                placeholder="Short Description Here"
                value={campaign.shortDesc}
                onChange={(e) =>
                  setCampaign({ ...campaign, shortDesc: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="detailedDesc"
              >
                A Detailed Description
              </label>
              <textarea
                className="w-full h-40 bg-teal-50 text-cyan-900 font-bold border-0 rounded-md p-2 mb-4 focus:bg-teal-100 focus:outline-none transition ease-in-out duration-150 placeholder-cyan-900"
                id="detailedDesc"
                placeholder="Details Here"
                value={campaign.detailDesc}
                onChange={(e) =>
                  setCampaign({ ...campaign, detailDesc: e.target.value })
                }
              />
            </div>
            
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-0"
                htmlFor="pic"
              >
                Upload Photo
              </label>
              
              <div className="bg-teal-50 text-cyan-900 font-bold border-0 rounded-md p-2 mt-4 mb-4 focus:bg-teal-100 focus:outline-none transition ease-in-out duration-150 placeholder-cyan-900">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full h-auto mb-4"
                  />
                )}
                <div className="flex items-center justify-center overflow-y">
                  <label className="relative cursor-pointer bg-teal-700 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-500 transition ease-in duration-200">
                    {imageFile
                      ? "File Chosen: " + imageFile.name
                      : "Choose a file"}
                    <input
                      name="file"
                      type="file"
                      onChange={(e) => {
                        setImageFile(e.target.files[0]);
                        setSelectedImage(
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="button"
                    className="bg-cyan-600  text-white font-medium py-2 px-4 rounded-md hover:bg-cyan-700 transition ease-in duration-200 ml-12"
                  >
                    Save Photo
                  </button>
                </div>
              </div>
            </div>
            <button
              className="bg-teal-500 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-600 transition ease-in duration-200"
              type="submit"
            >
              Update Campaign
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCampaign;
