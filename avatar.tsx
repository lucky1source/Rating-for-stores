import Image from "next/image"

interface AvatarProps {
  src?: string
  alt: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const fallbackImage = "/default-user-avatar.png"

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
    >
      <Image
        src={src || fallbackImage}
        alt={alt}
        width={size === "sm" ? 32 : size === "md" ? 40 : 48}
        height={size === "sm" ? 32 : size === "md" ? 40 : 48}
        className="object-cover w-full h-full"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackImage
        }}
      />
    </div>
  )
}
