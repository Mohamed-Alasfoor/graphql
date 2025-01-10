import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_USER_INFO,
  GEt_Total_XPInKB,
  GET_DETAILED_XP,
  GET_PROJECTS_WITH_XP,
  GET_PROJECTS_PASS_FAIL,
  GET_LATEST_PROJECTS_WITH_XP,
} from '../graphql/queries';
import PassFailChart from './Graphs/PassFailChart';
import XPByProjectChart from './Graphs/XPByProjectChart';

function Profile() {
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_INFO);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userData && userData.user && userData.user.length > 0) {
      setUserId(userData.user[0].id);
    }
  }, [userData]);

  const {
    data: xpdata,
    loading: xpLoading,
    error: xpError,
  } = useQuery(GEt_Total_XPInKB, {
    variables: { userId },
  });

  const {
    data: detailxpData,
    loading: detailxpLoading,
    error: detailxpError,
  } = useQuery(GET_DETAILED_XP, {
    variables: { userId },
  });

  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery(GET_PROJECTS_WITH_XP, {
    variables: { userId },
  });

  const {
    data: passFailData,
    loading: passFailLoading,
    error: passFailError,
  } = useQuery(GET_PROJECTS_PASS_FAIL, {
    variables: { userId },
  });

  const {
    data: latestProjectsData,
    loading: latestProjectsLoading,
    error: latestProjectsError,
  } = useQuery(GET_LATEST_PROJECTS_WITH_XP, {
    variables: { userId },
  });

  if (
    userLoading ||
    xpLoading ||
    detailxpLoading ||
    projectsLoading ||
    passFailLoading ||
    latestProjectsLoading
  ) {
    return <div className="text-center text-blue-500 font-bold">Loading...</div>;
  }

  if (userError || xpError || detailxpError || projectsError || passFailError || latestProjectsError) {
    return <div className="text-center text-red-500 font-bold">Error loading data.</div>;
  }

  const currentUser = userData?.user[0] || {};
  const piscineGoXPInKB = (detailxpData?.piscineGoXP?.aggregate?.sum?.amount || 0) / 1024;
  const piscineJsXPInKB = (detailxpData?.piscineJsXP?.aggregate?.sum?.amount || 0) / 1024;
  const projectXPInKB = (detailxpData?.projectXP?.aggregate?.sum?.amount || 0) / 1024;
  const projects = projectsData?.transaction || [];
  const passCount = passFailData.progress.filter(
    (item) => item.grade !== null && item.grade >= 1
  ).length;
  const failCount = passFailData.progress.filter(
    (item) => item.grade !== null && item.grade < 1
  ).length;

  const totalXP = xpdata?.transaction_aggregate?.aggregate?.sum?.amount || 0;
  const totalXPInKB = (totalXP / 1024).toFixed(2);
  const otherXPInKB = totalXPInKB - (piscineGoXPInKB + piscineJsXPInKB + projectXPInKB);

  const latestProjects = latestProjectsData?.transaction || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-full p-6 bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">School Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <section className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-300">
      <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-blue-500 to-purple-500 py-2 rounded-md">
        Basic User Information
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-6">
        <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
          <span>ID:</span> <span className="ml-2">{currentUser.id}</span>
        </div>
        <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
          <span>Username:</span> <span className="ml-2">{currentUser.login}</span>
        </div>
        <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
          <span>Email:</span> <span className="ml-2">{currentUser.email}</span>
        </div>
        <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
          <span>Full Name:</span> <span className="ml-2">{currentUser.firstName} {currentUser.lastName}</span>
        </div>
        <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
          <span>Created Account At:</span>{" "}
          <span className="ml-2">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
          <span>Started Program At:</span>{" "}
          <span className="ml-2">{new Date(currentUser.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </section>

    <section className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-300">
      <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-blue-500 to-purple-500 py-2 rounded-md">
        My XP Summary
      </h2>
      <div className="mt-4">
        <div className="text-center text-xl font-bold border-b border-gray-300 pb-4 mb-4">
          <span>Total XP:</span> <span className="ml-2">{totalXPInKB} KB</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
            <span>Piscine Go XP:</span> <span className="ml-2">{piscineGoXPInKB.toFixed(2)} KB</span>
          </div>
          <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
            <span>Piscine JS XP:</span> <span className="ml-2">{piscineJsXPInKB.toFixed(2)} KB</span>
          </div>
          <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
            <span>Project XP:</span> <span className="ml-2">{projectXPInKB.toFixed(2)} KB</span>
          </div>
          <div className="text-lg font-semibold border border-gray-300 p-4 rounded-md">
            <span>Other XP:</span> <span className="ml-2">{otherXPInKB.toFixed(2)} KB</span>
          </div>
        </div>
      </div>
    </section>
  </div>


<section className="mb-6">
  <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md">
    Finished Projects
  </h2>
  <div
    className="bg-white shadow-md rounded-lg p-6 mt-4 max-h-96 overflow-y-auto border-2 border-gray-300 custom-scrollbar"
  >
    <div className="grid grid-cols-2 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gray-50 p-4 rounded shadow hover:bg-gray-100 transition"
        >
          <p className="text-lg font-bold">
            <span className="text-gray-700">Project Name:</span>{" "}
            <span className="text-gray-900">{project.object?.name}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-700">XP Earned:</span>{" "}
            <span className="text-gray-900">
              {(project.amount / 1024).toFixed(2)} KB
            </span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-700">Completed At:</span>{" "}
            <span className="text-gray-900">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      ))}
    </div>
  </div>
</section>




      <section className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-green-400 to-blue-600 py-2 rounded-md">XP by Latest 12 Projects</h2>
          <XPByProjectChart projects={latestProjects} />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-green-400 to-blue-600 py-2 rounded-md">Projects PASS and FAIL Ratio</h2>
          <PassFailChart passCount={passCount} failCount={failCount} />
        </div>
      </section>
    </div>
  );
}

export default Profile;
