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
    'looks_switchbackdropto': 'doSwitchToCostume', // TEMPORARY
    'looks_changeeffectby': 'changeEffect',
    'looks_seteffectto': 'setEffect',
    'looks_cleargraphiceffects': 'clearEffects',
    'looks_changesizeby': 'changeScale',
    'looks_setsizeto': 'setScale',
    // 'looks_changestretchby': '',
    // 'looks_setstretchto': '',
    'looks_gotofrontback': 'goToLayer',
    // 'looks_goforwardbackwardlayers': '',
    // 'looks_costumenumbername': '',
    'costumeIndex': 'getCostumeIdx',
    // 'costumeName': '',
    // 'looks_backdropnumbername': '',
    // 'sceneName': '',
    'looks_size': 'getScale',
    // 'looks_switchbackdroptoandwait': '',
    'looks_nextbackdrop': 'doWearNextCostume', // TEMPORARY
    'backgroundIndex': 'getCostumeIdx', // TEMPORARY
    'sound_play': 'playSound',
    'sound_playuntildone': 'doPlaySoundUntilDone',
    'sound_stopallsounds': 'doStopAllSounds',
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
    'pen_changePenColorParamBy': 'setPenHSVA',
    'pen_setPenColorParamTo': 'changePenHSVA',
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
    'operator_length': 'repotrStringSize',
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
    // 'procedures_definition': '',
    // 'argument_reporter': '',
    // 'procedures_call': '',
};

export const C_ARGS = {
    'control_repeat': [1],
    'control_forever': [0],
    'control_if': [1],
    'control_if_else': [1, 2],
    'control_repeat_until': [1],
    'control_while': [1],
    'control_for_each': [3],
};

export const LIST_ARGS = {
    'data_addtolist': [1],
    'data_deleteoflist': [1],
    'data_insertatlist': [2],
    'data_replaceitemoflist': [1],
    'data_itemoflist': [1],
    'data_lengthoflist': [0],
    'data_listcontainsitem': [0],
};

export const COLOR_ARGS = {
    'pen_setPenColorToColor': [0],
    'sensing_touchingcolor': [0],
    'sensing_coloristouchingcolor': [0, 1],
};

export const OPTION_ARGS = {
    'looks_changeeffectby': [0],
    'looks_seteffectto': [0],
    'sensing_current': [0],
    'videoSensing_videoOn': [0],
    'data_deleteoflist': [0],
};

export const OBJECT_NAMES = {
    '_edge_': 'edge',
    '_mouse_': 'mouse-pointer',
    '_myself_': 'myself',
    '_random_': 'random position',
    'this sprite': 'myself',
};
