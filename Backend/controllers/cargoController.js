import { Admin, CargoItem, Container } from '../models/cargoModels.js';


export const addContainer = async (req, res) => {
  const { adminId, containerData } = req.body;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const newContainer = new Container(containerData);
    admin.containers.push(newContainer);
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
    const container = admin.containers.id(containerId);
    const userItem = new CargoItem(itemData);

    if (container.checkAvailableSpace(userItem)) {
      container.cargoItems.push(userItem);
      await admin.save();
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
    const admin = await Admin.findById(adminId).populate('containers.cargoItems');
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin.containers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
