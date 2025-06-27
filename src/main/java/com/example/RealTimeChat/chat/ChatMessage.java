package com.example.RealTimeChat.chat;

public class ChatMessage {
	// フィールド
	private MessageType type;
	private String content;
	private User sender;


	public ChatMessage(MessageType leave, Object object, User user) {
		// TODO 自動生成されたコンストラクター・スタブ
	}

	public MessageType GetType() {
		return type;
	}

	public void setType(MessageType type) {
		this.type = type;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public String GetContent() {
		return content;
	}

	public User GetSender() {
		return sender;
	}
}
