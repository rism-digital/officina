export const actionCatalog = {
    note: [
        {
            name: "Add accidental",
            action: "add-accidental",
        },
        {
            name: "Add articulation",
            action: "add-articulation",
        },
    ],
};

export const actionDefinitions = {
    "add-accidental": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "accid",
                    elementId: "{{targetId}}",
                    insertMode: "appendChild",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "accid",
                    value: "s",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-articulation": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "artic",
                    elementId: "{{targetId}}",
                    insertMode: "appendChild",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "artic",
                    value: "acc",
                },
            },
                        {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "color",
                    value: "blue",
                },
            },
            {
                action: "commit",
            },
        ],
    },
};
