import React, { useState, useEffect } from "react";
import { ContainerForm } from "../components/ContainerForm";
import { ContainerLs } from "../components/ContainerLs";
import axios from "axios";
import Api from "../api";

export const AdminDash = () => {
  const [containers, setContainers] = useState([]);
  const id = "admin";

  const fetchContainers = async () => {
    try {
      const response = await Api.getContainers(id)
        .then((res) => {
          console.log(res);
          toast.success("Containers fetched!!");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
      setContainers(response.data);
    } catch (error) {
      console.error("Error fetching containers", error);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const onContainerAdded = () => {
    fetchContainers();
  };


  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <ContainerForm adminId={id} onContainerAdded={onContainerAdded} />
      <ContainerLs containers={containers} />
    </div>
  );
};
