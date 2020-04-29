"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class Mp4Segmenter extends stream_1.Transform {
    constructor() {
        super({
            autoDestroy: true
        });
        this._initSegment = null;
        this._parseChunk = this._findFtyp;
        this._mdatBuffer = null;
        this._mdatBufferSize = 0;
        this._mdatLength = 0;
        this.setMaxListeners(0);
    }
    get initSegment() {
        return this._initSegment;
    }
    set initSegment(value) {
        this._initSegment = value;
        this.emit('initSegment', this._initSegment);
    }
    _findFtyp(chunk) {
        const eFtypNotFound = new Error("Ftyp atom not found");
        const eFtypLengthGreaterThanChunkLength = new Error("Ftyp length is greater than chunk length");
        if (chunk[4] !== 0x66 || chunk[5] !== 0x74 || chunk[6] !== 0x79 || chunk[7] !== 0x70) {
            this.emit('error', eFtypNotFound);
            return;
        }
        this._ftypLength = chunk.readUIntBE(0, 4);
        const chunkLength = chunk.length;
        if (this._ftypLength > chunkLength) {
            this.emit('error', eFtypLengthGreaterThanChunkLength);
            return;
        }
        this._parseChunk = this._findMoov;
        this._ftyp = this._ftypLength < chunkLength ? chunk.slice(0, this._ftypLength) : chunk;
        if (this._ftypLength < chunkLength)
            this._parseChunk(this._ftyp);
    }
    _findMoov(chunk) {
        const eMoovNotFound = new Error("Moov atom not found");
        const eMoovLengthGreaterThanChunkLength = new Error("Moov length is greater than chunk length");
        if (chunk[4] !== 0x6D || chunk[5] !== 0x6F || chunk[6] !== 0x6F || chunk[7] !== 0x76) {
            this.emit('error', eMoovNotFound);
            return;
        }
        const chunkLength = chunk.length;
        const moovLength = chunk.readUIntBE(0, 4);
        if (moovLength > chunkLength) {
            this.emit('error', eMoovLengthGreaterThanChunkLength);
            return;
        }
        this.initSegment = Buffer.concat([this._ftyp, chunk], this._ftypLength + moovLength);
        delete this._ftyp;
        delete this._ftypLength;
        this._parseChunk = this._findMoof;
        if (moovLength < chunkLength)
            this._parseChunk(chunk.slice(moovLength));
    }
    _findMoof(chunk) {
        const eMoofNotFound = new Error("Moof atom not found");
        const eMoofLengthGreaterThanChunkLength = new Error("Moof length is greater than chunk length");
        if (chunk[4] !== 0x6D || chunk[5] !== 0x6F || chunk[6] !== 0x6F || chunk[7] !== 0x66) {
            this.emit('error', eMoofNotFound);
            return;
        }
        const chunkLength = chunk.length;
        this._moofLength = chunk.readUIntBE(0, 4);
        if (this._moofLength > chunkLength) {
            this.emit('error', eMoofLengthGreaterThanChunkLength);
            return;
        }
        const data = this._moofLength < chunkLength ? chunk.slice(0, this._moofLength) : chunk;
        if (this.listenerCount('data') > 0)
            this.emit('data', data);
        this._parseChunk = this._findMdat;
        if (this._moofLength < chunkLength)
            this._parseChunk(chunk.slice(this._moofLength));
    }
    _findMdat(chunk) {
        const eMdatNotFound = new Error("Mdat atom not found");
        const eMdatLengthNotGreaterThanChunkLength = new Error("Mdat length is no greater than chunk length");
        const chunkLength = chunk.length;
        if (this._mdatBuffer) {
            this._mdatBuffer.push(chunk);
            this._mdatBufferSize += chunk.length;
            if (this._mdatLength > this._mdatBufferSize)
                return;
            const llama = this._mdatLength < this._mdatBufferSize;
            this._parseChunk = this._findMoof;
            const data = Buffer.concat(this._mdatBuffer, this._mdatLength);
            const sliceIndex = this._mdatBufferSize - this._mdatLength;
            this._mdatBuffer = null;
            this._moofLength = 0;
            this._mdatLength = 0;
            this._mdatBufferSize = 0;
            if (this.listenerCount('data') > 0)
                this.emit('data', data);
            if (llama)
                this._parseChunk(chunk.slice(sliceIndex));
        }
        else {
            if (chunk[4] !== 0x6D || chunk[5] !== 0x64 || chunk[6] !== 0x61 || chunk[7] !== 0x74) {
                this.emit('error', eMdatNotFound);
                return;
            }
            this._mdatLength = chunk.readUIntBE(0, 4);
            if (this._mdatLength < chunkLength) {
                this.emit('error', eMdatLengthNotGreaterThanChunkLength);
                return;
            }
            this._mdatBuffer = [chunk];
            this._mdatBufferSize = chunkLength;
        }
    }
    _transform(chunk, encoding, callback) {
        this._parseChunk(chunk);
        callback();
    }
    _flush(callback) {
        this._parseChunk = this._findFtyp;
        callback();
    }
}
exports.Mp4Segmenter = Mp4Segmenter;
//# sourceMappingURL=Mp4Segmenter.js.map