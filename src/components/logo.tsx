import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    width?: number
    height?: number
}

export function Logo({ className, width = 32, height = 32 }: LogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <Image
                src="/logo.png"
                alt="Taophim Logo"
                width={width}
                height={height}
                className="object-contain rounded-md"
                priority
            />
        </div>
    )
}
