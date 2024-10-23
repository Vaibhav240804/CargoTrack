import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import Api from "../api";
import { toast } from "react-toastify";

export const ContainerForm = ({ adminId, onContainerAdded }) => {
  const [formData, setFormData] = useState({
    length: "",
    breadth: "",
    height: "",
    availableFrom: "",
    availableUntil: "",
    from: "Pune",
    to: "Mumbai",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.setContainer({
        adminId,
        containerData: formData,
      });
      console.log(response);
      toast.success("Container added successfully!");
      setContainers(response.data);
    } catch (error) {
      console.error("Error adding container", error);
      toast.error(error.response?.data?.message || "Error adding container");

      toast.success("Container added successfully!");
      onContainerAdded();
      setFormData({
        length: "",
        breadth: "",
        height: "",
        availableFrom: "",
        availableUntil: "",
        from: "Pune",
        to: "Mumbai",
      });
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-4">Add Container</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <TextField
          label="Length"
          name="length"
          value={formData.length}
          onChange={handleChange}
          required
        />
        <TextField
          label="Breadth"
          name="breadth"
          value={formData.breadth}
          onChange={handleChange}
          required
        />
        <TextField
          label="Height"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <TextField
          type="date"
          label="Available From"
          name="availableFrom"
          value={formData.availableFrom}
          onChange={handleChange}
          required
        />
        <TextField
          type="date"
          label="Available Until"
          name="availableUntil"
          value={formData.availableUntil}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Container
        </Button>
      </form>
    </div>
  );
};
