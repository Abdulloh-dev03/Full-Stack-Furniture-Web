import prisma from "../db/prisma";
import { Request,Response } from "express";
import Send from "../utils/response";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier"; 

export const  createRoom = async (req:Request,res:Response)=>{
    const {title,heading,price} = req.body;
    const image = req.file;
    if (!title || !heading || !price) {
        return Send.error(res, null, "Please fill all the fields");
    }
    if(!image){
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
    try{
        const result = await uploadToCloudinary(image.buffer);
        const newRoom = await prisma.rooms.create({
            data:{
                title,
                heading,
                price:numericPrice,
                image: result.secure_url,
            },
        });
        return Send.success(res,newRoom,"Room created Successfully")
    }catch(error){
      console.log(error);
      
        return Send.error(res,null, "Error creating Room")
    }
};

export const editRoom = async (req:Request,res:Response)=>{
    const {id} = req.params;
    const {title,heading,price}= req.body;
    let imageUrl = req.body.image;
    
    if (!title || !heading || !price) {
        return Send.badRequest(res, null, "Required fields are missing");
    }
    
    // ✅ Add this price conversion and validation
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
        return Send.error(res, null, "Price must be a valid number");
    }
    
    try{
        if(req.file){
            const streamUplaod = ()=>
                new Promise<string>((resolve,reject)=>{
                    const stream = cloudinary.uploader.upload_stream(
                        {folder:"main"},
                        (error,result)=>{
                            if(result)resolve(result.secure_url);
                            else reject(error);
                        }
                    );
                    streamifier.createReadStream(req.file!.buffer).pipe(stream);
                });
                imageUrl = await streamUplaod();
        }

        const updateMain = await prisma.rooms.update({
            where:{id:parseInt(id)},
            data:{
                title,
                heading,
                price: numericPrice,  // ✅ Use converted number
                image: imageUrl,
            },
        });
        return Send.success(res,updateMain,"Rooms updated successfully!")
    }catch(error){
        return Send.error(res,null,"Something went wrong while editing Room")
    }
};

export const deleteRoom = async (req:Request,res:Response)=>{
    const {id}= req.params;
    try{
        await prisma.rooms.delete({
            where:{id:parseInt(id)}
        });
        return Send.success(res,"Room deleted successfully")
    }catch(error){
        return Send.error(res,null,"Error with deleted Room")
    }
}

export const getAllRoom = async (req: Request, res: Response) => {
  try {
    const getRoom = await prisma.rooms.findMany();
    return Send.success(res, getRoom );
  } catch (error) {
    return Send.error(res, null, "Error getting all rooms");
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const room = await prisma.rooms.findUnique({
      where: { id: parseInt(id) },
    });

    if (!room) {
      return Send.notFound(res, null, "Room not found");
    }

    return Send.success(res, room);
  } catch (error) {
    console.error(error);
    return Send.error(res, null, "Error fetching room");
  }
};