"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface AnimatedStatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: string
  change: string
  changeLabel: string
  trend?: 'up' | 'down' | 'neutral'
  prefix?: string
  suffix?: string
  delay?: number
}

export function AnimatedStatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeLabel,
  trend = 'up',
  prefix = '',
  suffix = '',
  delay = 0
}: AnimatedStatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      if (typeof value === 'number') {
        let start = 0
        const duration = 1500
        const increment = value / (duration / 16)
        
        const counter = setInterval(() => {
          start += increment
          if (start >= value) {
            setDisplayValue(value)
            clearInterval(counter)
          } else {
            setDisplayValue(Math.floor(start))
          }
        }, 16)
        
        return () => clearInterval(counter)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-orange-600 bg-orange-50'
  }

  return (
    <Card
      className={`
        relative overflow-hidden border border-amber-100 shadow-lg 
        bg-white/90 backdrop-blur-sm transition-all duration-500 
        hover:shadow-2xl hover:-translate-y-2 group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500"></div>
          </div>
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-2">
                  {title}
                </p>
                <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-105">
                  {prefix}{typeof value === 'number' ? displayValue.toLocaleString() : value}{suffix}
                </p>
              </div>
              <div className={`
                p-4 ${color} rounded-xl shadow-lg 
                transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
              `}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${trendColors[trend]} px-3 py-1 text-sm font-bold border-0`}>
                {trend === 'up' && '↗'} {trend === 'down' && '↘'} {change}
              </Badge>
              <span className="text-xs text-gray-500">{changeLabel}</span>
            </div>
          </div>
          
          {/* Bottom gradient line */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 group-hover:h-2"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonStatCard() {
  return (
    <Card className="border border-gray-200 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-6 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </CardContent>
    </Card>
  )
}