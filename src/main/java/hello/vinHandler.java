package hello;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.util.Arrays;
import java.util.stream.Collectors;

public class vinHandler extends AbstractWebSocketHandler {

    /*@Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        TextMessage msg = new TextMessage("Hello, " + message.getPayload() + "!");
        session.sendMessage(msg);
    }*/

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        String query = session.getUri().getQuery();
        if (query != null) {
            String vin = Arrays.stream(query.split("&"))
                    .filter(s -> s.startsWith("vin="))
                    .map(s -> s.replaceAll("vin=", ""))
                    .findAny()
                    .orElse(null);

            if (vin != null && !vin.isEmpty()) {
                System.out.println("VIN = " + vin);
            } else {
                System.out.println("No VIN provided in params");
                session.sendMessage(new TextMessage("No VIN provided in params"));
                session.close(CloseStatus.BAD_DATA);
            }
        } else {
            System.out.println("VIN param required!");
            session.sendMessage(new TextMessage("VIN param required!"));
            session.close(CloseStatus.BAD_DATA);
        }

        //ToDo: subscribe to redis channel for provided VIN
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);

        //ToDo: unsubscribe from redis channel for provided VIN
    }
}