import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { Subscription } from '../../lib/constants';

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            default: 'Guest',
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate(value) {
                const re = /\S+@\S+\.\S+/;
                return re.test(String(value).trim().toLowerCase());
            },
        },
        subscription: {
            type: String,
            enum: {
                values: Object.values(Subscription),
                message: 'Subscription is not allowed',
            },
            default: Subscription.STARTER,
        },
        token: {
            type: String,
            default: null,
        },
        // owner: {
        //     type: SchemaTypes.ObjectId,
        //     ref: 'user',
        //     required: true,
        // },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
        toObject: { virtuals: true },
    },
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcryptjs.genSalt(6);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

const User = model('user', userSchema);

export default User;
