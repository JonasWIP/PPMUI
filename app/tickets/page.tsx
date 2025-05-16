'use client'

import React from 'react'
import CyberpunkLayout from '@/components/cyberpunk/Layout'

export default function TicketsPage() {
  return (
    <CyberpunkLayout>
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-wider mb-8">
          TICKETS<span className="text-purple-500">::</span>
          <span className="text-cyan-300">MANAGEMENT</span>
        </h1>
        
        <div className="bg-gray-900/70 border border-cyan-800/30 rounded-lg p-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <p className="text-cyan-400 text-lg mb-2">Ticket management functionality coming soon</p>
              <p className="text-gray-400">This feature is currently under development</p>
            </div>
          </div>
        </div>
      </div>
    </CyberpunkLayout>
  )
}