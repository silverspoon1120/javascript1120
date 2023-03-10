import { Request, Response } from "express";

import UserModel from "../../models/UserModel";

export default async function list(req: Request, res: Response) {
  const { id } = req.tokenPayload;

  try {
    const user = await UserModel.findOne(id, {
      relations: ["addresses"],
    });

    if (!user) return res.status(404).json({ message: "user not found" });

    return res.json(user.addresses);
  } catch (error) {
    console.error(new Date().toUTCString(), "-", error);
    return res.status(500).json({ message: "error creating address" });
  }
}
