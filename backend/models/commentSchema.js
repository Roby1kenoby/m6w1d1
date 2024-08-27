import {Schema, model} from "mongoose"
import Authors from './authorSchema.js'

const commentSchema = new Schema(
    {
        authorId: {
            // qui avrò l'id dell'autore del commento
            type: Schema.Types.ObjectId,
            ref: "Author"
        },
        comment: {
            type: String,
            min: 10,
            max: 3000,
            required: true
        },
        postId: {
            // qui avrò l'id del post a cui sarà legato il commento
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    }
    ,
    {
        collection: "comments",
        // voglio che venga memorizzata anche la data di creazione
        timestamps: true
    }
)

const Comments = model("Comment", commentSchema)

export default Comments