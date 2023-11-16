import { chat, getCurrentChatId, hideSwipeButtons, saveChatConditional, showMoreMessages, showSwipeButtons } from "../../../../script.js";
import { getContext } from "../../../extensions.js";
import { executeSlashCommands, registerSlashCommand } from "../../../slash-commands.js";

let currentMessage = null;
const getLastMessage = ()=>Math.max(...Array.from(document.querySelectorAll('#chat .mes[mesid]')).filter(it=>it.getAttribute('mesid')!==null).map(it=>Number(it.getAttribute('mesid'))));
const getFirstMessage = ()=>Math.min(...Array.from(document.querySelectorAll('#chat .mes[mesid]')).filter(it=>it.getAttribute('mesid')!==null).map(it=>Number(it.getAttribute('mesid'))));

const context = getContext();
context.eventSource.on(context.event_types.CHAT_CHANGED, (...args)=>{
	currentMessage = null;
});

const executeSlashCommandsX = async(...args)=>{
	console.log('[NAVCHAT]', ...args);
	await executeSlashCommands(...args);
}




/**
 * Mark multiple messages as hidden (system message).
 * @param {number[]} messageIdList Message IDs
 * @returns
 */
const hideChatMessages = async(messageIdList)=>{
	const chatId = getCurrentChatId();

	if (!chatId || messageIdList.length == 0) return;

	messageIdList.forEach(messageId=>{
		const message = chat[messageId];

		if (!message) return;

		message.is_system = true;
		const messageBlock = $(`.mes[mesid="${messageId}"]`);
		messageBlock.attr('is_system', String(true));
	});

	// Reload swipes. Useful when a last message is hidden.
	hideSwipeButtons();
	showSwipeButtons();

	await saveChatConditional();
}
/**
 * Mark multiple messages as visible (non-system message).
 * @param {number[]} messageIdList Message IDs
 * @returns
 */
const unhideChatMessages = async(messageIdList)=>{
	const chatId = getCurrentChatId();

	if (!chatId || messageIdList.length == 0) return;

	messageIdList.forEach(messageId=>{
		const message = chat[messageId];

		if (!message) return;

		message.is_system = false;
		const messageBlock = $(`.mes[mesid="${messageId}"]`);
		messageBlock.attr('is_system', String(false));
	});

	// Reload swipes. Useful when a last message is hidden.
	hideSwipeButtons();
	showSwipeButtons();

	await saveChatConditional();
}




const navigateToNextMessage = async()=>{
	if (currentMessage === null) {
		console.warn('[NAVCHAT]', 'no current message');
	} else {
		const lastMessage = getLastMessage();
		if (currentMessage >= lastMessage) {
			console.warn('[NAVCHAT]', 'already on last message');
		} else {
			currentMessage++;
			const mes = document.querySelector(`.mes[mesid="${currentMessage}"]`);
			mes.classList.remove('navchat--hidden');
			mes.scrollIntoView();
			await executeSlashCommandsX(`/unhide ${currentMessage}`);
		}
	}
};
const navigateToPrevMessage = async()=>{
	if (currentMessage === null) {
		currentMessage = getLastMessage();
	}
	const firstMessage = getFirstMessage();
	if (currentMessage <= firstMessage) {
		console.warn('[NAVCHAT]', 'already on first message');
	} else {
		document.querySelector(`#chat .mes[mesid="${currentMessage}"]`).classList.add('navchat--hidden');
		await executeSlashCommandsX(`/hide ${currentMessage--}`);
	}
};
const navigateToFirstMessage = async()=>{
	while (document.querySelector('#show_more_messages')) {
		showMoreMessages();
	}
	const mesList = Array.from(document.querySelectorAll('#chat .mes[mesid]')).filter(it=>it.getAttribute('mesid')!==null);
	mesList.forEach(it=>it.classList.add('navchat--hidden'));
	await hideChatMessages(mesList.map(it=>Number(it.getAttribute('mesid'))));
	currentMessage = getFirstMessage() - 1;
	console.log('[NAVCHAT]', 'done');
};
const navigateToLastMessage = async()=>{
	const mesList = Array.from(document.querySelectorAll('#chat .mes[mesid]')).filter(it=>it.getAttribute('mesid')!==null);
	mesList.forEach(it=>it.classList.remove('navchat--hidden'));
	await unhideChatMessages(mesList.map(it=>Number(it.getAttribute('mesid'))));
	currentMessage = getLastMessage();
	document.querySelector(`#chat .mes[mesid="${currentMessage}"]`).scrollIntoView();
	console.log('[NAVCHAT]', 'done');
};

registerSlashCommand('navNext', navigateToNextMessage, ['navnext'], 'navigate to the next message', true, true);
registerSlashCommand('navPrev', navigateToPrevMessage, ['navprev'], 'navigate to the previous message', true, true);
registerSlashCommand('navFirst', navigateToFirstMessage, ['navfirst'], 'navigate to the first message', true, true);
registerSlashCommand('navLast', navigateToLastMessage, ['navlast'], 'navigate to the last message', true, true);