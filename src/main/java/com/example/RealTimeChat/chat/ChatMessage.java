package com.example.RealTimeChat.chat;

public class ChatMessage {
	// フィールド
	private MessageType type;
	private String content;
	private User sender;

	public ChatMessage() {

	}

	public ChatMessage(MessageType type, String content, User sender) {
		// TODO 自動生成されたコンストラクター・スタブ
		this.type = type;
		this.content = content;
		this.sender = sender;
	}

	public MessageType getType() {
		return type;
	}

	public void setType(MessageType type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public User getSender() {
		return sender;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

}
