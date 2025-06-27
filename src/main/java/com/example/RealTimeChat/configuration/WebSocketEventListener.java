package com.example.RealTimeChat.configuration;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.RealTimeChat.chat.ChatMessage;
import com.example.RealTimeChat.chat.MessageType;
import com.example.RealTimeChat.chat.User;

@Component
public class WebSocketEventListener {

	private final SimpMessageSendingOperations messagingTemplate;

	public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@EventListener
	public void handleWebSocketDisConnectListener(SessionDisconnectEvent event) {

		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		User user = (User)headerAccessor.getSessionAttributes().get("user");

		if (user != null ) {
			ChatMessage chatMessage = new ChatMessage(
					MessageType.LEAVE,
					null,
					user
					);
			messagingTemplate.convertAndSend("/topic/public", chatMessage);
		}
	}
}