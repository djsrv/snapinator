/*

    From ArrayBufferStream.js in scratch-audio
    https://github.com/LLK/scratch-audio/blob/5c2f2ca97b25ab0c8a57d6ec088b5a0150781270/src/ArrayBufferStream.js

    Copyright (c) 2016, Massachusetts Institute of Technology
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

class ArrayBufferStream {
    /**
     * ArrayBufferStream wraps the built-in javascript ArrayBuffer, adding the ability to access
     * data in it like a stream, tracking its position.
     * You can request to read a value from the front of the array, and it will keep track of the position
     * within the byte array, so that successive reads are consecutive.
     * The available types to read include:
     * Uint8, Uint8String, Int16, Uint16, Int32, Uint32
     * @param {ArrayBuffer} arrayBuffer - array to use as a stream
     * @param {number} start - the start position in the raw buffer. position
     * will be relative to the start value.
     * @param {number} end - the end position in the raw buffer. length and
     * bytes available will be relative to the end value.
     * @param {ArrayBufferStream} parent - if passed reuses the parent's
     * internal objects
     * @constructor
     */
    constructor (
        arrayBuffer, start = 0, end = arrayBuffer.byteLength,
        {
            _uint8View = new Uint8Array(arrayBuffer)
        } = {}
    ) {
        /**
         * Raw data buffer for stream to read.
         * @type {ArrayBufferStream}
         */
        this.arrayBuffer = arrayBuffer;

        /**
         * Start position in arrayBuffer. Read values are relative to the start
         * in the arrayBuffer.
         * @type {number}
         */
        this.start = start;

        /**
         * End position in arrayBuffer. Length and bytes available are relative
         * to the start, end, and _position in the arrayBuffer;
         * @type {number};
         */
        this.end = end;

        /**
         * Cached Uint8Array view of the arrayBuffer. Heavily used for reading
         * Uint8 values and Strings from the stream.
         * @type {Uint8Array}
         */
        this._uint8View = _uint8View;

        /**
         * Raw position in the arrayBuffer relative to the beginning of the
         * arrayBuffer.
         * @type {number}
         */
        this._position = start;
    }

    /**
     * Return a new ArrayBufferStream that is a slice of the existing one
     * @param  {number} length - the number of bytes of extract
     * @return {ArrayBufferStream} the extracted stream
     */
    extract (length) {
        return new ArrayBufferStream(this.arrayBuffer, this._position, this._position + length, this);
    }

    /**
     * @return {number} the length of the stream in bytes
     */
    getLength () {
        return this.end - this.start;
    }

    /**
     * @return {number} the number of bytes available after the current position in the stream
     */
    getBytesAvailable () {
        return this.end - this._position;
    }

    /**
     * Position relative to the start value in the arrayBuffer of this
     * ArrayBufferStream.
     * @type {number}
     */
    get position () {
        return this._position - this.start;
    }

    /**
     * Set the position to read from in the arrayBuffer.
     * @type {number}
     * @param {number} value - new value to set position to
     */
    set position (value) {
        this._position = value + this.start;
        return value;
    }

    /**
     * Read an unsigned 8 bit integer from the stream
     * @return {number} the next 8 bit integer in the stream
     */
    readUint8 () {
        const val = this._uint8View[this._position];
        this._position += 1;
        return val;
    }

    /**
     * Read a sequence of bytes of the given length and convert to a string.
     * This is a convenience method for use with short strings.
     * @param {number} length - the number of bytes to convert
     * @return {string} a String made by concatenating the chars in the input
     */
    readUint8String (length) {
        const arr = this._uint8View;
        let str = '';
        const end = this._position + length;
        for (let i = this._position; i < end; i++) {
            str += String.fromCharCode(arr[i]);
        }
        this._position += length;
        return str;
    }

    /**
     * Read a 16 bit integer from the stream
     * @return {number} the next 16 bit integer in the stream
     */
    readInt16 () {
        const val = new Int16Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 2; // one 16 bit int is 2 bytes
        return val;
    }

    /**
     * Read an unsigned 16 bit integer from the stream
     * @return {number} the next unsigned 16 bit integer in the stream
     */
    readUint16 () {
        const val = new Uint16Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 2; // one 16 bit int is 2 bytes
        return val;
    }

    /**
     * Read a 32 bit integer from the stream
     * @return {number} the next 32 bit integer in the stream
     */
    readInt32 () {
        const val = new Int32Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 4; // one 32 bit int is 4 bytes
        return val;
    }

    /**
     * Read an unsigned 32 bit integer from the stream
     * @return {number} the next unsigned 32 bit integer in the stream
     */
    readUint32 () {
        const val = new Uint32Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 4; // one 32 bit int is 4 bytes
        return val;
    }
}

module.exports = ArrayBufferStream;
