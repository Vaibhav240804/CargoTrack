import React from "react";
import { ContainerDetails } from "./ContainerDetail";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

export const ContainerLs = ({ containers }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Container List
      </Typography>
      {containers.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No containers available
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {containers.map((container) => (
            <Grid item xs={12} sm={6} md={4} key={container._id}>
              <Card
                variant="outlined"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Container #{container._id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>From:</strong> {container.from}
                  </Typography>
                  <Typography variant="body1">
                    <strong>To:</strong> {container.to}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Dimensions:</strong> {container.length} x{" "}
                    {container.breadth} x {container.height}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Available From:</strong>{" "}
                    {new Date(container.availableFrom).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Available Until:</strong>{" "}
                    {new Date(container.availableUntil).toLocaleDateString()}
                  </Typography>
                  <ContainerDetails container={container} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
