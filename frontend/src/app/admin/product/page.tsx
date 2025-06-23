"use client";
import { useDropzone } from "react-dropzone"
import { useDispatch } from "react-redux"
import { useState, useCallback, useEffect } from "react"
import { createProduct, fetchProducts } from "../../../redux/product/productSlice"
import type { AppDispatch } from "../../../redux/app/store"
import axiosInstance from "../../../redux/api/axiosInstance"
import { message } from "antd"
import Button from "../../../components/ui/button/Button"
import Label from "../../../components/ui/form/Label"
import Input from "../../../components/ui/form/InputField"
import TextArea from "../../../components/ui/form/TextArea"
import ComponentCard from "../../../components/common/ComponentCard"
import ProductEditDelete from "./ProductEditDelete"
import Image from "next/image";
type CreateProductInput = {
  id: number
  title: string
  price: number
  paragraph: string
  image: string
}

export default function Products() {
  const dispatch = useDispatch<AppDispatch>()

  const [form, setForm] = useState({
    id: "",
    title: "",
    price: "",
    paragraph: "",
  })

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      const previewUrl = URL.createObjectURL(selectedFile)
      setPreview(previewUrl)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
  })

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleSave = async () => {
    if (!form.title || !form.price || !form.paragraph || !file) {
      message.warning("Please fill all fields.")
      return
    }

    setErrorMessage(null)
    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("price", form.price)
    formData.append("paragraph", form.paragraph)
    formData.append("image", file)

    const key = "createProduct"
    setIsUploading(true)
    message.loading({ content: "Creating product...", key })

    try {
      const response = await axiosInstance.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.data.ok) {
        const createdProduct: CreateProductInput = response.data.data
        dispatch(createProduct(createdProduct))

        // Add this line to refresh the products list
        dispatch(fetchProducts())

        message.success({ content: "Product created successfully!", key, duration: 2 })

        setForm({ id: "", title: "", price: "", paragraph: "" })
        setFile(null)
        setPreview(null)
      } else {
        message.error({ content: "Failed to create product.", key, duration: 2 })
      }
    } catch (error) {
      console.error("Product creation failed:", error)
      message.error({ content: "An error occurred. Please try again.", key, duration: 2 })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h1 className="text-center font-semibold text-[#455ce9] text-3xl mb-6">Create Product</h1>

      <div className="max-w-5xl mx-auto bg-white shadow-lg border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Text Inputs */}
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-sm text-[#555] mb-1 block">Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="furniture"
                value={form.title}
                onChange={handleChange}
                className="w-full text-sm border border-[#ddd] py-2 px-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <Label className="text-sm text-[#555] mb-1 block">Price</Label>
              <Input
                type="number"
                name="price"
                placeholder="price"
                value={form.price}
                onChange={handleChange}
                className="w-full text-sm border border-[#ddd] py-2 px-3 rounded-lg outline-none"
              />
            </div>

            <div>
              <Label className="text-sm text-[#555] mb-1 block">Description</Label>
              <TextArea
                name="paragraph"
                placeholder="Product description here..."
                value={form.paragraph}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    paragraph: value,
                  }))
                }
                className="h-52 resize-none w-full text-sm outline-none border-[#ddd] py-2 px-3 rounded-lg"
                rows={6}
              />
            </div>
          </div>

          {/* Image Upload */}
          <ComponentCard title="Upload Image" className="flex-1 space-y-4">
            <div
              {...getRootProps()}
              className={`transition border border-gray-300 border-dashed cursor-pointer  rounded-xl hover:border-brand-500 p-6 text-center ${
                isDragActive ? "border-brand-500 bg-gray-100" : "bg-gray-50 "
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center">
                {preview ? (
                  <Image width={400} height={40} src={preview || "/placeholder.svg"} alt="Preview" className="object-contain rounded-lg" />
                ) : (
                  <>
                    <div className="mb-4 flex justify-center">
                      <div className="h-[68px] w-[68px] flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
                        {/* icon here */}
                        <svg
                          className="fill-current"
                          width="29"
                          height="28"
                          viewBox="0 0 29 28"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h4 className="mb-2 font-semibold text-gray-800 ">
                      {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                    </h4>
                    <p className="text-sm text-gray-700 mb-1">
                      Drag and drop PNG, JPG, WebP, SVG images here or browse
                    </p>
                    <span className="font-medium underline text-theme-sm">Browse File</span>
                  </>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>

        {errorMessage && <p className="text-red-500 text-sm text-center mt-4">{errorMessage}</p>}

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className={`bg-[#455ce9] hover:bg-[#3e54df] cursor-pointer !text-[#FFFFFF] rounded-lg px-6 py-2 ${
              isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
      <main>
        <ProductEditDelete />
      </main>
    </div>
  )
}
