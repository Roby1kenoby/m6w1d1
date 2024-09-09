import {Schema, model} from "mongoose"

const authorSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            require: true
        },
        birthDate: {
            type: Date
        },
        avatar: {
            type: String
        },
        createdAt: Date,
        googleId: String
        
    }
    ,
    {
        collection: "authors",
        timestamps: true
    }
)

const Authors = model("Author", authorSchema)

export default Authors