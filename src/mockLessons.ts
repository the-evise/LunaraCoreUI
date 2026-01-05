import type {
    Lesson
} from "./components/LessonContent.tsx"; // path to your interfaces

export const lessons: Lesson[] = [
    // -------- Lesson 1: Airport --------
    {
        id: "airport",
        title: "Airport",
        vocabularyItems: [
            {
                word: "passport",
                meaningEn: "an ID you use for international travel",
                meaningFa: "گذرنامه برای سفر خارجی",
                examples: [
                    "He forgot his passport at home.",
                    "Please show your passport at the gate.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-124.jpg",
            },
            {
                word: "boarding pass",
                meaningEn: "a ticket that lets you enter the airplane",
                meaningFa: "کارت سوار شدن به هواپیما",
                examples: [
                    "You can download your boarding pass on your phone.",
                    "Don’t lose your boarding pass before boarding.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-264.jpg",
            },
            {
                word: "luggage",
                meaningEn: "bags and suitcases you take on a trip",
                meaningFa: "چمدان‌ها و کیف‌های سفر",
                examples: [
                    "My luggage was too heavy.",
                    "She carried all her luggage by herself.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-524.jpg",
            },
        ],
        reading: {
            title: "A Morning at the Airport",
            readingText: [
                "Robert arrives at the airport early.",
                "He shows his passport and boarding pass at the check-in counter.",
                "After checking his luggage, he waits at the gate for his flight.",
            ],
            image: "https://yavuzceliker.github.io/sample-images/image-89.jpg",
            points: [
                {
                    title: "Skim",
                    body: "Look for numbers and key travel words.",
                },
                {
                    title: "Scan",
                    body: "Find details (time, gate, flight number).",
                    description: "My flight number is 245, and the departure is at 10 am. I go through security and then wait at gate 12. There is a small delay, so the boarding starts later, While waiting, I sit on my seat near the gate and read a book. Finally,",
                },
            ]
        },
        grammar: {
            title: "Present Continuous Tense",
            explanationImg: "https://yavuzceliker.github.io/sample-images/image-224.jpg",
            examples: [
                "He is waiting for his flight.",
                "They are checking their luggage.",
            ],
        },
        review: {
            reading: {
                title: "Ready to Fly",
                readingText: [
                    "Robert is waiting near gate 12.",
                    "He is reading his boarding pass carefully.",
                    "The plane is leaving in twenty minutes.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-89.jpg",
            },
            grammar: {
                title: "Summary: Present Continuous",
                explanationImg: "https://yavuzceliker.github.io/sample-images/image-224.jpg",
                examples: [
                    "Use 'am/is/are + verb-ing' to talk about now.",
                    "Example: I am walking to the gate.",
                ],
            },
            tips: [
                "Use present continuous for actions happening now.",
                "Add ‘ing’ to the base verb.",
            ],
            reviewQuizData: {
                questions: [
                    {
                        question: "Which sentence is in the present continuous tense?",
                        options: [
                            "He waits for the plane.",
                            "He is waiting for the plane.",
                            "He waited for the plane.",
                            "He has waited for the plane.",
                        ],
                        correctIndex: 1,
                    },
                ],
            },
        },
        quiz: {
            questions: [
                {
                    question: "Which word means 'bags you take when traveling'?",
                    options: ["passport", "ticket", "luggage", "boarding pass"],
                    correctIndex: 2,
                },
                {
                    question: "Which of these shows a present continuous action?",
                    options: [
                        "He waits at the gate.",
                        "He is waiting at the gate.",
                        "He waited at the gate.",
                        "He will wait at the gate.",
                    ],
                    correctIndex: 1,
                },
            ],
        },
    },

    // -------- Lesson 2: Hotel --------
    {
        id: "hotel",
        title: "Hotel",
        vocabularyItems: [
            {
                word: "reservation",
                meaningEn: "a booking for a room or table",
                meaningFa: "رزرو",
                examples: [
                    "I have a reservation for two nights.",
                    "They made a reservation online.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-144.jpg",
            },
            {
                word: "reception",
                meaningEn: "the front area of a hotel where you check in",
                meaningFa: "پذیرش هتل",
                examples: [
                    "Please go to the reception to check in.",
                    "The reception is open 24 hours a day.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-289.jpg",
            },
            {
                word: "room service",
                meaningEn: "food or drinks delivered to your room",
                meaningFa: "سرویس اتاق",
                examples: [
                    "I ordered breakfast from room service.",
                    "Room service closes at midnight.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-284.jpg",
            },
        ],
        reading: {
            title: "Checking In",
            readingText: [
                "Robert arrives at the hotel after a long flight.",
                "He goes to the reception and shows his reservation.",
                "The receptionist gives him his room key with a smile.",
            ],
            image: "https://yavuzceliker.github.io/sample-images/image-69.jpg",
        },
        grammar: {
            title: "Simple Past Tense",
            explanationImg: "https://yavuzceliker.github.io/sample-images/image-227.jpg",
            examples: [
                "He checked into the hotel yesterday.",
                "They stayed for two nights.",
            ],
        },
        review: {
            reading: {
                title: "Hotel Review",
                readingText: [
                    "Robert stayed in a quiet hotel near the city center.",
                    "He ordered dinner from room service and rested well.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-79.jpg",
            },
            grammar: {
                title: "Summary: Simple Past",
                explanationImg: "https://yavuzceliker.github.io/sample-images/image-227.jpg",
                examples: [
                    "Use simple past for finished actions.",
                    "Example: He stayed in the hotel last night.",
                ],
            },
            tips: [
                "Add ‘ed’ for regular past verbs.",
                "Use irregular forms for others (go → went).",
            ],
            reviewQuizData: {
                questions: [
                    {
                        question: "Which sentence is in the simple past tense?",
                        options: [
                            "He is checking in.",
                            "He checks in.",
                            "He checked in.",
                            "He has checked in.",
                        ],
                        correctIndex: 2,
                    },
                ],
            },
        },
        quiz: {
            questions: [
                {
                    question: "Where do you check in at a hotel?",
                    options: ["reception", "room service", "gym", "restaurant"],
                    correctIndex: 0,
                },
                {
                    question: "Which word means 'a booking for a room'?",
                    options: ["reservation", "reception", "key", "suite"],
                    correctIndex: 0,
                },
            ],
        },
    },

    // -------- Lesson 3: Directions --------
    {
        id: "directions",
        title: "Directions",
        vocabularyItems: [
            {
                word: "turn left",
                meaningEn: "move to the left side when walking or driving",
                meaningFa: "به چپ بپیچید",
                examples: [
                    "Turn left at the corner.",
                    "Then turn left again near the post office.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-275.jpg",
            },
            {
                word: "go straight",
                meaningEn: "continue in the same direction",
                meaningFa: "مستقیم بروید",
                examples: [
                    "Go straight until you reach the park.",
                    "Keep going straight after the traffic light.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-334.jpg",
            },
            {
                word: "intersection",
                meaningEn: "a place where two roads cross each other",
                meaningFa: "چهارراه",
                examples: [
                    "Turn right at the next intersection.",
                    "The bank is near the intersection.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-785.jpg",
            },
        ],
        reading: {
            title: "Finding the Café",
            readingText: [
                "A tourist asks, 'Excuse me, how can I get to the café?'",
                "The local replies, 'Go straight, then turn left at the intersection.'",
                "The tourist says thank you and follows the directions carefully.",
            ],
            image: "https://yavuzceliker.github.io/sample-images/image-88.jpg",
        },
        grammar: {
            title: "Imperatives (Giving Directions)",
            explanationImg: "https://yavuzceliker.github.io/sample-images/image-487.jpg",
            examples: [
                "Go straight.",
                "Turn right at the corner.",
            ],
        },
        review: {
            reading: {
                title: "Exploring the City",
                readingText: [
                    "Robert is walking to the museum.",
                    "He turns left at the intersection and goes straight.",
                ],
                image: "https://yavuzceliker.github.io/sample-images/image-87.jpg",
            },
            grammar: {
                title: "Summary: Imperatives",
                explanationImg: "https://yavuzceliker.github.io/sample-images/image-567.jpg",
                examples: [
                    "Use base verbs to give directions: Go, Turn, Stop.",
                    "No subject needed.",
                ],
            },
            tips: ["Keep sentences short and clear.", "Use polite tone when giving directions."],
            reviewQuizData: {
                questions: [
                    {
                        question: "Which sentence gives a direction?",
                        options: [
                            "He goes to the park.",
                            "Go straight ahead.",
                            "He went to the park.",
                            "He is going to the park.",
                        ],
                        correctIndex: 1,
                    },
                ],
            },
        },
        quiz: {
            questions: [
                {
                    question: "What does 'turn left' mean?",
                    options: [
                        "Go to the right side",
                        "Move to the left side",
                        "Stay straight",
                        "Go backward",
                    ],
                    correctIndex: 1,
                },
                {
                    question: "What is an intersection?",
                    options: [
                        "A long road",
                        "A bus station",
                        "A place where two roads cross",
                        "A restaurant corner",
                    ],
                    correctIndex: 2,
                },
            ],
        },
    },
];
