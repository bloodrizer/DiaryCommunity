import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    //_id: ObjectId,
    password: String,
    email: {
      unique: true,
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    identities: [{ type: ObjectId, ref: 'Identity' }],
    currentID: ObjectId, 
    current: Object, // current identity
  },
  { timestamps: true }
);

//TODO: see if it is needed
UserSchema.post('findOne', doc => {
  if (doc && doc.currentID) {
    let current = doc.identities.find(i => doc.currentID.toString() === i._id.toString());
    if (current) {
      doc.current = {
        uri: current.uri[current.uri.length - 1],
        name: current.name,
        _id: doc.currentID,
      };
    }
  }
  return doc;
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  findByUsername: (model, queryParameters) => {
    return model.findOne(queryParameters, 'email identities currentID').populate('identities', 'name uri');
  },
});

export default mongoose.model('User', UserSchema);
