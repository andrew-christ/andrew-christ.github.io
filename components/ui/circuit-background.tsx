"use client"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

interface CircuitNode {
    id: number
    x: number
    y: number
    connections: number[]
}

interface CircuitPath {
    id: number
    d: string
    length: number
}

export default function CircuitBackground() {

    const [nodes, setNodes] = useState<CircuitNode[]>([])

    const [size, setSize] = useState({ w: 0, h: 0 })

    useEffect(() => {
        const update = () =>
            setSize({ w: window.innerWidth, h: window.innerHeight })

        update()

        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    // Generate random nodes whenever the page loads
    useEffect(() => {

        const nodeCount = 40

        const cols = Math.ceil(Math.sqrt(nodeCount))
        const rows = Math.ceil(nodeCount / cols)

        const spacingX = 100 / (cols + 1)
        const spacingY = 100 / (rows + 1)

        const noise = 10 
        const keepProbability = 0.6

        const generatedNodes: CircuitNode[] = Array.from({ length: nodeCount }, (_, i) => {

            const col = i % cols
            const row = Math.floor(i / cols)

            return {
                id: i,
                x: (col + 1) * spacingX + (Math.random() - 0.5) * noise,
                y: (row + 1) * spacingY + (Math.random() - 0.5) * noise,
                connections: [],
            }
        })
        .filter(() => Math.random() < keepProbability) // randomly delete some
        .map((node, newId) => ({ ...node, id: newId })) // reindex IDs after deletion



        setNodes(generatedNodes)

    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden">
            <span>{}</span>

            {/* Add Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"/>
            
            <svg
                width="100%"
                height="100%"
                className="absolute inset-0"
                // viewBox={`0 0 ${100} ${100}`}
                preserveAspectRatio="xMidYMid slice"
            >

                <defs>

                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                </defs>

                {/* Add Circuit Nodes */}
                {
                    nodes.map((node, i) => {

                        const aspect = Math.min(size.w, size.h)

                        const radius = Math.min(size.w, size.h) * (1 + Math.random() / 6)
                        
                        return (
                            <g key={node.id}>

                                {/* Add Outer Ring */}
                                <motion.circle
                                    cx={(node.x / 100) * size.w}
                                    cy={(node.y / 100) * size.h}
                                    r={radius * 0.01}
                                    fill="none"
                                    stroke="#22d3ee"
                                    strokeWidth={aspect * 0.001}
                                    filter="url(#nodeGlow)"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0.8, 0.5]
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />

                                {/* Add Inner Dot */}
                                <motion.circle
                                    cx={(node.x / 100) * size.w}
                                    cy={(node.y / 100) * size.h}
                                    r={radius * 0.003}
                                    fill="#22d3ee"
                                    filter="url(#nodeGlow)"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.075,
                                        ease: "backOut",
                                    }}
                                />

                            </g>
                        )
                    })
                }

                {/* Additional decorative elements - small squares (like IC chips) */}
                {
                    nodes.slice(0, 8).map((node, index) => {

                        const aspect = Math.min(size.w, size.h)

                        const dim = aspect * 0.025
                        
                        return (
                            <motion.rect
                                key={`chip-${node.id}`}
                                x={(node.x / 100) * size.w - dim / 2}
                                y={(node.y / 100) * size.h - dim / 2}
                                width={dim}
                                height={dim}
                                fill="none"
                                stroke="#0891b2"
                                strokeWidth={aspect * 0.001}
                                filter="url(#glow)"
                                initial={{ opacity: 0, rotate: 0 }}
                                animate={{ 
                                    opacity: [0.3, 0.6, 0.3],
                                    rotate: 90,
                                }}
                                transition={{
                                    duration: 4,
                                    delay: index * 0.3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                            />
                        )
                })}

            </svg>

        </div>
    )

}