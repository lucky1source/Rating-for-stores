import Image from "next/image"

interface StoreImageProps {
  src?: string
  alt: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StoreImage({ src, alt, size = "md", className = "" }: StoreImageProps) {
  const sizeClasses = {
    sm: "h-16 w-24",
    md: "h-20 w-32",
    lg: "h-32 w-48",
  }

  const fallbackImage = "/generic-store-front-placeholder.jpg"

  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-gray-200 shadow-md ${className}`}>
      <Image
        src={src || fallbackImage}
        alt={alt}
        width={size === "sm" ? 96 : size === "md" ? 128 : 192}
        height={size === "sm" ? 64 : size === "md" ? 80 : 128}
        className="object-cover w-full h-full"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackImage
        }}
      />
    </div>
  )
}
