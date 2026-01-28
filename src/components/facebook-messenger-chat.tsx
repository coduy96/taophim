"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CustomerService01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

const FACEBOOK_PAGE_ID = "61573590554545"
const TOOLTIP_DISMISSED_KEY = "taophim_chat_tooltip_dismissed"

export function FacebookMessengerChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(TOOLTIP_DISMISSED_KEY)
    if (dismissed !== "true") {
      setShowTooltip(true)
    } else {
      setTooltipDismissed(true)
    }
  }, [])

  const dismissTooltip = () => {
    setShowTooltip(false)
    setTooltipDismissed(true)
    localStorage.setItem(TOOLTIP_DISMISSED_KEY, "true")
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (showTooltip) {
      dismissTooltip()
    }
  }

  // Show tooltip on hover if it was dismissed before
  const shouldShowTooltip = showTooltip || (isHovered && tooltipDismissed && !isOpen)

  const handleClose = () => {
    setIsOpen(false)
  }

  const messengerUrl = `https://m.me/${FACEBOOK_PAGE_ID}`

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      {shouldShowTooltip && (
        <div className="animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="bg-orange-500 rounded-2xl shadow-xl p-3 max-w-[220px] relative">
            <button
              onClick={dismissTooltip}
              className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-orange-700 transition-colors"
              aria-label="Đóng"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={10} />
            </button>
            <p className="text-sm text-white font-medium">
              Hỗ trợ 24/7 🎬
            </p>
            <p className="text-xs text-white/90 mt-1">
              Chat ngay với đội ngũ Taophim!
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6">
              <div className="w-4 h-4 bg-orange-500 rotate-45 transform" />
            </div>
          </div>
        </div>
      )}

      {/* Chat popup */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden w-[320px] sm:w-[360px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30">
                      <Image
                        src="/logo-64.png"
                        alt="Taophim"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">Taophim</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Thường trả lời ngay
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Đóng chat"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-muted/30 min-h-[120px]">
              {/* Chat bubble */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/logo-64.png"
                    alt="Taophim"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-md p-3 shadow-sm border border-border max-w-[85%]">
                  <p className="text-sm text-foreground">
                    Xin chào! 👋
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn tạo video AI chất lượng cao!
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.686 7.2V22l3.39-1.86c.904.25 1.866.384 2.924.384 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm1.008 12.445l-2.55-2.72-4.98 2.72 5.478-5.817 2.614 2.72 4.916-2.72-5.478 5.817z"/>
                </svg>
                Nhắn tin với chúng tôi
              </a>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Mở Messenger để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "hover:scale-110 hover:shadow-xl hover:shadow-primary/20",
          "active:scale-95"
        )}
        aria-label={isOpen ? "Đóng hỗ trợ" : "Mở hỗ trợ"}
      >
        {isOpen ? (
          <HugeiconsIcon icon={Cancel01Icon} size={24} />
        ) : (
          <HugeiconsIcon icon={CustomerService01Icon} size={26} />
        )}
      </button>

      {/* Pulse animation */}
      {!isOpen && showTooltip && (
        <span className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-primary animate-ping opacity-30 pointer-events-none" />
      )}
    </div>
  )
}
