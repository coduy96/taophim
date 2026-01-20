import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    width?: number
    height?: number
    priority?: boolean
}

export function Logo({ className, width = 32, height = 32, priority = false }: LogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <Image
                src="/logo-64.png"
                alt="Taophim Logo"
                width={width}
                height={height}
                className="object-contain rounded-md"
                priority={priority}
            />
        </div>
    )
}
