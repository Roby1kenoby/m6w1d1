import {Schema, model} from "mongoose"

const postSchema = new Schema(
    {
        category: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        cover: {
            type: String
        },
        readTime: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        authorId: {
            type: String
        },
        content: {
            type: String,
            required: true
        }
    }
    ,
    {
        collection: "posts"
    }
)

const Posts = model("Post", postSchema)

export default Posts