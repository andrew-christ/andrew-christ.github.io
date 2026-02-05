"use client"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

interface Position {
    x: number
    y: number
}

interface CircuitNode {
    id: number
    x: number
    y: number
    hasChip: boolean
    connections: number[]
}

interface CircuitPath {
    id: number
    start: Position
    end: Position
    midX: number
    // length: number
}

export default function CircuitBackground() {

    const [nodes, setNodes] = useState<CircuitNode[]>([])
    const [paths, setPaths] = useState<CircuitPath[]>([])

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

        const nodeCount = 30

        const cols = Math.ceil(Math.sqrt(nodeCount))
        const rows = Math.ceil(nodeCount / cols)

        const padding = 5

        const spacingX = (100 - 2 * padding) / cols
        const spacingY = (100 - 2 * padding) / rows

        const noise = 15 
        const keepProbability = 0.75

        const generatedNodes: CircuitNode[] = Array.from({ length: nodeCount }, (_, i) => {

            const col = i % cols
            const row = Math.floor(i / cols)

            return {
                id: i,
                x: padding + col * spacingX + (Math.random() - 0.5) * noise,
                y: padding + row * spacingY + (Math.random() - 0.5) * noise,
                hasChip: Math.random() < 0.45,
                connections: [],
            }
        })
        .filter(() => Math.random() < keepProbability) // randomly delete some
        .map((node, newId) => ({ ...node, id: newId })) // reindex IDs after deletion


        // Connect nodes to nearby nodes
        generatedNodes.forEach((node, idx) => {
            const nearbyNodes = generatedNodes
                .map((n, i) => ({
                    index: i,
                    distance: Math.sqrt(Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2)) // Compute Euclidean Norm
                }))
                .filter((n) => n.index !== idx)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 2)

            node.connections = nearbyNodes.map((n) => n.index)
        })

        // Generate circuit-like paths
        const generatedPaths: CircuitPath[] = []
        let pathID = 0

        generatedNodes.forEach((node) => {
            node.connections.forEach((targetIndex) => {

                const target = generatedNodes[targetIndex]

                generatedPaths.push({
                    id: pathID++,
                    start: {
                        x: node.x,
                        y: node.y
                    },
                    end: {
                        x: target.x,
                        y: target.y
                    },
                    midX: node.x + (target.x - node.x) * 0.5
                })

            })
        })


        setNodes(generatedNodes)
        setPaths(generatedPaths)

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

                    {/* Gradient for paths */}
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                    </linearGradient>

                </defs>

                {/* Add Static Circuit Paths */}
                {
                    paths.map((path) => {

                        const aspect = Math.min(size.w, size.h)

                        const d = `
                            M ${path.start.x / 100 * size.w} ${path.start.y / 100 * size.h} 
                            L ${path.midX / 100 * size.w} ${path.start.y/ 100 * size.h} 
                            L ${path.midX / 100 * size.w} ${path.end.y / 100 * size.h} 
                            L ${path.end.x / 100 * size.w} ${path.end.y/ 100 * size.h}`

                        return (
                            <motion.path
                                key={`static-${path.id}`}
                                d={d}
                                fill="none"
                                stroke="#0e7490"
                                strokeWidth={aspect * 0.001}
                                strokeOpacity="0.4"
                                filter="url(#glow)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 2,
                                    delay: path.id * 0.05,
                                    ease: "easeInOut",
                                }}
                            />
                        )
                    })
                }

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
                    nodes.map((node, index) => {

                        if (!node.hasChip) return null;

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