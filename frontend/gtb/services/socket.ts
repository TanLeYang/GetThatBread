import io from "socket.io-client"
import { Socket } from "socket.io-client"

type SocketServerType = "CODING" | "VIDEO"

export function getSocketIOClient(type: SocketServerType): Socket {
  const apiDomain = process.env.NEXT_PUBLIC_GTB_API_DOMAIN

  if (!apiDomain) {
    switch (type) {
      case "CODING":
        return io("ws://localhost:5001")
      case "VIDEO":
        return io("ws://localhost:5002")
    }
  } else {
    const server = `https://${apiDomain}`
    switch (type) {
      case "CODING":
        return io(server, {
          path: "/code-collab/socket.io"
        })
      case "VIDEO":
        return io(server, {
          path: "/video-calling/socket.io"
        })
    }
  }
}
