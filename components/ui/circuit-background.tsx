
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

    return (
        <div className="fixed inset-0 overflow-hidden">

            {/* Add Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"/>

        </div>
    )

}