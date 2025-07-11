import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Type as TypeIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "text";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")
    const [color, setColor] = useState<string>("#ffffff");

    useEffect(() => {
        game?.setTool(selectedTool);
        if (game) game.setColor?.(color);
    }, [selectedTool, game, color]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, color);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} color={color} setColor={setColor} />
    </div>
}

function Topbar({selectedTool, setSelectedTool, color, setColor}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    color: string,
    setColor: (c: string) => void
}) {
    // Get the canvas element for saving
    function handleSave() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas.png';
        link.click();
    }
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t items-center">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("text")
                }} activated={selectedTool === "text"} icon={<TypeIcon />} />
                <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    style={{ marginLeft: 8, width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
                    title="Pick color"
                />
                <button onClick={handleSave} style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 4, background: '#fff', color: '#222', border: '1px solid #ccc', cursor: 'pointer' }}>
                    Save
                </button>
            </div>
        </div>
}