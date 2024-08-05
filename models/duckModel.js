import { Schema, model } from 'mongoose';

const duckSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 100,
        },
        imgUrl: {
            type: String,
            required: true,
            maxLength: 510,
            // match: [
            //     /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
            //     'must be a valid URL',
            // ],
        },
        quote: {
            type: String,
            default: 'Count on me to become bug free!',
            maxLength: 1000,
        },
    },
    { timestamps: true }
);

export default model('Duck', duckSchema);
