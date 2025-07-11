import { RoomCanvas } from "@/components/RoomCanvas";
import { HTTP_BACKEND } from "@/config";

export default async function CanvasPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId;

    // Try to fetch the room, if not found, create it
    const res = await fetch(`${HTTP_BACKEND}/room/${roomId}`);
    const data = await res.json();
    if (!data.room) {
        // Create the room (no auth, so adminId is not set)
        await fetch(`${HTTP_BACKEND}/room`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: roomId })
        });
    }

    return <RoomCanvas roomId={roomId} />
}