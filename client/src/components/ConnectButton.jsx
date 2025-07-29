import React from "react";

const ConnectButton = ({ platform }) => {
  const handleConnect = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/oauth/${platform}`;
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-600 text-white px-4 py-2 rounded m-2"
    >
      Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </button>
  );
};

export default ConnectButton;