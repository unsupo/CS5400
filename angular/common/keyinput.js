function KeyInput() {
    
}

KeyInput.getPressedKey = function () {
    return currentlyPressedKeys;
}
KeyInput.isPressed = function (key) {
    return currentlyPressedKeys[key];
}

var currentlyPressedKeys = {};
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}
KeyInput.setUpKeys = function () {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

KeyInput.KEY_NAMES = {
    BACKSPACE : 8,
    TAB : 9,
    ENTER : 13,
    SHIFT : 16,
    CTRL : 17,
    ALT : 18,
    PAUSE_BREAK : 19,
    CAPS_LOCK : 20,
    ESCAPE : 27,
    SPACE : 32,
    PAGE_UP : 33,
    PAGE_DOWN : 34,
    END : 35,
    HOME : 36,
    LEFT_ARROW : 37,
    UP_ARROW : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW : 40,
    INSERT : 45,
    DELETE : 46,
    ZERO : 48,
    ONE : 49,
    TWO : 50,
    THREE : 51,
    FOUR : 52,
    FIVE : 53,
    SIX : 54,
    SEVEN : 55,
    EIGHT : 56,
    NINE : 57,
    LOWER_A : 65,
    LOWER_B : 66,
    LOWER_C : 67,
    LOWER_D : 68,
    LOWER_E : 69,
    LOWER_F : 70,
    LOWER_G : 71,
    LOWER_H : 72,
    LOWER_I : 73,
    LOWER_J : 74,
    LOWER_K : 75,
    LOWER_L : 76,
    LOWER_M : 77,
    LOWER_N : 78,
    LOWER_O : 79,
    LOWER_P : 80,
    LOWER_Q : 81,
    LOWER_R : 82,
    LOWER_S : 83,
    LOWER_T : 84,
    LOWER_U : 85,
    LOWER_V : 86,
    LOWER_W : 87,
    LOWER_X : 88,
    LOWER_Y : 89,
    LOWER_Z : 90,
    NUMPAD_0 : 96,
    NUMPAD_1 : 97,
    NUMPAD_2 : 98,
    NUMPAD_3 : 99,
    NUMPAD_4 : 100,
    NUMPAD_5 : 101,
    NUMPAD_6 : 102,
    NUMPAD_7 : 103,
    NUMPAD_8 : 104,
    NUMPAD_9 : 105,
    MULTIPLY : 106,
    ADD : 107,
    SUBTRACT : 109,
    DECIMAL : 110,
    DIVIDE : 111,
    F1 : 112,
    F2 : 113,
    F3 : 114,
    F4 : 115,
    F5 : 116,
    F6 : 117,
    F7 : 118,
    F8 : 119,
    F9 : 120,
    F10 : 121,
    F11 : 122,
    F12 : 123,
    NUM_LOCK : 144,
    SCROLL_LOCK : 145,
    SEMI_COLON : 186,
    EQUAL_SIGN : 187,
    COMMA : 188,
    DASH : 189,
    PERIOD : 190,
    FORWARD_SLASH : 191,
    GRAVE_ACCENT : 192,
    OPEN_BRACKET : 219,
    BACK_SLASH : 220,
    CLOSE_BRACKET : 221,
    SINGLE_QUOTE : 222
};

