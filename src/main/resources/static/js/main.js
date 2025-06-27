var stompClient;

let userId;
let userName;

const userFormModal = new bootstrap.Modal($("#userFormModal"));
const chatModal = new bootstrap.Modal($("#chatModal"));

userFormModal.show();

/**
 * websocket通信を開始する
 *
 * websocket通信開始処理を行う。
 */
function connect(event) {
	userName = $("#userName").val();

	var socket = new SockJS("/ws");
	stompClient = Stomp.over(socket);

	if (userName) {
		stompClient.connect(
			{},
			onConnected,
			onError
		);
	}
	event.preventDefault();
}

/**
 * websocket通信開始処理を行う
 *
 * メッセージの受信設定を行い、チャットに参加するユーザーの名前を送信する。
 * チャットルーム画面を開設する。
 */
function onConnected() {
	// /topic/publlicに対し、メッセージの受信を行う。
	stompClient.subscribe("/topic/public", onMessageReceived);

	// チャットに参加するユーザーの名前を送信。
	userId = self.crypto.randomUUID();	// ユーザーIDの採番
	stompClient.send("/app/chat",
		{},
		JSON.stringify({
			sender: {
				id: userId,
				name: userName
			},
			type: "JOIN"
		})
	);

	showChatModal();
	$("#messageContent").focus();
}

function onError(e) {
	alert("通信エラー\n" + e);
}

/**
 * メッセージ送信処理
 *
 * 入力されたチャット本文を送信する。
 */
function sendMessage(event) {
	var messageContent = $("#messageContent").val()

	if (messageContent) {
		var chatMessage = {
			sender: {
				id: userId,
				name: userName
			},
			content: messageContent,
			type: "CHAT"
		};
		stompClient.send(
			"/app/chat",
			{},
			JSON.stringify(chatMessage)
		);
		$("#messageContent").val("");
	}
	event.preventDefault();
	$('#messageContent').trigger('focus')
}

/**
 * チャットルーム退室時処理
 *
 * 通信を切断し、ユーザー入力フォームを表示する。
 */
function disConnect() {

	if (stompClient) {
		stompClient.disconnect();
		showFormModal();
	}
}

/**
 * メッセージ受信処理
 *
 * 受信したメッセージを画面に反映する。
 */
function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);
	if (message.type === "JOIN") {
		if (!userId) {
			userId = message.sender.id;
		}
		joinRoomMessage(message.sender);
	} else if (message.type === "LEAVE") {
		leaveRoomMessage(message.sender);
	} else {
		addMessage(message.sender, message.content);
	}
	$('#messageArea').scrollTop($('#messageArea')[0].scrollHeight);
}

function escape_html(string) {
	return string.replace(/[&'`"<>]/g, function(match) {
		return {
			'&': '&amp;',
			"'": '&#x27;',
			'`': '&#x60;',
			'"': '&quot;',
			'<': '&lt;',
			'>': '&gt;',
		}[match]
	});
}

/**
 * モーダル切り替え処理
 */

// ユーザーフォーム画面の表示
function showFormModal() {
	chatModal.hide();
	userFormModal.show();
}
// チャット画面の表示
function showChatModal() {
	userFormModal.hide();
	chatModal.show();
}

/**
 *  受信したチャット本文の画面反映処理
 */
function addMessage(sender, messageContent) {
	$("#messageCard").append(
		`<div class="row">`
		+ `<div class="col-md-4${(sender.id === userId) && ' ms-auto'}">`
		+ `<div class="card ${(sender.id === userId) ? 'text-bg-success' : 'text-bg-light'} mb-3" style="max-width: 18rem;">`
		+ `<div class="card-header">${escape_html(sender.name)}</div>`
		+ `<div class="card-body">`
		+ `<p class="card-text">${escape_html(messageContent)}</p>`
		+ `</div>`
		+ `</div>`
		+ `</div>`
		+ `</div>`
		+ `</div>`
	)
}

/**
 * ユーザー参加通知処理
 *
 * ユーザーがチャットルームに参加したことを通知する。
 */
function joinRoomMessage(user) {
	$("#messageCard").append(
		`<div class="row">`
		+ `<div class="alert alert-info p-0 w-75" role="alert">`
		+ `${user.name} さんが入室しました。`
		+ `</div>`
		+ `</div>`
	)
}

/**
 * ユーザー退室通知処理
 *
 * ユーザーがチャットルームから退室したことを通知する。
 */
function leaveRoomMessage(user) {
	$("#messageCard").append(
		`<div class="row">`
		+ `<div class="alert alert-secondary p-0 w-75" role="alert">`
		+ `${user.name} さんが退室しました。`
		+ `</div>`
		+ `</div>`
	)
}

/**
 * チャット画面を開設したとき、メッセージ入力フォームにフォーカスを設定する。
 */
$('#chatModal').on('shown.bs.modal', function() {
	$('#messageContent').trigger('focus');
})

/**
 * ユーザー入力画面を開設したとき、ユーザー名入力フォームにフォーカスを設定する。
 */
$('#userFormModal').on('shown.bs.modal', function() {
	$('#userName').trigger('focus');
})

/**
 * イベント処理
 */
$("#userForm").on("submit", connect);
$("#chatForm").on("submit", sendMessage);
$("#chatExitButton").on("click", disConnect);