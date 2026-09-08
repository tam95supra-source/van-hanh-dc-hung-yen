export class GroupRealtime {
  constructor(private state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/connect') {
      if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.state.acceptWebSocket(server);
      const userId = request.headers.get('X-User-ID') || '';
      const deviceId = request.headers.get('X-Device-ID') || '';
      server.serializeAttachment({ userId, deviceId });
      return new Response(null, { status: 101, webSocket: client });
    }

    if (url.pathname === '/broadcast' && request.method === 'POST') {
      const message = await request.text();
      this.broadcast(message);
      return new Response(null, { status: 204 });
    }
    return new Response('Not found', { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== 'string') return;
    if (message === 'ping') {
      ws.send('{"type":"pong"}');
      return;
    }
    // Clients do not publish business mutations through WebSocket. Mutations use HTTP -> D1 commit first.
    ws.send('{"type":"error","code":"WS_MUTATION_FORBIDDEN"}');
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean): Promise<void> {
    try { ws.close(code, reason || (wasClean ? 'closed' : 'abnormal')); } catch {}
  }

  private broadcast(message: string): void {
    for (const ws of this.state.getWebSockets()) {
      try { ws.send(message); } catch {}
    }
  }
}
