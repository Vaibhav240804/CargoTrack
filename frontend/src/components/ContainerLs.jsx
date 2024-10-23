import React from "react";
import { ContainerDetails } from "./ContainerDetail";

export const ContainerLs = ({ containers }) => {
  return (
    <div>
      <h2 className="text-xl mb-4">Container List</h2>
      {containers.length === 0 ? (
        <p>No containers available</p>
      ) : (
        containers.map((container) => (
          <div key={container._id} className="border p-4 mb-4">
            <h3 className="text-lg">Container #{container._id}</h3>
            <p>
              Dimensions: {container.length} x {container.breadth} x{" "}
              {container.height}
            </p>
            <p>
              Available From:{" "}
              {new Date(container.availableFrom).toLocaleDateString()}
            </p>
            <p>
              Available Until:{" "}
              {new Date(container.availableUntil).toLocaleDateString()}
            </p>
            <ContainerDetails container={container} />
          </div>
        ))
      )}
    </div>
  );
};
