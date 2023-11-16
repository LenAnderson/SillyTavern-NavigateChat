# Chat Navigation / Replay

Adds slash commands to navigate through existing chat messages. Can jump to previous / next or first / last message and hides all future messages past that.

Hidden messages are also marked as invisible (i.e., system messages) as if the `/hide` slash command was used to update the avatar's emotes according to the latest visible message.




## Installation

Use ST's inbuilt extension installer.




## Usage

- `/navFirst` (or `/navfirst`) jumps to the first message in the current chat. Actually, it even hides the first message so that you see a blank chat window and have a chance to admire your background image.
- `/navLast` (or `/navlast`) jumps to the last message in the current chat. This unhides all messages. Does nothing if you are already seeing the full chat.
- `/navPrev` (or `/navprev`) jumps to the previous message, i.e., the message currently visible at the bottom of the chat is hidden.
- `/navNext` (or `/navnext`) jumps to the next message. Does nothing if you are already seeing the full chat.


### Quick Replies

If you want to have buttons to easily navigate through your chat (or replay it like a (somewhat) visual novel) you can set up some quick replies to call the four slash commands and maybe use some unicode arrows as the button text (e.g., ⭱🠉🠋⭳ or ⏮️◀️▶️⏭️).




## Requirements

SillyTavern version >=1.10.9