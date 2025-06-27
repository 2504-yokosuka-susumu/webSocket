package com.example.RealTimeChat.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

	@MessageMapping("/chat")
	@SendTo("/topic/public")
	public ChatMessage chat(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor heander) {

		if (chatMessage.getType() == MessageType.JOIN) {
			heander.getSessionAttributes().put("user", chatMessage.getSender());
		}

		return chatMessage;
	}

}