'use client';
import { useStateContext } from '@/state/AppContext';
// import { Web5 } from '@web5/api';
import React, { useContext, useEffect, useState } from 'react';
// import protocolDefinition from '@/protocols/profileProtocol.json';
import protocolDefinition from '@/protocols/healthRecord.json';
import { useRouter } from 'next/navigation';
const ProfilePage = () => {
	const router = useRouter();
	const { web5, myDid, userRole, getUser, isGettingUser } = useStateContext();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [userRecord, setUserRecord] = useState(null);
	const existingDid = localStorage.getItem('myDid');
	const [userInfo, setUserInfo] = useState([]);
	const [user, setUser] = useState({
		name: '',
		email: '',
		address: '',
		phoneNumber: '',
		gender: '',
		dateOfBirth: '',
		maritalStatus: '',
		nationality: '',
		stateOfOrigin: '',
		city: '',
		role: '',
	});
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUser({ ...user, [name]: value });
	};
	useEffect(() => {
		if (userRole) {
			router.push(`/${userRole}/overview`);
		}
	});
	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		try {
			console.log('running');
			const userInfoProtocol = protocolDefinition;
			const userData = {
				personalInfo: {
					// '@type': 'userInfo',
					name: user.name,
					email: user.email,
					address: user.address,
					phoneNumber: user.phoneNumber,
					gender: user.gender,
					dateOfBirth: user.dateOfBirth,
					maritalStatus: user.maritalStatus,
					nationality: user.nationality,
					stateOfOrigin: user.stateOfOrigin,
					city: user.city,
					role: user.role,
				},
			};
			const { record, status } = await web5.dwn.records.create({
				data: userData,
				message: {
					protocol: userInfoProtocol.protocol,
					protocolPath: 'patientInfo',
					schema: userInfoProtocol.types.patientInfo.schema,
					recipient: myDid,
				},
			});
			setUserRecord(record);
			if (status.code === 200) {
				// getUser();
			}
			const { status: myDidStatus } = await record.send(myDid);
			console.log('status of online dwd >', myDidStatus);
		} catch (error) {
			console.log(error);
		}
	};
	if (isLoading) {
		return (
			<div className='h-screen w-full flex justify-center items-center'>
				<p className='text-xl'>Loading..</p>
			</div>
		);
	}
	if (isGettingUser) {
		return (
			<div className='h-screen w-full flex justify-center items-center'>
				<p className='text-xl'>Getting Your information..</p>
			</div>
		);
	}
	return (
		<div className='p-6'>
			<form onSubmit={handleSubmit}>
				<h1 className='font-[500] text-[2rem] leading-[2.5rem] text-[#151515] tracking-[0.04rem] mb-[2rem]'>
					User Profile
				</h1>
				<div className={`grid gap-x-4 grid-cols-2`}>
					<div className={`w-full`}>
						<label>
							Name:
							<input
								type='text'
								name='name'
								value={user.name}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
					<div className={`w-full`}>
						<label>
							Email:
							<input
								type='email'
								name='email'
								value={user.email}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
				</div>
				<div className={`grid gap-x-4 grid-cols-2 mt-4`}>
					<div className={`w-full`}>
						<label>
							User&rsquo;s Role:
							<select
								name='role'
								value={user.role}
								onChange={handleInputChange}
								required
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							>
								<option>Select Your Role</option>
								<option value='doctor'>Doctor</option>
								<option value='patient'>Patient</option>
							</select>
						</label>
					</div>
					<div className={`w-full`}>
						<label>
							Address:
							<input
								type='text'
								name='address'
								value={user.address}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
				</div>
				<div className={`grid gap-x-4 grid-cols-2 mt-4`}>
					<div className={`w-full`}>
						<label>
							Phone Number:
							<input
								type='tel'
								name='phoneNumber'
								value={user.phoneNumber}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
					<div className={`w-full`}>
						<label>
							Gender:
							<select
								name='gender'
								value={user.gender}
								onChange={handleInputChange}
								required
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							>
								<option>Select Gender</option>
								<option value='male'>Male</option>
								<option value='female'>Female</option>
								<option value='other'>Other</option>
							</select>
						</label>
					</div>
				</div>
				<div className={`grid gap-x-4 grid-cols-2 mt-4`}>
					<div className={`w-full`}>
						<label>
							Date of Birth:
							<input
								type='date'
								name='dateOfBirth'
								value={user.dateOfBirth}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
					<div className={`w-full`}>
						<label>
							State Of Origin:
							<input
								type='text'
								name='stateOfOrigin'
								value={user.stateOfOrigin}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
				</div>
				<div className={`grid gap-x-4 grid-cols-2 mt-4`}>
					<div className={`w-full`}>
						<label>
							City:
							<input
								type='text'
								name='city'
								value={user.city}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
					<div className={`w-full`}>
						<label>
							Nationality:
							<input
								type='text'
								name='nationality'
								value={user.nationality}
								onChange={handleInputChange}
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							/>
						</label>
					</div>
				</div>
				<div className={`grid gap-x-4 grid-cols-2 mt-4`}>
					<div className={`w-full`}>
						<label>
							Marital Status:
							<select
								name='maritalStatus'
								value={user.maritalStatus}
								onChange={handleInputChange}
								required
								className={`w-full p-2 rounded-md border border-gray-300 focus:border-blue-500`}
							>
								<option>Select Your Marital Status</option>
								<option value='married'>Married</option>
								<option value='single'>Single</option>
							</select>
						</label>
					</div>
				</div>
				<div className='flex justify-center mt-[4rem]'>
					<button
						className='text-white rounded-md px-5 py-3 bg-primaryBlue'
						type='submit'
					>
						Create Update
					</button>
				</div>
			</form>
			{/*
			<div className='my-5'>
				{userInfo &&
					userInfo.map((user) => {
						return (
							<div className='' key={user.id}>
								{/* <p>username: {user.data.name}</p> *
								<p>userEmail: {user.data.email}</p>
							</div>
						);
					})}
				<div className='flex justify-center'>
					<button
						onClick={getUser}
						className='bg-purple-500 px-5 py-3'
						type='submit'
					>
						Fetch user record
					</button>
				</div>
			</div> */}
		</div>
	);
};

export default ProfilePage;