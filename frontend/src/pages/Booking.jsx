import React from "react";
import { TextField, Button } from "@mui/material";
import {
  EmailOutlined,
  PhoneOutlined,
  LockClockOutlined,
} from "@mui/icons-material";
import Left from "../animated-components/Left";
import Right from "../animated-components/Right";
import Center from "../animated-components/Center";
import DCenter from "../animated-components/DCenter";

const Bookings = () => {
  return (
    <div className="bg-[#0e1b4d] text-white min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-10">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 flex flex-col items-start space-y-4">
            <DCenter>
              <h2 className="text-3xl font-bold">Place your order</h2>
            </DCenter>
            <Center>
              <div className="flex items-center space-x-3">
                <EmailOutlined />
                <div>
                  <p className="text-lg">Email</p>
                  <p>contact@logistics.com</p>
                </div>
              </div>
            </Center>
            <Center>
              <div className="flex items-center space-x-3">
                <PhoneOutlined />
                <div>
                  <p className="text-lg">Call Us</p>
                  <p>+91 123 456 7890</p>
                </div>
              </div>
            </Center>
            <Center>
              <div className="flex items-center space-x-3">
                <LockClockOutlined />
                <div>
                  <p className="text-lg">Daily</p>
                  <p>9.00 – 18.00</p>
                </div>
              </div>
            </Center>
          </div>

          <div className="w-full lg:w-2/3 mt-8 lg:mt-0 lg:pl-10">
            <Right>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Your Name"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  fullWidth
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  fullWidth
                />

                {/* From and To */}
                <TextField
                  label="From"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  fullWidth
                />
                <TextField
                  label="To"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  fullWidth
                />

                {/* Parcel Description */}
                <TextField
                  label="Parcel Description"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  rows={4}
                />
              </form>
            </Right>

            {/* Submit Button */}
            <div className="mt-6">
              <Left>
                <Button
                  variant="contained"
                  className="bg-[#f4b41a] text-white px-8 py-3"
                >
                  Submit Message
                </Button>
              </Left>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Left>
          <div className="text-center mt-16">
            <p>We will send Tracker ID to registered Email</p>
          </div>
        </Left>
      </div>
    </div>
  );
};

export default Bookings;
