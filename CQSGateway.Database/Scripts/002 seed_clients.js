db.clients.insertMany(
    [
        {

            "name": "Mickey Mouse Ltd.",
            "sector": "Disney",
            "entities": [
                { "_id": new ObjectId() ,"name": "MM1", "dissolved": false },
                { "_id": new ObjectId() ,"name": "MM2", "dissolved": false },
                { "_id": new ObjectId() ,"name": "MM3", "dissolved": false },
                { "_id": new ObjectId() ,"name": "MM4", "dissolved": false },
                { "_id": new ObjectId(),"name": "MM5", "dissolved": true }
            ],
            "createdDate": new Date(),
        },
        {

            "name": "Hulk Ltd.",
            "sector": "Avengers",
            "entities": [
                { "_id": new ObjectId(),"name": "H1", "dissolved": false }
            ],
            "createdDate": new Date(),
        },
        {

            "name": "Iron Man Inc.",
            "sector": "Avengers",
            "entities": [
                { "_id": new ObjectId() ,"name": "IM1", "dissolved": false },
                { "_id": new ObjectId() ,"name": "IM2", "dissolved": false },
                { "_id": new ObjectId() ,"name": "IM3", "dissolved": true },
                { "_id": new ObjectId(),"name": "IM4", "dissolved": false }
            ],
            "createdDate": new Date(),
        },
        {

            "name": "Donald Duck PLC",
            "sector": "Disney",
            "entities": [
                { "_id": new ObjectId() ,"name": "DD1", "dissolved": false },
                { "_id": new ObjectId() ,"name": "DD2", "dissolved": false },
                { "_id": new ObjectId(),"name": "DD3", "dissolved": false }
            ],
            "createdDate": new Date(),
        },
        {

            "name": "Goofy LLP",
            "sector": "Disney",
            "entities": [
                {"_id": new ObjectId() ,"name": "G1", "dissolved": false },
                { "_id": new ObjectId(),"name": "G2", "dissolved": false }
            ],
            "createdDate": new Date(),
        }
    ]
);