import Schema from 'validate'

export const prCreatedActionScheme = new Schema({
    orgId: {
        type: Number,
        required: true,
    },
    action: {
        type: {
            type: String,
            required: true,
        },
        comment: {
            type: Boolean,
            required: true,
        },
        verb: {
            type: String,
            required: true,
        }
    },
    provider: {
        type: String,
        required: true,
    },
    data:{
        actor:{
            providerId: {
                required: true,
            },
            name: {
                type: String,
                required: true,
            }
        },
        pr: {
            providerId: {
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: false,
            },
            status: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
            sourceBranch: {
                type: String,
                required: true,
            },
            targetBranch: {
                type: String,
                required: true,
            },
            fullName: {
                type: String,
                required: true,
            },
        },
        repo: {
            id: {
                type: String,
                required: true,
            },
            providerId: {
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: false,
            },
            link: {
                type: String,
                required: true,
            },
            fullName: {
                type: String,
                required: true,
            }
        }
    }
})