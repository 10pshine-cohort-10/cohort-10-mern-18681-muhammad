import {Schema,model,Model} from 'mongoose'
import { INoteDocument } from "../types/note.types.js";

const noteSchema =new Schema<INoteDocument>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true,
        maxLength:100
    },
    content:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    isArchived:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

noteSchema.index({ userId: 1, isArchived: 1, isPinned: -1, updatedAt: -1 });

noteSchema.index({ userId: 1, tags: 1 });
const noteModel: Model<INoteDocument> = model<INoteDocument>("Note", noteSchema);
export default noteModel;