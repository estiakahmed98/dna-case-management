// Error handler middleware
import { NextApiResponse } from "next";

export function handleError(res: NextApiResponse, error: any) {
  console.error(error);
  return res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}
