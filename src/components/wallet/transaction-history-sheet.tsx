"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CircleArrowUp01Icon as ArrowUpCircle,
  CircleArrowDown01Icon as ArrowDownCircle,
  Time01Icon as Clock,
  Exchange01Icon as Exchange,
  Clock01Icon as History,
  Loading03Icon as Loader2,
} from "@hugeicons/core-free-icons"

interface Transaction {
  id: string
  type: string
  amount: number
  created_at: string
  orders: {
    id: string
    services: {
      name: string
    }
  } | null
}

const transactionTypeLabels: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  deposit: {
    label: "Nạp Xu",
    icon: <HugeiconsIcon icon={ArrowUpCircle} className="h-4 w-4" />,
    className: "bg-green-500/10 text-green-600 dark:text-green-400"
  },
  expense: {
    label: "Chi tiêu",
    icon: <HugeiconsIcon icon={ArrowDownCircle} className="h-4 w-4" />,
    className: "bg-red-500/10 text-red-600 dark:text-red-400"
  },
  refund: {
    label: "Hoàn tiền",
    icon: <HugeiconsIcon icon={Exchange} className="h-4 w-4" />,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
}

function formatXu(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

interface TransactionHistorySheetProps {
  totalDeposited: number
  totalSpent: number
}

export function TransactionHistorySheet({ totalDeposited, totalSpent }: TransactionHistorySheetProps) {
  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const ITEMS_PER_PAGE = 20

  const fetchTransactions = useCallback(async (pageNum: number, append = false) => {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        type,
        amount,
        created_at,
        orders (
          id,
          services (name)
        )
      `)
      .order('created_at', { ascending: false })
      .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1)

    if (error) {
      console.error('Error fetching transactions:', error)
      setLoading(false)
      return
    }

    const typedData = data as unknown as Transaction[]

    if (append) {
      setTransactions(prev => [...prev, ...typedData])
    } else {
      setTransactions(typedData)
    }

    setHasMore(typedData.length === ITEMS_PER_PAGE)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (open && transactions.length === 0) {
      fetchTransactions(0)
    }
  }, [open, transactions.length, fetchTransactions])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchTransactions(nextPage, true)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset state when closing
      setTransactions([])
      setPage(0)
      setHasMore(true)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-1.5 h-auto py-1 px-2">
          Xem tất cả
          <HugeiconsIcon icon={History} className="h-3.5 w-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        {/* Header - fixed */}
        <div className="flex-shrink-0 border-b">
          <SheetHeader className="p-4 sm:p-6 pb-3 sm:pb-4 pr-14">
            <SheetTitle className="text-base sm:text-lg">Lịch sử giao dịch</SheetTitle>
          </SheetHeader>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2.5 sm:p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <HugeiconsIcon icon={ArrowUpCircle} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                <span className="text-xs sm:text-sm text-muted-foreground">Đã nạp</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-green-600">
                {totalDeposited > 0 && '+'}{formatXu(totalDeposited)} Xu
              </p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <HugeiconsIcon icon={ArrowDownCircle} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                <span className="text-xs sm:text-sm text-muted-foreground">Đã chi</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-red-600">
                {totalSpent > 0 && '-'}{formatXu(totalSpent)} Xu
              </p>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-2 sm:space-y-3">
            {transactions.length > 0 ? (
              <>
                {transactions.map((transaction) => {
                  const typeInfo = transactionTypeLabels[transaction.type]
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border bg-card"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.className}`}>
                          {typeInfo.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{typeInfo.label}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {transaction.orders
                              ? `${transaction.orders.services?.name || 'N/A'}`
                              : formatDate(transaction.created_at)
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className={`text-sm font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatXu(transaction.amount)}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Ho_Chi_Minh'
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {/* Load More Button */}
                {hasMore && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <HugeiconsIcon icon={Loader2} className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      'Tải thêm'
                    )}
                  </Button>
                )}
              </>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                <HugeiconsIcon icon={Loader2} className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">Đang tải...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center rounded-xl border border-dashed">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted/50 flex items-center justify-center mb-2 sm:mb-3">
                  <HugeiconsIcon icon={Clock} className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm sm:text-base">Chưa có giao dịch</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Lịch sử nạp và chi tiêu sẽ xuất hiện tại đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
