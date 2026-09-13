const mongoose=require('mongoose');

const urlSchema=new mongoose.Schema({
    originalUrl:{type:String,required:true},
    shortUrl:{type:String,required:true,unique:true},
    clicks: { type: Number, default: 0 },
    createdAt:{type:Date,default:Date.now},
    expiresAt: { type: Date, default: null }

})

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports=mongoose.model('Url',urlSchema);