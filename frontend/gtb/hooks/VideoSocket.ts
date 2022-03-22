import { useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";
import { allVideoUsersEvent, joinVideoRoomEvent, userVideoJoinedEvent, sendingVideoSignalEvent, returningVideoSignalEvent, receiveReturningVideoSignalEvent } from "../constants/socketEvents";
import { any } from "ramda";
import { toNamespacedPath } from "path";

export type PeerState = {
  peerId: string
  instance: Peer.Instance
}

// provides video calling functionality
// supports calling of multiple other users
export function useVideoSocket(roomCode: string, myName: string) {

  const myVideo = useRef<any>()
  const socketRef = useRef<Socket>()
  const peersRef = useRef<PeerState[]>([])

  const [peers, setPeers] = useState<PeerState[]>([])

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_VIDEO_SERVER_URL || "ws://localhost:5002"
    const socket = io(serverUrl)

    socketRef.current = socket

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream
        }

        socket.emit(joinVideoRoomEvent, roomCode)
        socket.on(allVideoUsersEvent, (users: string[]) => {
          const peers = users.map((user) => {
            const peer = createPeerFromExistingUser(socket.id, user, currentStream)
            peersRef.current.push(peer)
            return peer
          })

          setPeers(peers)
        })

        socket.on(userVideoJoinedEvent, ({ signal, callerId }) => {
          const peer = addPeerFromIncomingUser(signal, callerId, currentStream)

          peersRef.current.push(peer)

          setPeers(peers => [...peers, peer])
        })

        socket.on(receiveReturningVideoSignalEvent, ({ from, signal }) => {
          const peer = peersRef.current.find(p => p.peerId === from)
          peer?.instance.signal(signal)
        })
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createPeerFromExistingUser = (from: string, to: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    })

    peer.on("signal", (signal) => {
      socketRef.current?.emit(sendingVideoSignalEvent, {
        signal,
        callerId: from,
        recipientId: to
      })
    })

    return {
      peerId: to,
      instance: peer
    }
  }

  const addPeerFromIncomingUser = (signal: any, callerId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    })

    peer.on("signal", (signal) => {
      socketRef.current?.emit(returningVideoSignalEvent, {
        signal,
        callerId
      })
    })

    peer.signal(signal)

    return {
      peerId: callerId,
      instance: peer
    }
  }

  return {
    myVideo,
    peers
  }
}
