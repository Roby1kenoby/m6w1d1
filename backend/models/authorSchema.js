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
        birthDate: {
            type: Date
        },
        avatar: {
            type: String
        }
    }
    ,
    {
        collection: "authors"
    }
)

const Authors = model("Author", authorSchema)

export default Authors