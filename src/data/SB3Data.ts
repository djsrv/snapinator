/*

    Adapted from sb3.js and sb2_specmap.js in scratch-vm
    https://github.com/LLK/scratch-vm/blob/f4e49563d6ed9b748b31ac1a7c26592f344e4e42/src/serialization/sb3.js
    https://github.com/LLK/scratch-vm/blob/a6421b91f8c411ffb3a3b41f32e581d9bcc3bff9/src/serialization/sb2_specmap.js

    Copyright (c) 2016-2020, Massachusetts Institute of Technology, Dylan Servilla
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

    1. Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

    3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from this
    software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
    TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
    PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
    OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

export const SB3_WORKSPACE_X_SCALE = 1.5;
export const SB3_WORKSPACE_Y_SCALE = 2.2;

export const SB3_VAR_TYPES = {
    VAR_SCALAR_TYPE: '',
    VAR_LIST_TYPE: 'list',
    VAR_BROADCAST_MESSAGE_TYPE: 'broadcast_msg',
    VAR_PARAM_TYPE: 'param'
};

export const SB3_CONSTANTS = {
    INPUT_SAME_BLOCK_SHADOW: 1, // unobscured shadow
    INPUT_BLOCK_NO_SHADOW: 2, // no shadow
    INPUT_DIFF_BLOCK_SHADOW: 3, // obscured shadow

    MATH_NUM_PRIMITIVE: 4,
    POSITIVE_NUM_PRIMITIVE: 5,
    WHOLE_NUM_PRIMITIVE: 6,
    INTEGER_NUM_PRIMITIVE: 7,
    ANGLE_NUM_PRIMITIVE: 8,
    COLOR_PICKER_PRIMITIVE: 9,
    TEXT_PRIMITIVE: 10,
    BROADCAST_PRIMITIVE: 11,
    VAR_PRIMITIVE: 12,
    LIST_PRIMITIVE: 13,
};

export const SB3_TO_SNAP_OP_MAP = {
    'motion_movesteps': 'forward',
    'motion_turnright': 'turn',
    'motion_turnleft': 'turnLeft',
    'motion_pointindirection': 'setHeading',
    'motion_pointtowards': 'doFaceTowards',
    'motion_gotoxy': 'gotoXY',
    'motion_goto': 'doGotoObject',
    // 'motion_glideto': '',
    'motion_glidesecstoxy': 'doGlide',
    'motion_changexby': 'changeXPosition',
    'motion_setx': 'setXPosition',
    'motion_changeyby': 'changeYPosition',
    'motion_sety': 'setYPosition',
    'motion_ifonedgebounce': 'bounceOffEdge',
    // 'motion_setrotationstyle': '',
    'motion_xposition': 'xPosition',
    'motion_yposition': 'yPosition',
    'motion_direction': 'direction',
    // 'motion_scroll_right': '',
    // 'motion_scroll_up': '',
    // 'motion_align_scene': '',
    // 'motion_xscroll': '',
    // 'motion_yscroll': '',
    'looks_sayforsecs': 'doSayFor',
    'looks_say': 'bubble',
    'looks_thinkforsecs': 'doThinkFor',
    'looks_think': 'doThink',
    'looks_show': 'show',
    'looks_hide': 'hide',
    // 'looks_hideallsprites': '',
    'looks_switchcostumeto': 'doSwitchToCostume',
    'looks_nextcostume': 'doWearNextCostume',
    // 'looks_switchbackdropto': 'doSwitchToCostume',
    'looks_changeeffectby': 'changeEffect',
    'looks_seteffectto': 'setEffect',
    'looks_cleargraphiceffects': 'clearEffects',
    'looks_changesizeby': 'changeScale',
    'looks_setsizeto': 'setScale',
    // 'looks_changestretchby': '',
    // 'looks_setstretchto': '',
    'looks_gotofrontback': 'goToLayer',
    'goBackByLayers:': 'goBack',
    // 'looks_goforwardbackwardlayers': '',
    // 'looks_costumenumbername': '',
    'costumeIndex': 'getCostumeIdx', // SB2 opcode
    // 'costumeName': '',
    // 'looks_backdropnumbername': '',
    // 'sceneName': '',
    'looks_size': 'getScale',
    // 'looks_switchbackdroptoandwait': '',
    // 'looks_nextbackdrop': 'doWearNextCostume',
    'sound_play': 'playSound',
    'sound_playuntildone': 'doPlaySoundUntilDone',
    'sound_stopallsounds': 'doStopAllSounds',
    // 'sound_changeeffectby': '',
    // 'sound_seteffectto': '',
    // 'sound_cleareffects': '',
    // 'music_playDrumForBeats': '',
    'music_playNoteForBeats': 'doPlayNote',
    'music_restForBeats': 'doRest',
    // 'music_setInstrument': '',
    // 'music_midiPlayDrumForBeats': '',
    // 'music_midiSetInstrument': '',
    'sound_changevolumeby': 'changeVolume',
    'sound_setvolumeto': 'setVolume',
    'sound_volume': 'getVolume',
    'music_changeTempo': 'doChangeTempo',
    'music_setTempo': 'doSetTempo',
    'music_getTempo': 'getTempo',
    'pen_clear': 'clear',
    'pen_stamp': 'doStamp',
    'pen_penDown': 'down',
    'pen_penUp': 'up',
    'pen_setPenColorToColor': 'setColor',
    'pen_changePenColorParamBy': 'changePenHSVA',
    'pen_setPenColorParamTo': 'setPenHSVA',
    // 'pen_changePenHueBy': '',
    // 'pen_setPenHueToNumber': '',
    // 'pen_changePenShadeBy': '',
    // 'pen_setPenShadeToNumber': '',
    'pen_changePenSizeBy': 'changeSize',
    'pen_setPenSizeTo': 'setSize',
    'event_whenflagclicked': 'receiveGo',
    'event_whenkeypressed': 'receiveKey',
    // 'event_whenthisspriteclicked': '',
    // 'event_whenbackdropswitchesto': '',
    'event_whenbroadcastreceived': 'receiveMessage',
    'event_broadcast': 'doBroadcast',
    'event_broadcastandwait': 'doBroadcastAndWait',
    'control_wait': 'doWait',
    'control_repeat': 'doRepeat',
    'control_forever': 'doForever',
    'control_if': 'doIf',
    'control_if_else': 'doIfElse',
    'control_wait_until': 'doWaitUntil',
    'control_repeat_until': 'doUntil',
    // 'control_while': '',
    // 'control_for_each': '',
    'control_stop': 'doStopThis',
    'control_start_as_clone': 'receiveOnClone',
    'control_create_clone_of': 'createClone',
    'control_delete_this_clone': 'removeClone',
    // 'control_get_counter': '',
    // 'control_incr_counter': '',
    // 'control_clear_counter': '',
    'control_all_at_once': 'doWarp',
    'sensing_touchingobject': 'reportTouchingObject',
    'sensing_touchingcolor': 'reportTouchingColor',
    'sensing_coloristouchingcolor': 'reportColorIsTouchingColor',
    'sensing_distanceto': 'reportDistanceTo',
    'sensing_askandwait': 'doAsk',
    'sensing_answer': 'getLastAnswer',
    'sensing_keypressed': 'reportKeyPressed',
    'sensing_mousedown': 'reportMouseDown',
    'sensing_mousex': 'reportMouseX',
    'sensing_mousey': 'reportMouseY',
    // 'sensing_setdragmode': '',
    // 'sensing_loudness': '',
    // 'sensing_loud': '',
    'videoSensing_videoOn': 'reportVideo',
    // 'videoSensing_videoToggle': '',
    'videoSensing_setVideoTransparency': 'doSetVideoTransparency',
    'sensing_timer': 'getTimer',
    'sensing_resettimer': 'doResetTimer',
    'sensing_of': 'reportAttributeOf',
    'sensing_current': 'reportDate',
    // 'sensing_dayssince2000': '',
    // 'sensing_username': '',
    // 'sensing_userid': '',
    'operator_add': 'reportSum',
    'operator_subtract': 'reportDifference',
    'operator_multiply': 'reportProduct',
    'operator_divide': 'reportQuotient',
    'operator_random': 'reportRandom',
    'operator_lt': 'reportLessThan',
    'operator_equals': 'reportEquals',
    'operator_gt': 'reportGreaterThan',
    'operator_and': 'reportAnd',
    'operator_or': 'reportOr',
    'operator_not': 'reportNot',
    'operator_join': 'reportJoin',
    'operator_letter_of': 'reportLetter',
    'operator_length': 'reportStringSize',
    // 'operator_contains': '',
    'operator_mod': 'reportModulus',
    'operator_round': 'reportRound',
    'operator_mathop': 'reportMonadic',
    // 'data_variable': '',
    'data_setvariableto': 'doSetVar',
    'data_changevariableby': 'doChangeVar',
    'data_showvariable': 'doShowVar',
    'data_hidevariable': 'doHideVar',
    // 'data_listcontents': '',
    'data_addtolist': 'doAddToList',
    'data_deleteoflist': 'doDeleteFromList',
    'data_insertatlist': 'doInsertInList',
    'data_replaceitemoflist': 'doReplaceInList',
    'data_itemoflist': 'reportListItem',
    'data_lengthoflist': 'reportListLength',
    'data_listcontainsitem': 'reportListContainsItem',
    'data_showlist': 'doShowVar',
    'data_hidelist': 'doHideVar',
    'data_itemnumoflist': 'reportListIndex',
    // 'procedures_definition': '',
    // 'argument_reporter_string_number': '',
    // 'argument_reporter_boolean': '',
    // 'procedures_call': '',
};

export const SB3_ARG_MAPS = {
    'motion_movesteps': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'STEPS',
        },
    ],
    'motion_turnright': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DEGREES',
        },
    ],
    'motion_turnleft': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DEGREES',
        },
    ],
    'motion_pointindirection': [
        {
            type: 'input',
            inputOp: 'math_angle',
            inputName: 'DIRECTION',
        },
    ],
    'motion_pointtowards': [
        {
            type: 'input',
            inputOp: 'motion_pointtowards_menu',
            inputName: 'TOWARDS',
        },
    ],
    'motion_gotoxy': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'X',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'Y',
        },
    ],
    'motion_goto': [
        {
            type: 'input',
            inputOp: 'motion_goto_menu',
            inputName: 'TO',
        },
    ],
    'motion_glideto': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SECS',
        },
        {
            type: 'input',
            inputOp: 'motion_goto_menu',
            inputName: 'TO',
        },
    ],
    'motion_glidesecstoxy': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SECS',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'X',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'Y',
        },
    ],
    'motion_changexby': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DX',
        },
    ],
    'motion_setx': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'X',
        },
    ],
    'motion_changeyby': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DY',
        },
    ],
    'motion_sety': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'Y',
        },
    ],
    'motion_ifonedgebounce': [],
    'motion_setrotationstyle': [
        {
            type: 'field',
            fieldName: 'STYLE',
        },
    ],
    'motion_xposition': [],
    'motion_yposition': [],
    'motion_direction': [],
    'motion_scroll_right': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DISTANCE',
        },
    ],
    'motion_scroll_up': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DISTANCE',
        },
    ],
    'motion_align_scene': [
        {
            type: 'field',
            fieldName: 'ALIGNMENT',
        },
    ],
    'motion_xscroll': [],
    'motion_yscroll': [],
    'looks_sayforsecs': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'MESSAGE',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SECS',
        },
    ],
    'looks_say': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'MESSAGE',
        },
    ],
    'looks_thinkforsecs': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'MESSAGE',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SECS',
        },
    ],
    'looks_think': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'MESSAGE',
        },
    ],
    'looks_show': [],
    'looks_hide': [],
    'looks_hideallsprites': [],
    'looks_switchcostumeto': [
        {
            type: 'input',
            inputOp: 'looks_costume',
            inputName: 'COSTUME',
        },
    ],
    'looks_nextcostume': [],
    'looks_switchbackdropto': [
        {
            type: 'input',
            inputOp: 'looks_backdrops',
            inputName: 'BACKDROP',
        },
    ],
    'looks_changeeffectby': [
        {
            type: 'field',
            fieldName: 'EFFECT',
            snapOptionInput: true,
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'CHANGE',
        },
    ],
    'looks_seteffectto': [
        {
            type: 'field',
            fieldName: 'EFFECT',
            snapOptionInput: true,
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VALUE',
        },
    ],
    'looks_cleargraphiceffects': [],
    'looks_changesizeby': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'CHANGE',
        },
    ],
    'looks_setsizeto': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SIZE',
        },
    ],
    'looks_changestretchby': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'CHANGE',
        },
    ],
    'looks_setstretchto': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'STRETCH',
        },
    ],
    'looks_gotofrontback': [
        {
            type: 'field',
            fieldName: 'FRONT_BACK',
            snapOptionInput: true,
        },
    ],
    'looks_goforwardbackwardlayers': [
        {
            type: 'field',
            fieldName: 'FORWARD_BACKWARD',
        },
        {
            type: 'input',
            inputOp: 'math_integer',
            inputName: 'NUM',
        },
    ],
    'looks_costumenumbername': [
        {
            type: 'field',
            fieldName: 'NUMBER_NAME',
        },
    ],
    'looks_backdropnumbername': [
        {
            type: 'field',
            fieldName: 'NUMBER_NAME',
        },
    ],
    'looks_size': [],
    'looks_switchbackdroptoandwait': [
        {
            type: 'input',
            inputOp: 'looks_backdrops',
            inputName: 'BACKDROP',
        },
    ],
    'looks_nextbackdrop': [],
    'sound_play': [
        {
            type: 'input',
            inputOp: 'sound_sounds_menu',
            inputName: 'SOUND_MENU',
        },
    ],
    'sound_playuntildone': [
        {
            type: 'input',
            inputOp: 'sound_sounds_menu',
            inputName: 'SOUND_MENU',
        },
    ],
    'sound_stopallsounds': [],
    'sound_changeeffectby': [
        {
            type: 'field',
            fieldName: 'EFFECT',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VALUE',
        },
    ],
    'sound_seteffectto': [
        {
            type: 'field',
            fieldName: 'EFFECT',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VALUE',
        },
    ],
    'sound_cleareffects': [],
    'music_playDrumForBeats': [
        {
            type: 'input',
            inputOp: 'music_menu_DRUM',
            inputName: 'DRUM',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'BEATS',
        },
    ],
    'music_midiPlayDrumForBeats': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'DRUM',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'BEATS',
        },
    ],
    'music_restForBeats': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'BEATS',
        },
    ],
    'music_playNoteForBeats': [
        {
            type: 'input',
            inputOp: 'note',
            inputName: 'NOTE',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'BEATS',
        },
    ],
    'music_setInstrument': [
        {
            type: 'input',
            inputOp: 'music_menu_INSTRUMENT',
            inputName: 'INSTRUMENT',
        },
    ],
    'music_midiSetInstrument': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'INSTRUMENT',
        },
    ],
    'sound_changevolumeby': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VOLUME',
        },
    ],
    'sound_setvolumeto': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VOLUME',
        },
    ],
    'sound_volume': [],
    'music_changeTempo': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'TEMPO',
        },
    ],
    'music_setTempo': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'TEMPO',
        },
    ],
    'music_getTempo': [],
    'pen_clear': [],
    'pen_stamp': [],
    'pen_penDown': [],
    'pen_penUp': [],
    'pen_setPenColorToColor': [
        {
            type: 'input',
            inputOp: 'colour_picker',
            inputName: 'COLOR',
        },
    ],
    'pen_changePenColorParamBy': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'COLOR_PARAM',
            snapOptionInput: true,
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VALUE',
        },
    ],
    'pen_setPenColorParamTo': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'COLOR_PARAM',
            snapOptionInput: true,
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VALUE',
        },
    ],
    'pen_changePenHueBy': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'HUE',
        },
    ],
    'pen_setPenHueToNumber': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'HUE',
        },
    ],
    'pen_changePenShadeBy': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SHADE',
        },
    ],
    'pen_setPenShadeToNumber': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SHADE',
        },
    ],
    'pen_changePenSizeBy': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SIZE',
        },
    ],
    'pen_setPenSizeTo': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'SIZE',
        },
    ],
    'event_whenflagclicked': [],
    'event_whenkeypressed': [
        {
            type: 'field',
            fieldName: 'KEY_OPTION',
            snapOptionInput: true,
        },
    ],
    'event_whenthisspriteclicked': [],
    'event_whenbackdropswitchesto': [
        {
            type: 'field',
            fieldName: 'BACKDROP',
        },
    ],
    // 'whenSensorGreaterThan': ([, sensor]) => {
    //     if (sensor === 'video motion') {
    //         return {
    //                 'opcode': 'videoSensing_whenMotionGreaterThan',
    //             argMap: [
    //                 // skip the first arg, since we converted to a video specific sensing block
    //                 {},
    //                 {
    //                     type: 'input',
    //                     inputOp: 'math_number',
    //                     inputName: 'REFERENCE'
    //                 }
    //             ]
    //         };
    //     }
    //     return {
    //             'opcode': 'event_whengreaterthan',
    //         argMap: [
    //             {
    //                 type: 'field',
    //                 fieldName: 'WHENGREATERTHANMENU'
    //             },
    //             {
    //                 type: 'input',
    //                 inputOp: 'math_number',
    //                 inputName: 'VALUE'
    //             }
    //         ]
    //     };
    // },
    'event_whenbroadcastreceived': [
        {
            type: 'field',
            fieldName: 'BROADCAST_OPTION',
            variableType: SB3_VAR_TYPES.VAR_BROADCAST_MESSAGE_TYPE,
        },
    ],
    'event_broadcast': [
        {
            type: 'input',
            inputOp: 'event_broadcast_menu',
            inputName: 'BROADCAST_INPUT',
            variableType: SB3_VAR_TYPES.VAR_BROADCAST_MESSAGE_TYPE,
        },
    ],
    'event_broadcastandwait': [
        {
            type: 'input',
            inputOp: 'event_broadcast_menu',
            inputName: 'BROADCAST_INPUT',
            variableType: SB3_VAR_TYPES.VAR_BROADCAST_MESSAGE_TYPE,
        },
    ],
    'control_wait': [
        {
            type: 'input',
            inputOp: 'math_positive_number',
            inputName: 'DURATION',
        },
    ],
    'control_repeat': [
        {
            type: 'input',
            inputOp: 'math_whole_number',
            inputName: 'TIMES',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'control_forever': [
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'control_if': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'CONDITION',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'control_if_else': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'CONDITION',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK2',
        },
    ],
    'control_wait_until': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'CONDITION',
        },
    ],
    'control_repeat_until': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'CONDITION',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'control_while': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'CONDITION',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'control_for_each': [
        {
            type: 'field',
            fieldName: 'VARIABLE',
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'VALUE',
        },
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'control_stop': [
        {
            type: 'field',
            fieldName: 'STOP_OPTION',
            snapOptionInput: true,
        },
    ],
    'control_start_as_clone': [],
    'control_create_clone_of': [
        {
            type: 'input',
            inputOp: 'control_create_clone_of_menu',
            inputName: 'CLONE_OPTION',
        },
    ],
    'control_delete_this_clone': [],
    'control_get_counter': [],
    'control_incr_counter': [],
    'control_clear_counter': [],
    'control_all_at_once': [
        {
            type: 'input',
            inputOp: 'substack',
            inputName: 'SUBSTACK',
        },
    ],
    'sensing_touchingobject': [
        {
            type: 'input',
            inputOp: 'sensing_touchingobjectmenu',
            inputName: 'TOUCHINGOBJECTMENU',
        },
    ],
    'sensing_touchingcolor': [
        {
            type: 'input',
            inputOp: 'colour_picker',
            inputName: 'COLOR',
        },
    ],
    'sensing_coloristouchingcolor': [
        {
            type: 'input',
            inputOp: 'colour_picker',
            inputName: 'COLOR',
        },
        {
            type: 'input',
            inputOp: 'colour_picker',
            inputName: 'COLOR2',
        },
    ],
    'sensing_distanceto': [
        {
            type: 'input',
            inputOp: 'sensing_distancetomenu',
            inputName: 'DISTANCETOMENU',
        },
    ],
    'sensing_askandwait': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'QUESTION',
        },
    ],
    'sensing_answer': [],
    'sensing_keypressed': [
        {
            type: 'input',
            inputOp: 'sensing_keyoptions',
            inputName: 'KEY_OPTION',
            snapOptionInput: true,
        },
    ],
    'sensing_mousedown': [],
    'sensing_mousex': [],
    'sensing_mousey': [],
    'sensing_setdragmode': [
        {
            type: 'field',
            fieldName: 'DRAG_MODE',
        },
    ],
    'sensing_loudness': [],
    'sensing_loud': [],
    'videoSensing_videoOn': [
        {
            type: 'input',
            inputOp: 'videoSensing_menu_ATTRIBUTE',
            inputName: 'ATTRIBUTE',
            snapOptionInput: true,
        },
        {
            type: 'input',
            inputOp: 'videoSensing_menu_SUBJECT',
            inputName: 'SUBJECT',
        },
    ],
    'videoSensing_videoToggle': [
        {
            type: 'input',
            inputOp: 'videoSensing_menu_VIDEO_STATE',
            inputName: 'VIDEO_STATE',
        },
    ],
    'videoSensing_setVideoTransparency': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'TRANSPARENCY',
        },
    ],
    'sensing_timer': [],
    'sensing_resettimer': [],
    'sensing_of': [
        {
            type: 'field',
            fieldName: 'PROPERTY',
        },
        {
            type: 'input',
            inputOp: 'sensing_of_object_menu',
            inputName: 'OBJECT',
        },
    ],
    'sensing_current': [
        {
            type: 'field',
            fieldName: 'CURRENTMENU',
            snapOptionInput: true,
        },
    ],
    'sensing_dayssince2000': [],
    'sensing_username': [],
    'sensing_userid': [],
    'operator_add': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM1',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM2',
        },
    ],
    'operator_subtract': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM1',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM2',
        },
    ],
    'operator_multiply': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM1',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM2',
        },
    ],
    'operator_divide': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM1',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM2',
        },
    ],
    'operator_random': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'FROM',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'TO',
        },
    ],
    'operator_lt': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'OPERAND1',
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'OPERAND2',
        },
    ],
    'operator_equals': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'OPERAND1',
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'OPERAND2',
        },
    ],
    'operator_gt': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'OPERAND1',
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'OPERAND2',
        },
    ],
    'operator_and': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'OPERAND1',
        },
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'OPERAND2',
        },
    ],
    'operator_or': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'OPERAND1',
        },
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'OPERAND2',
        },
    ],
    'operator_not': [
        {
            type: 'input',
            inputOp: 'boolean',
            inputName: 'OPERAND',
        },
    ],
    'operator_join': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'STRING1',
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'STRING2',
        },
    ],
    'operator_letter_of': [
        {
            type: 'input',
            inputOp: 'math_whole_number',
            inputName: 'LETTER',
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'STRING',
        },
    ],
    'operator_length': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'STRING',
        },
    ],
    'operator_mod': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM1',
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM2',
        },
    ],
    'operator_round': [
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM',
        },
    ],
    'operator_mathop': [
        {
            type: 'field',
            fieldName: 'OPERATOR',
            snapOptionInput: true,
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'NUM',
        },
    ],
    'data_variable': [
        {
            type: 'field',
            fieldName: 'VARIABLE',
            variableType: SB3_VAR_TYPES.VAR_SCALAR_TYPE,
        },
    ],
    'data_setvariableto': [
        {
            type: 'field',
            fieldName: 'VARIABLE',
            variableType: SB3_VAR_TYPES.VAR_SCALAR_TYPE,
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'VALUE',
        },
    ],
    'data_changevariableby': [
        {
            type: 'field',
            fieldName: 'VARIABLE',
            variableType: SB3_VAR_TYPES.VAR_SCALAR_TYPE,
        },
        {
            type: 'input',
            inputOp: 'math_number',
            inputName: 'VALUE',
        },
    ],
    'data_showvariable': [
        {
            type: 'field',
            fieldName: 'VARIABLE',
            variableType: SB3_VAR_TYPES.VAR_SCALAR_TYPE,
        },
    ],
    'data_hidevariable': [
        {
            type: 'field',
            fieldName: 'VARIABLE',
            variableType: SB3_VAR_TYPES.VAR_SCALAR_TYPE,
        },
    ],
    'data_listcontents': [
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_addtolist': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'ITEM',
        },
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_deleteoflist': [
        {
            type: 'input',
            inputOp: 'math_integer',
            inputName: 'INDEX',
            snapOptionInput: true,
        },
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_deletealloflist': [
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_insertatlist': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'ITEM',
        },
        {
            type: 'input',
            inputOp: 'math_integer',
            inputName: 'INDEX',
            snapOptionInput: true,
        },
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_replaceitemoflist': [
        {
            type: 'input',
            inputOp: 'math_integer',
            inputName: 'INDEX',
            snapOptionInput: true,
        },
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'ITEM',
        },
    ],
    'data_itemoflist': [
        {
            type: 'input',
            inputOp: 'math_integer',
            inputName: 'INDEX',
            snapOptionInput: true,
        },
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_lengthoflist': [
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_listcontainsitem': [
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'ITEM',
        },
    ],
    'data_showlist': [
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_hidelist': [
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        },
    ],
    'data_itemnumoflist': [
        {
            type: 'input',
            inputOp: 'text',
            inputName: 'ITEM',
        },
        {
            type: 'field',
            fieldName: 'LIST',
            variableType: SB3_VAR_TYPES.VAR_LIST_TYPE,
        }
    ],
    'argument_reporter_string_number': [
        {
            type: 'field',
            fieldName: 'VALUE',
            variableType: SB3_VAR_TYPES.VAR_PARAM_TYPE,
        },
    ],
    'argument_reporter_boolean': [
        {
            type: 'field',
            fieldName: 'VALUE',
            variableType: SB3_VAR_TYPES.VAR_PARAM_TYPE,
        },
    ],
};

export const OBJECT_NAMES = {
    '_edge_': 'edge',
    '_mouse_': 'mouse-pointer',
    '_myself_': 'myself',
    '_random_': 'random position',
    'this sprite': 'myself',
};

export const SB3_ROTATION_STYLES = {
    'all around': 1,
    'left-right': 2,
    'don\'t rotate': 0,
};
