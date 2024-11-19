import { Admin, CargoItem, Container } from "../models/cargoModels.js";

export const addContainer = async (req, res) => {
  const { adminId, containerData } = req.body;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const newContainer = new Container(containerData);
    await newContainer.save();

    admin.containers.push(newContainer._id);
    await admin.save();
    res.status(201).json(newContainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addItemToContainer = async (req, res) => {
  const { adminId, containerId, itemData } = req.body;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const container = await Container.findById(containerId);
    if (!container) return res.status(404).json({ message: "Container not found" });

    const userItem = new CargoItem(itemData);

    if (container.checkAvailableSpace(userItem)) {
      container.cargoItems.push(userItem);
      await container.save();
      res.status(201).json(userItem);
    } else {
      res.status(400).json({ message: "Not enough space in the container for the item." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContainers = async (req, res) => {
  const { adminId } = req.params;
  try {
    const admin = await Admin.findById(adminId).populate({
      path: "containers",
      populate: {
        path: "cargoItems", 
      },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin.containers); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

