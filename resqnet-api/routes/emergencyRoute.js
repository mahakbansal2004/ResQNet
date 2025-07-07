import express from "express";

const router = express.Router();

// Trigger emergency alert (testing/demo route)
router.post("/trigger", (req, res) => {
  const io = req.io;

  const emergencyData = {
    type: "newIncident",
    data: {
      location: req.body.location || "Unknown",
      description: req.body.description || "No description provided",
      severity: req.body.severity || "Medium",
      status: "Ongoing",
      requiredResponderTypes: req.body.requiredResponderTypes || "Any",
      requiredResponderQuantity: req.body.requiredResponderQuantity || 1,
    },
  };

  io.emit("emergency", emergencyData);

  res.status(200).json({ message: "Emergency alert emitted!" });
});

export default router;
