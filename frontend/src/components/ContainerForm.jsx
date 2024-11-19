import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import Api from "../api";

export const ContainerForm = ({ adminId, onContainerAdded }) => {
  const [formData, setFormData] = useState({
    length: "",
    breadth: "",
    height: "",
    availableFrom: "",
    availableUntil: "",
    from: "",
    to: "",
    cost: "",
  });

  const [cities, setCities] = useState([]);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Fetch cities from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.cities) {
      setCities(user.cities);
    } else {
      toast.error("Unable to load cities from localStorage.");
    }

    // Calculate the minimum date (day after today)
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add one day
    setMinDate(today.toISOString().split("T")[0]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation to prevent "from" and "to" being the same
    if (formData.from === formData.to) {
      toast.error("Source and destination cannot be the same.");
      return;
    }

    try {
      const response = await Api.setContainer({
        adminId,
        containerData: formData,
      });
      toast.success("Container added successfully!");
      onContainerAdded();
      setFormData({
        length: "",
        breadth: "",
        height: "",
        availableFrom: "",
        availableUntil: "",
        from: "",
        to: "",
        cost: "",
      });
    } catch (error) {
      console.error("Error adding container", error);
      toast.error(error.response?.data?.message || "Error adding container");
    }
  };

  return (
    <div className="container-form mb-10">
      <h2
        style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}
      >
        Add Container
      </h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Length (ft)"
              name="length"
              value={formData.length}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Breadth (ft)"
              name="breadth"
              value={formData.breadth}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Height (ft)"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Available From"
              name="availableFrom"
              InputLabelProps={{ shrink: true }}
              value={formData.availableFrom}
              onChange={handleChange}
              inputProps={{ min: minDate }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Available Until"
              name="availableUntil"
              InputLabelProps={{ shrink: true }}
              value={formData.availableUntil}
              onChange={handleChange}
              inputProps={{ min: formData.availableFrom || minDate }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="From"
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
            >
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="To"
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
            >
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              fullWidth
              label="Cost per Cubic ft"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{
                padding: "12px 0",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "10px",
                width: "50%",
              }}
            >
              Add Container
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
