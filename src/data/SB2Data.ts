/*

    Adapted from sb2_specmap.js in scratch-vm
    https://github.com/LLK/scratch-vm/blob/a6421b91f8c411ffb3a3b41f32e581d9bcc3bff9/src/serialization/sb2_specmap.js

    Copyright (c) 2016-2020, Massachusetts Institute of Technology, Deborah Servilla
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

export const SB2_TO_SB3_OP_MAP = {
    'forward:': 'motion_movesteps',
    'turnRight:': 'motion_turnright',
    'turnLeft:': 'motion_turnleft',
    'heading:': 'motion_pointindirection',
    'pointTowards:': 'motion_pointtowards',
    'gotoX:y:': 'motion_gotoxy',
    'gotoSpriteOrMouse:': 'motion_goto',
    'glideSecs:toX:y:elapsed:from:': 'motion_glidesecstoxy',
    'changeXposBy:': 'motion_changexby',
    'xpos:': 'motion_setx',
    'changeYposBy:': 'motion_changeyby',
    'ypos:': 'motion_sety',
    'bounceOffEdge': 'motion_ifonedgebounce',
    'setRotationStyle': 'motion_setrotationstyle',
    'xpos': 'motion_xposition',
    'ypos': 'motion_yposition',
    'heading': 'motion_direction',
    'scrollRight': 'motion_scroll_right',
    'scrollUp': 'motion_scroll_up',
    'scrollAlign': 'motion_align_scene',
    'xScroll': 'motion_xscroll',
    'yScroll': 'motion_yscroll',
    'say:duration:elapsed:from:': 'looks_sayforsecs',
    'say:': 'looks_say',
    'think:duration:elapsed:from:': 'looks_thinkforsecs',
    'think:': 'looks_think',
    'show': 'looks_show',
    'hide': 'looks_hide',
    'hideAll': 'looks_hideallsprites',
    'lookLike:': 'looks_switchcostumeto',
    'nextCostume': 'looks_nextcostume',
    'startScene': 'looks_switchbackdropto',
    'changeGraphicEffect:by:': 'looks_changeeffectby',
    'setGraphicEffect:to:': 'looks_seteffectto',
    'filterReset': 'looks_cleargraphiceffects',
    'changeSizeBy:': 'looks_changesizeby',
    'setSizeTo:': 'looks_setsizeto',
    'changeStretchBy:': 'looks_changestretchby',
    'setStretchTo:': 'looks_setstretchto',
    // 'comeToFront': 'looks_gotofrontback',
    // 'goBackByLayers:': 'looks_goforwardbackwardlayers',
    // 'costumeIndex': 'looks_costumenumbername',
    // 'costumeName': 'looks_costumenumbername',
    // 'sceneName': 'looks_backdropnumbername',
    'scale': 'looks_size',
    'startSceneAndWait': 'looks_switchbackdroptoandwait',
    'nextScene': 'looks_nextbackdrop',
    // 'backgroundIndex': 'looks_backdropnumbername',
    'playSound:': 'sound_play',
    'doPlaySoundAndWait': 'sound_playuntildone',
    'stopAllSounds': 'sound_stopallsounds',
    'playDrum': 'music_playDrumForBeats',
    'noteOn:duration:elapsed:from:': 'music_playNoteForBeats',
    'rest:elapsed:from:': 'music_restForBeats',
    'instrument:': 'music_setInstrument',
    'drum:duration:elapsed:from:': 'music_midiPlayDrumForBeats',
    'midiInstrument:': 'music_midiSetInstrument',
    'changeVolumeBy:': 'sound_changevolumeby',
    'setVolumeTo:': 'sound_setvolumeto',
    'volume': 'sound_volume',
    'changeTempoBy:': 'music_changeTempo',
    'setTempoTo:': 'music_setTempo',
    'tempo': 'music_getTempo',
    'clearPenTrails': 'pen_clear',
    'stampCostume': 'pen_stamp',
    'putPenDown': 'pen_penDown',
    'putPenUp': 'pen_penUp',
    'penColor:': 'pen_setPenColorToColor',
    'changePenHueBy:': 'pen_changePenHueBy',
    'setPenHueTo:': 'pen_setPenHueToNumber',
    'changePenShadeBy:': 'pen_changePenShadeBy',
    'setPenShadeTo:': 'pen_setPenShadeToNumber',
    'changePenSizeBy:': 'pen_changePenSizeBy',
    'penSize:': 'pen_setPenSizeTo',
    'whenGreenFlag': 'event_whenflagclicked',
    'whenKeyPressed': 'event_whenkeypressed',
    'whenClicked': 'event_whenthisspriteclicked',
    'whenSceneStarts': 'event_whenbackdropswitchesto',
    'whenIReceive': 'event_whenbroadcastreceived',
    'broadcast:': 'event_broadcast',
    'doBroadcastAndWait': 'event_broadcastandwait',
    'wait:elapsed:from:': 'control_wait',
    'doRepeat': 'control_repeat',
    'doForever': 'control_forever',
    'doIf': 'control_if',
    'doIfElse': 'control_if_else',
    'doWaitUntil': 'control_wait_until',
    'doUntil': 'control_repeat_until',
    'doWhile': 'control_while',
    'doForLoop': 'control_for_each',
    'stopScripts': 'control_stop',
    'whenCloned': 'control_start_as_clone',
    'createCloneOf': 'control_create_clone_of',
    'deleteClone': 'control_delete_this_clone',
    'COUNT': 'control_get_counter',
    'INCR_COUNT': 'control_incr_counter',
    'CLR_COUNT': 'control_clear_counter',
    'warpSpeed': 'control_all_at_once',
    'touching:': 'sensing_touchingobject',
    'touchingColor:': 'sensing_touchingcolor',
    'color:sees:': 'sensing_coloristouchingcolor',
    'distanceTo:': 'sensing_distanceto',
    'doAsk': 'sensing_askandwait',
    'answer': 'sensing_answer',
    'keyPressed:': 'sensing_keypressed',
    'mousePressed': 'sensing_mousedown',
    'mouseX': 'sensing_mousex',
    'mouseY': 'sensing_mousey',
    'soundLevel': 'sensing_loudness',
    'isLoud': 'sensing_loud',
    'senseVideoMotion': 'videoSensing_videoOn',
    'setVideoState': 'videoSensing_videoToggle',
    'setVideoTransparency': 'videoSensing_setVideoTransparency',
    'timer': 'sensing_timer',
    'timerReset': 'sensing_resettimer',
    'getAttribute:of:': 'sensing_of',
    'timeAndDate': 'sensing_current',
    'timestamp': 'sensing_dayssince2000',
    'getUserName': 'sensing_username',
    'getUserId': 'sensing_userid',
    '+': 'operator_add',
    '-': 'operator_subtract',
    '*': 'operator_multiply',
    '/': 'operator_divide',
    'randomFrom:to:': 'operator_random',
    '<': 'operator_lt',
    '=': 'operator_equals',
    '>': 'operator_gt',
    '&': 'operator_and',
    '|': 'operator_or',
    'not': 'operator_not',
    'concatenate:with:': 'operator_join',
    'letter:of:': 'operator_letter_of',
    'stringLength:': 'operator_length',
    '%': 'operator_mod',
    'rounded': 'operator_round',
    'computeFunction:of:': 'operator_mathop',
    'readVariable': 'data_variable',
    'getVar:': 'data_variable',
    'setVar:to:': 'data_setvariableto',
    'changeVar:by:': 'data_changevariableby',
    'showVariable:': 'data_showvariable',
    'hideVariable:': 'data_hidevariable',
    'contentsOfList:': 'data_listcontents',
    'append:toList:': 'data_addtolist',
    'deleteLine:ofList:': 'data_deleteoflist',
    'insert:at:ofList:': 'data_insertatlist',
    'setLine:ofList:to:': 'data_replaceitemoflist',
    'getLine:ofList:': 'data_itemoflist',
    'lineCountOfList:': 'data_lengthoflist',
    'list:contains:': 'data_listcontainsitem',
    'showList:': 'data_showlist',
    'hideList:': 'data_hidelist',
    'procDef': 'procedures_definition',
    'getParam': 'argument_reporter_string_number',
    'call': 'procedures_call',
};

export const SB2_ROTATION_STYLES = {
    'normal': 1,
    'leftRight': 2,
    'none': 0,
};
