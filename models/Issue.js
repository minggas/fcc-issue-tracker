/*
- Issue Prototype-

------------------

issue_title: string [required]

issue_text: string [required]

created_by: string [required]

assigned_to: string

status_text: string

created_on: date

updated_on: date

open: boolean

*/

const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    issue_title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    issue_text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    created_by: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    assigned_to: {
        type: String,
        default: ""
    },
    status_text: {
        type: String,
        default: ""
    },
    created_on: {
        type: Date, 
        default: Date.now
    },
    updated_on: {
        type: Date, 
        default: Date.now 
    },
    open: {
        type: Boolean,
        default: true
    }
});

IssueSchema.method('update', function(updates, done) {
    Object.assign(this, updates, {updated_on: new Date});
    this.parent().save(done);
  })
