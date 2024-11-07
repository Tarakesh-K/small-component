import express from "express";
import productRoutes from "./routes/productRoutes";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

// Serve images from the "upload/images" directory
app.use("/images", express.static("upload/images"));
app.use("/", productRoutes);

app.listen(port, () => {
  console.log("Server is running on", port);
});
