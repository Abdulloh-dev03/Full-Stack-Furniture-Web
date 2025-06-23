import prisma from "../db/prisma";
import { Request, Response } from "express";
import Send from "../utils/response";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier"; 

export const createProducts = async (req: Request, res: Response) => {
  const { title, price, paragraph } = req.body;
  const file = req.file;

  if (!title || !price || !paragraph) {
    return Send.error(res, null, "Please fill all the fields");
  }

  if (!file) {
    return Send.error(res, null, "Please upload image");
  }

  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) {
    return Send.error(res, null, "Price must be a valid number");
  }

  const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("No result returned"));
          } else {
            resolve(result);
          }
        }
      );
      stream.end(fileBuffer);
    });
  };

  try {
    const result = await uploadToCloudinary(file.buffer);

    const newProduct = await prisma.products.create({
      data: {
        title,
        price: numericPrice,
        paragraph,
        image: result.secure_url,
      },
    });

    return Send.success(res, newProduct, "Product created successfully");
  } catch (error) {
    return Send.error(res, null, "Error creating product");
  }
};

export const editProducts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, price, paragraph } = req.body;
  let imageUrl = req.body.image;

  if (!title || !price || !paragraph) {
    return Send.badRequest(res, null, "Required fields are missing");
  }

  try {
    if (req.file) {
      const streamUpload = () =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        });

      imageUrl = await streamUpload();
    }

    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        title,
        price: parseFloat(price),
        image: imageUrl,
        paragraph,
      },
    });

    return Send.success(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    console.error("Edit Error:", error);
    return Send.error(res, null, "Something went wrong while editing the product");
  }
};

export const deleteProducts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.products.delete({
      where: { id: parseInt(id) }
    });
    return Send.success(res, null, "Product deleted successfully");
  } catch (error) {
    return Send.error(res, null, "Error with delete Product");
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const getProducts = await prisma.products.findMany();
    return Send.success(res, getProducts, "All products fetched successfully");
  } catch (error) {
    console.error("GetAllProducts Error:", error);
    return Send.error(res, null, "Error getting all products");
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return Send.notFound(res, null, "Product not found");
    }

    return Send.success(res, product, "Product fetched successfully");
  } catch (error) {
    console.error(error);
    return Send.error(res, null, "Error fetching product");
  }
};