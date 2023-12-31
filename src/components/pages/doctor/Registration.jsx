"use client";
import CustomInput from "@/components/common/CustomInput";
import React, { useState, useEffect, useCallback } from "react";
import protocolDefinition from "@/protocols/healthRecord.json";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/state/AppContext";
import CustomModal from "@/components/common/CustomModal";
import { generateUUID } from "@/utils/utilities";
import { collection, addDoc } from "firebase/firestore";
import { app, database } from "@/service/firebaseConfig";
import useWeb5 from "@/state/useWeb5";
const Registration = () => {
  const dbInstance = collection(database, "doctorDid");
  const router = useRouter();
  const { web5, myDid, initWeb5 } = useWeb5();
  const { userRole, setUserRecord } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isGettingUser, setIsGettingUser] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState([]);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    nationality: "",
    stateOfOrigin: "",
    city: "",
  });
  const [formEdited, setFormEdited] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [careerInfo, setCareerInfo] = useState({
    specialty: "",
    yearOfExperience: "",
    numberOfCases: "",
    failedCases: "",
    successCases: "",
  });

  const handleUserInputChange = (fieldName, value) => {
    setUser((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    setFormEdited(true);
  };
  const handleCareerInputChange = (fieldName, value) => {
    setCareerInfo((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    setFormEdited(true);
  };

  const validate = () => {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.address === "" ||
      user.phoneNumber === "" ||
      user.gender === "" ||
      user.dateOfBirth === "" ||
      user.maritalStatus === "" ||
      user.nationality === "" ||
      user.stateOfOrigin === "" ||
      user.city === "" ||
      careerInfo.yearOfExperience === "" ||
      careerInfo.specialty === "" ||
      careerInfo.numberOfCases === "" ||
      careerInfo.failedCases === "" ||
      careerInfo.successCases === ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getUser = useCallback(async () => {
    setIsGettingUser(true);
    try {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.doctorInfo.schema,
          },
        },
      });

      // console.log(records);
      // add entry to userInfo
      for (let record of records) {
        const data = await record.data.json();
        const list = { record, data, id: record.id };
        setDoctorInfo((user) => {
          if (!user.some((item) => item.id === list.id)) {
            return [...user, list];
          }
          return user;
        });
      }
      if (doctorInfo.length > 0) {
        setUser({
          firstName: doctorInfo[0].data.personalInfo.firstName || "",
          lastName: doctorInfo[0].data.personalInfo.lastName || "",
          email: doctorInfo[0].data.personalInfo.email || "",
          address: doctorInfo[0].data.personalInfo.address || "",
          phoneNumber: doctorInfo[0].data.personalInfo.phoneNumber || "",
          gender: doctorInfo[0].data.personalInfo.gender || "",
          dateOfBirth: doctorInfo[0].data.personalInfo.dateOfBirth || "",
          maritalStatus: doctorInfo[0].data.personalInfo.maritalStatus || "",
          nationality: doctorInfo[0].data.personalInfo.nationality || "",
          stateOfOrigin: doctorInfo[0].data.personalInfo.stateOfOrigin || "",
          city: doctorInfo[0].data.personalInfo.city || "",
        });
        setCareerInfo({
          yearOfExperience:
            doctorInfo[0].data.careerInfo.yearOfExperience || "",
          specialty: doctorInfo[0].data.careerInfo.specialty || "",
          numberOfCases: doctorInfo[0].data.careerInfo.numberOfCases || "",
          failedCases: doctorInfo[0].data.careerInfo.failedCases || "",
          successCases: doctorInfo[0].data.careerInfo.successCases || "",
        });
        // set the create mode to false if the user has already created account, this will enable to know if we are updating the record or we are creating a record
        setIsCreateMode(false);
      }
      if (records) {
        setIsGettingUser(false);
      }
    } catch (error) {
      console.log("error getting user", error);
    }
  }, [web5, doctorInfo]);
  useEffect(() => {
    if (web5) getUser();
  }, [getUser, web5]);

  const handleCreate = async () => {
    try {
      const storedRole = localStorage.getItem("role");
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const userInfoProtocol = protocolDefinition;
      addDoc(dbInstance, {
        did: myDid,
      });
      const doctorInfo = {
        role: storedRole,
        personalInfo: user,
        careerInfo: careerInfo,
        createdDate: currentDate,
        createdTime: currentTime,
        doctorDId: myDid,
        userId: generateUUID(),
      };
      const { record, status } = await web5.dwn.records.create({
        data: doctorInfo,
        message: {
          protocol: userInfoProtocol.protocol,
          protocolPath: "doctorInfo",
          schema: userInfoProtocol.types.doctorInfo.schema,
          recipient: myDid,
        },
      });
      setUserRecord(record);
      // console.log(status);
      if (status.code === 202) {
        getUser();
        setIsLoading(false);
        setSuccessModal(true);
        setFormEdited(false);
      }
      const { status: myDidStatus } = await record.send(myDid);
      // console.log("status of online dwd >", myDidStatus);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async () => {
    //Query records with plain text data format
    try {
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const recordId = doctorInfo[0].id;
      const storedRole = localStorage.getItem("role");
      const updatedDoctorInfo = {
        role: storedRole,
        personalInfo: user,
        careerInfo: careerInfo,
        updatedDate: currentDate,
        updatedTime: currentTime,
      };

      // Get the record
      const { record } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: recordId,
          },
        },
      });

      // Update the record
      const { status } = await record.update({ data: updatedDoctorInfo });

      // console.log(status);
      if (status.code === 202) {
        // getUser();
        setIsLoading(false);
        setSuccessModal(true);
        setFormEdited(false);
      }
    } catch (error) {
      console.error("unable to update record", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isCreateMode) {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  const isFormDisabled = !formEdited || validate();
  if (isLoading) {
    return (
      <div className="h-screen w-screen absolute top-0 left-0 right-0 bottom-0 bg-black/5">
        {/* <p className="text-xl">Getting Your information..</p> */}
      </div>
    );
  }
  return (
    <div>
      <h1 className="font-[500] text-[2rem] leading-[2.5rem] text-[#151515] tracking-[0.04rem] my-[2.5rem]">
        Update Your Profile
      </h1>
      <div className="w-[10.75rem] h-[10.75rem] py-[2.4375rem] px-[2.5rem] flex justify-center items-center rounded-[1.125rem] bg-[#f2f2f2] mb-[2.5rem]">
        {" "}
        <img src="/images/user.svg" alt="user placeholder" className="" />
      </div>
      <p className="text-[1.25rem] text-primaryBlue leading-[1.75rem] font-[500] tracking-[0.025rem] mb-[1.5rem]">
        Personal Information
      </p>
      <form className="w-[51.25rem]" onSubmit={handleSubmit}>
        <div className="">
          <div className="grid grid-cols-2 gap-x-[1.25rem]">
            <CustomInput
              label="First name"
              value={user.firstName}
              onChange={(value) => handleUserInputChange("firstName", value)}
            />
            <CustomInput
              label="Last name"
              value={user.lastName}
              onChange={(value) => handleUserInputChange("lastName", value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-x-[1.25rem]">
            <CustomInput
              label="Date of Birth"
              value={user.dateOfBirth}
              onChange={(value) => handleUserInputChange("dateOfBirth", value)}
              type="date"
            />
            <CustomInput
              label="Gender"
              type="select"
              options={[
                { label: "Select Gender", value: "" },
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
              value={user.gender}
              onChange={(value) => handleUserInputChange("gender", value)}
            />
            <CustomInput
              label="Marital status"
              type="select"
              options={[
                { label: "Select Marital Status", value: "" },
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
                { label: "Other", value: "other" },
              ]}
              value={user.maritalStatus}
              onChange={(value) =>
                handleUserInputChange("maritalStatus", value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-x-[1.25rem]">
            <CustomInput
              label="Phone number"
              value={user.phoneNumber}
              onChange={(value) => handleUserInputChange("phoneNumber", value)}
              type="tel"
            />
            <CustomInput
              label="Email address"
              value={user.email}
              onChange={(value) => handleUserInputChange("email", value)}
              type="email"
            />
          </div>
          <div className="grid grid-cols-4 gap-x-[1.25rem]">
            <CustomInput
              label="Home address"
              value={user.address}
              onChange={(value) => handleUserInputChange("address", value)}
            />
            <CustomInput
              label="City"
              value={user.city}
              onChange={(value) => handleUserInputChange("city", value)}
            />
            <CustomInput
              label="State"
              value={user.stateOfOrigin}
              onChange={(value) =>
                handleUserInputChange("stateOfOrigin", value)
              }
            />
            {/* <CountrySelect
              label="Country"
              onChange={(value) => setSelectedCountry(value)}
            /> */}
            <CustomInput
              label="Nationality"
              value={user.nationality}
              onChange={(value) => handleUserInputChange("nationality", value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[1.25rem] text-primaryBlue leading-[1.75rem] font-[500] tracking-[0.025rem] mb-[1.5rem]">
            Career Information
          </p>
          <div className="grid grid-cols-2 gap-x-[1.25rem]">
            <CustomInput
              label="Specialty"
              value={careerInfo.specialty}
              onChange={(value) => handleCareerInputChange("specialty", value)}
            />

            <CustomInput
              label="Year of experience"
              value={careerInfo.yearOfExperience}
              onChange={(value) =>
                handleCareerInputChange("yearOfExperience", value)
              }
            />
          </div>
          <div className="grid grid-cols-4 gap-x-[1.25rem]">
            <div className="col-span-2">
              <CustomInput
                label="Number of Cases"
                value={careerInfo.numberOfCases}
                onChange={(value) =>
                  handleCareerInputChange("numberOfCases", value)
                }
              />
            </div>
            <CustomInput
              label="Failed Cases"
              value={careerInfo.failedCases}
              onChange={(value) =>
                handleCareerInputChange("failedCases", value)
              }
              type="tel"
            />
            <CustomInput
              label="Success Case"
              value={careerInfo.successCases}
              onChange={(value) =>
                handleCareerInputChange("successCases", value)
              }
              type="tel"
            />
          </div>
        </div>
        <div className="flex justify- mt-[4rem]">
          <button
            type="submit"
            className="w-[15.25rem] py-[0.5rem] px-4 rounded-[0.25rem] bg-primaryBlue text-white flex justify-center items-center font-[500] leading-6 tracking-[0.02rem disabled:bg-[#DCE6FB]"
            disabled={isFormDisabled}
          >
            {/* {isLoading ? "Saving..." : "Save Changes"} */}
            {isCreateMode
              ? "Create Profile"
              : "Save Changes" || (isLoading && "Saving...")}
          </button>
        </div>
      </form>
      <CustomModal modalIsOpen={successModal} setIsOpen={setSuccessModal}>
        <div className="py-[2.5rem] px-[3.62rem] relative w-full h-full">
          <p className="font-[600] text-[1.25rem] leading-[2.375rem] text-[#2E3646] text-center mb-8">
            Success
          </p>
          <p className="my-[2rem] font-[400] text-[0.875rem] leading-[1.5rem] text-[#5F6D7E] text-center">
            Your profile changes has been saved.
          </p>
          <div className="flex flex-col items-center gap-6 justify-center ">
            <button
              className="w-[14.125rem] py-[0.5rem] px-4 rounded-[0.25rem] bg-primaryBlue text-white flex justify-center items-center font-[500] leading-6 tracking-[0.02rem disabled:bg-[#DCE6FB]"
              onClick={() => {
                // setSuccessModal(false);
                window.location.reload();
              }}
            >
              Done
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default Registration;
