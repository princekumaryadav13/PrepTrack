const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/../.env" });

const User = require("../models/User");
const Question = require("../models/Question");
const MockTest = require("../models/MockTest");
const Attempt = require("../models/Attempt");
const TestAttempt = require("../models/TestAttempt");

const seedData = async () => {
    try {
        const uri =
            process.env.MONGO_URI && process.env.MONGO_URI.trim() !== ""
                ? process.env.MONGO_URI
                : "mongodb://127.0.0.1:27017/preptrack";

        console.log(`Connecting to MongoDB at: ${uri}...`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
        console.log("Connected to MongoDB for seeding.");

        // 1. Create or update Admin & Student users
        console.log("Seeding users...");
        const adminPassword = await bcrypt.hash("admin123", 10);
        const studentPassword = await bcrypt.hash("student123", 10);

        let adminUser = await User.findOne({ email: "admin@preptrack.com" });
        if (!adminUser) {
            adminUser = await User.create({
                name: "Admin User",
                email: "admin@preptrack.com",
                password: adminPassword,
                role: "admin",
                placementGoal: "Administrator",
                targetCompanies: ["All"],
            });
        }

        let studentUser = await User.findOne({ email: "student@preptrack.com" });
        if (!studentUser) {
            studentUser = await User.create({
                name: "Alex Johnson",
                email: "student@preptrack.com",
                password: studentPassword,
                role: "student",
                placementGoal: "Product-Based Companies",
                targetCompanies: ["Amazon", "Google", "TCS", "Infosys"],
            });
        }

        // 2. Questions across Aptitude, Verbal, DSA, CS Fundamentals
        console.log("Seeding questions...");
        const questionsData = [
            // ==================== APTITUDE ====================
            {
                title: "Work and Time: Pipe and Cistern Efficiency",
                description: "Pipe A can fill a tank in 12 hours, and Pipe B can fill it in 18 hours. If both pipes are opened simultaneously, how long will it take to fill the tank completely?",
                category: "Aptitude",
                topic: "Time & Work",
                difficulty: "Easy",
                options: ["6 hours 45 minutes", "7 hours 12 minutes", "8 hours", "9 hours 30 minutes"],
                correctAnswer: "7 hours 12 minutes",
                explanation: "Rate of A = 1/12, Rate of B = 1/18. Combined rate = (1/12 + 1/18) = (3 + 2)/36 = 5/36 per hour. Total time = 36/5 hours = 7.2 hours = 7 hours 12 minutes.",
                tags: ["Quantitative", "Time & Work", "Pipes"],
                companyTags: ["TCS", "Infosys", "Wipro", "Accenture"],
                createdBy: adminUser._id,
            },
            {
                title: "Relative Speed: Train Crossing a Moving Platform",
                description: "A train 150 meters long passes a telegraph pole in 10 seconds. What is the speed of the train in km/h?",
                category: "Aptitude",
                topic: "Speed Distance Time",
                difficulty: "Easy",
                options: ["45 km/h", "54 km/h", "60 km/h", "72 km/h"],
                correctAnswer: "54 km/h",
                explanation: "Speed in m/s = Distance / Time = 150 / 10 = 15 m/s. Convert to km/h by multiplying by (18/5): 15 * (18/5) = 54 km/h.",
                tags: ["Speed Distance Time", "Trains", "Aptitude"],
                companyTags: ["TCS", "Cognizant", "Wipro"],
                createdBy: adminUser._id,
            },
            {
                title: "Compound Interest vs Simple Interest Difference",
                description: "The difference between simple and compound interests compounded annually on a certain sum of money for 2 years at 4% per annum is $1. The sum is:",
                category: "Aptitude",
                topic: "Percentages & Interest",
                difficulty: "Medium",
                options: ["$625", "$650", "$600", "$500"],
                correctAnswer: "$625",
                explanation: "Difference for 2 years = P * (R / 100)^2. Here, 1 = P * (4 / 100)^2 = P * (1 / 625). Hence, P = $625.",
                tags: ["Finance", "Percentages", "Interest"],
                companyTags: ["TCS", "Infosys", "Accenture"],
                createdBy: adminUser._id,
            },
            {
                title: "Permutations of Circular Arrangements",
                description: "In how many different ways can 6 people sit around a circular dining table?",
                category: "Aptitude",
                topic: "Permutations & Combinations",
                difficulty: "Medium",
                options: ["720", "120", "60", "24"],
                correctAnswer: "120",
                explanation: "Number of circular arrangements of n distinct items = (n - 1)!. For 6 people, it is (6 - 1)! = 5! = 5 * 4 * 3 * 2 * 1 = 120 ways.",
                tags: ["P&C", "Combinatorics", "Math"],
                companyTags: ["Amazon", "Infosys", "TCS"],
                createdBy: adminUser._id,
            },
            {
                title: "Probability with Colored Marbles without Replacement",
                description: "A bag contains 4 red, 5 blue, and 6 green marbles. Two marbles are drawn randomly without replacement. What is the probability that both are red?",
                category: "Aptitude",
                topic: "Probability",
                difficulty: "Medium",
                options: ["2/35", "4/15", "1/10", "6/105"],
                correctAnswer: "2/35",
                explanation: "Total marbles = 4 + 5 + 6 = 15. Probability of first red = 4/15. Probability of second red = 3/14. Total probability = (4/15) * (3/14) = 12/210 = 2/35.",
                tags: ["Probability", "Math"],
                companyTags: ["Amazon", "Google", "TCS"],
                createdBy: adminUser._id,
            },
            {
                title: "Profit and Loss with Marked Price Discount",
                description: "A merchant marks his goods 20% above the cost price and allows a discount of 10% on marked price. What is his overall profit percentage?",
                category: "Aptitude",
                topic: "Profit & Loss",
                difficulty: "Easy",
                options: ["8%", "10%", "12%", "15%"],
                correctAnswer: "8%",
                explanation: "Let CP = 100. Marked Price = 120. Selling price after 10% discount = 120 - 12 = 108. Profit = (108 - 100) / 100 = 8%.",
                tags: ["Profit Loss", "Commercial Math"],
                companyTags: ["TCS", "Cognizant", "Wipro"],
                createdBy: adminUser._id,
            },

            // ==================== VERBAL ====================
            {
                title: "Subject-Verb Agreement with Compound Subjects",
                description: "Choose the grammatically correct sentence:",
                category: "Verbal",
                topic: "Sentence Correction",
                difficulty: "Easy",
                options: [
                    "Neither the manager nor the employees was aware of the policy update.",
                    "Neither the manager nor the employees were aware of the policy update.",
                    "Neither the manager or the employees was aware of the policy update.",
                    "Neither the manager nor the employees has been aware of the policy update."
                ],
                correctAnswer: "Neither the manager nor the employees were aware of the policy update.",
                explanation: "In 'Neither... nor' constructions, the verb agrees with the subject closest to it. 'Employees' is plural, so the plural verb 'were' is required.",
                tags: ["Grammar", "Verbal Ability", "English"],
                companyTags: ["TCS", "Infosys", "Accenture", "Wipro"],
                createdBy: adminUser._id,
            },
            {
                title: "Vocabulary: Antonym of 'Ephemeral'",
                description: "Select the word that is most nearly OPPOSITE in meaning to the word 'EPHEMERAL':",
                category: "Verbal",
                topic: "Synonyms & Antonyms",
                difficulty: "Easy",
                options: ["Transient", "Permanent", "Fleeting", "Fragile"],
                correctAnswer: "Permanent",
                explanation: "'Ephemeral' means lasting for a very short time. The opposite is 'Permanent' or 'Eternal'.",
                tags: ["Vocabulary", "Antonyms", "English"],
                companyTags: ["TCS", "Wipro", "Cognizant"],
                createdBy: adminUser._id,
            },
            {
                title: "Para Jumbles: Logical Coherence",
                description: "Arrange the following sentences in a coherent paragraph:\nP: Artificial intelligence is transforming traditional software development.\nQ: Consequently, companies are rapidly upskilling their engineering workforce.\nR: As a result, automated testing and code generation have become commonplace.\nS: Modern IDEs now integrate intelligent co-pilots natively.",
                category: "Verbal",
                topic: "Para Jumbles",
                difficulty: "Medium",
                options: ["P - S - R - Q", "S - P - Q - R", "P - R - S - Q", "Q - P - S - R"],
                correctAnswer: "P - S - R - Q",
                explanation: "P introduces the overarching theme (AI transforming development). S provides the concrete tool (IDEs integrating co-pilots). R follows with the result (testing & code gen). Q concludes with the human impact (upskilling workforce).",
                tags: ["Para Jumbles", "Logic", "Verbal"],
                companyTags: ["TCS", "Infosys", "Accenture"],
                createdBy: adminUser._id,
            },
            {
                title: "Idioms & Phrases: 'Bite the Bullet'",
                description: "What does the idiom 'to bite the bullet' mean in professional contexts?",
                category: "Verbal",
                topic: "Idioms & Phrases",
                difficulty: "Easy",
                options: [
                    "To surrender during a difficult negotiation",
                    "To face a difficult or unavoidable situation with courage",
                    "To make an impulsive financial investment",
                    "To critique someone aggressively in public"
                ],
                correctAnswer: "To face a difficult or unavoidable situation with courage",
                explanation: "'To bite the bullet' means to force oneself to perform a difficult or unpleasant action that is unavoidable.",
                tags: ["Idioms", "Verbal", "English"],
                companyTags: ["Accenture", "TCS", "Wipro"],
                createdBy: adminUser._id,
            },
            {
                title: "Reading Comprehension: Inference on Algorithmic Bias",
                description: "Passage: 'When training datasets reflect historical disparities, automated models inevitably reproduce and amplify those systemic inequities under the guise of statistical neutrality.'\nWhat can be inferred about algorithmic decisions?",
                category: "Verbal",
                topic: "Reading Comprehension",
                difficulty: "Medium",
                options: [
                    "Statistical algorithms are inherently immune to human error.",
                    "Models are only as objective as the historical data they ingest.",
                    "Data disparities always cancel out when models scale up.",
                    "Neutrality in algorithms is impossible to achieve in mathematics."
                ],
                correctAnswer: "Models are only as objective as the historical data they ingest.",
                explanation: "The passage directly asserts that models reflect historical dataset disparities, meaning objectivity is constrained by training data quality.",
                tags: ["Comprehension", "Inference", "Verbal"],
                companyTags: ["TCS", "Amazon", "Infosys"],
                createdBy: adminUser._id,
            },

            // ==================== DSA ====================
            {
                title: "Two Pointers: Two Sum II - Input Array Is Sorted",
                description: "Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers such that they add up to a specific target number. What is the optimal time and space complexity?",
                category: "DSA",
                topic: "Arrays & Two Pointers",
                difficulty: "Easy",
                options: [
                    "O(N) time and O(1) space using two pointers",
                    "O(N log N) time and O(1) space using binary search",
                    "O(N^2) time and O(1) space using nested loops",
                    "O(N) time and O(N) space using a hash map"
                ],
                correctAnswer: "O(N) time and O(1) space using two pointers",
                explanation: "Because the input array is already sorted, we can maintain left and right pointers moving inward, achieving O(N) time and O(1) auxiliary memory.",
                tags: ["Arrays", "Two Pointers", "DSA"],
                companyTags: ["Amazon", "Google", "Microsoft"],
                createdBy: adminUser._id,
            },
            {
                title: "Linked List: Cycle Detection in Singly Linked List",
                description: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects a loop in a linked list using two pointers. If the fast pointer moves 2 nodes per step and slow pointer moves 1 node, what is the maximum time complexity to detect a cycle of length C with a head tail of length L?",
                category: "DSA",
                topic: "Linked Lists",
                difficulty: "Medium",
                options: ["O(L + C)", "O(L * C)", "O(C^2)", "O(log(L + C))"],
                correctAnswer: "O(L + C)",
                explanation: "The slow pointer enters the cycle in L steps. Once inside, the distance between slow and fast decreases by 1 each step, so they meet in at most C steps. Total time is O(L + C) = O(N).",
                tags: ["Linked List", "Floyd Cycle", "Two Pointers"],
                companyTags: ["Amazon", "Microsoft", "Google"],
                createdBy: adminUser._id,
            },
            {
                title: "Binary Tree: Lowest Common Ancestor (LCA) in a BST",
                description: "In a Binary Search Tree (BST) containing unique keys, given two nodes p and q with p.val < q.val, where is the Lowest Common Ancestor located?",
                category: "DSA",
                topic: "Binary Trees",
                difficulty: "Medium",
                options: [
                    "At the first node visited whose value satisfies p.val <= node.val <= q.val",
                    "Always at the root node of the BST",
                    "At the deepest leaf node between p and q",
                    "In the left subtree of p"
                ],
                correctAnswer: "At the first node visited whose value satisfies p.val <= node.val <= q.val",
                explanation: "In a BST, if both p and q are smaller than current node, LCA is in left subtree. If both are greater, LCA is in right subtree. The first node where paths diverge (p.val <= node.val <= q.val) is the LCA.",
                tags: ["BST", "Trees", "Recursion"],
                companyTags: ["Amazon", "Microsoft", "Google"],
                createdBy: adminUser._id,
            },
            {
                title: "Dynamic Programming: 0/1 Knapsack Complexity",
                description: "What is the time and space complexity of the standard bottom-up Dynamic Programming solution for the 0/1 Knapsack Problem with N items and maximum capacity W?",
                category: "DSA",
                topic: "Dynamic Programming",
                difficulty: "Medium",
                options: [
                    "Time: O(N * W), Space: O(W) using 1D state optimization",
                    "Time: O(2^N), Space: O(N)",
                    "Time: O(N log W), Space: O(1)",
                    "Time: O(N + W), Space: O(N * W)"
                ],
                correctAnswer: "Time: O(N * W), Space: O(W) using 1D state optimization",
                explanation: "The recurrence depends on previous row values. By iterating backwards through weights, the space can be optimized from O(N * W) to a single array of size O(W), while time remains pseudo-polynomial O(N * W).",
                tags: ["DP", "Knapsack", "Algorithms"],
                companyTags: ["Amazon", "Google", "Microsoft"],
                createdBy: adminUser._id,
            },
            {
                title: "Graph Traversal: Dijkstra's Algorithm with Min-Heap",
                description: "What is the time complexity of Dijkstra's Single Source Shortest Path algorithm implemented with an adjacency list and a Binary Min-Heap for a graph with V vertices and E edges?",
                category: "DSA",
                topic: "Graphs",
                difficulty: "Hard",
                options: [
                    "O((V + E) log V)",
                    "O(V^2)",
                    "O(V * E)",
                    "O(E log E + V)"
                ],
                correctAnswer: "O((V + E) log V)",
                explanation: "Extract-Min is performed V times taking O(V log V). Decrease-Key / Push is performed at most E times taking O(E log V). Total time complexity is O((V + E) log V).",
                tags: ["Graphs", "Dijkstra", "Shortest Path"],
                companyTags: ["Google", "Amazon", "Microsoft"],
                createdBy: adminUser._id,
            },
            {
                title: "Stack: Monotonic Stack for Next Greater Element",
                description: "What is the amortized time complexity of finding the Next Greater Element for all elements in an array of size N using a Monotonic Decreasing Stack?",
                category: "DSA",
                topic: "Stack & Queues",
                difficulty: "Easy",
                options: ["O(N)", "O(N log N)", "O(N^2)", "O(1)"],
                correctAnswer: "O(N)",
                explanation: "Every element is pushed to the stack once and popped at most once. Hence, total operations across all iterations is at most 2N, resulting in O(N) amortized time.",
                tags: ["Stack", "Monotonic Stack", "Arrays"],
                companyTags: ["Amazon", "Google"],
                createdBy: adminUser._id,
            },

            // ==================== CS FUNDAMENTALS ====================
            {
                title: "DBMS: Normal Form Definition (BCNF)",
                description: "A relational schema R is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
                category: "CS Fundamentals",
                topic: "Database Management Systems (DBMS)",
                difficulty: "Medium",
                options: [
                    "X is a super key of R",
                    "Y is a prime attribute of R",
                    "X is a candidate key or Y is a prime attribute",
                    "There are no multi-valued dependencies in R"
                ],
                correctAnswer: "X is a super key of R",
                explanation: "BCNF is a stricter version of 3NF. For every non-trivial functional dependency X -> Y, X must strictly be a super key. In 3NF, Y could alternatively be a prime attribute.",
                tags: ["DBMS", "Normalization", "BCNF"],
                companyTags: ["Amazon", "TCS", "Infosys", "Microsoft"],
                createdBy: adminUser._id,
            },
            {
                title: "DBMS: ACID Property of Isolation",
                description: "Which transaction isolation level in SQL prevents Dirty Reads and Non-Repeatable Reads, but may still allow Phantom Reads under default locking semantics?",
                category: "CS Fundamentals",
                topic: "Database Management Systems (DBMS)",
                difficulty: "Medium",
                options: ["Repeatable Read", "Read Committed", "Read Uncommitted", "Serializable"],
                correctAnswer: "Repeatable Read",
                explanation: "'Read Committed' prevents dirty reads. 'Repeatable Read' prevents dirty reads and non-repeatable reads. Only 'Serializable' eliminates phantom reads as well.",
                tags: ["DBMS", "ACID", "Transactions"],
                companyTags: ["Amazon", "Microsoft", "Google"],
                createdBy: adminUser._id,
            },
            {
                title: "Operating Systems: Four Necessary Conditions for Deadlock",
                description: "Which of the following is NOT one of Coffman's four necessary conditions for deadlock to occur in an operating system?",
                category: "CS Fundamentals",
                topic: "Operating Systems",
                difficulty: "Easy",
                options: [
                    "Mutual Exclusion",
                    "Hold and Wait",
                    "Preemptive Resource Scheduling",
                    "Circular Wait"
                ],
                correctAnswer: "Preemptive Resource Scheduling",
                explanation: "The condition is 'NO PREEMPTION' (resources cannot be forcibly confiscated). Preemptive scheduling actually prevents deadlocks.",
                tags: ["OS", "Deadlock", "Process Management"],
                companyTags: ["Amazon", "Microsoft", "TCS"],
                createdBy: adminUser._id,
            },
            {
                title: "Operating Systems: Virtual Memory Page Fault Resolution",
                description: "What happens when a CPU generates a logical address for a memory page whose present/valid bit in the page table entry is 0?",
                category: "CS Fundamentals",
                topic: "Operating Systems",
                difficulty: "Medium",
                options: [
                    "A hardware page fault trap occurs, transferring control to the OS kernel",
                    "The CPU automatically shuts down the requesting thread permanently",
                    "The page table resets all resident frames to zero",
                    "The translation lookaside buffer (TLB) generates a segmentation fault"
                ],
                correctAnswer: "A hardware page fault trap occurs, transferring control to the OS kernel",
                explanation: "A present bit of 0 means the page is currently on disk, triggering a Page Fault hardware interrupt. The OS page fault handler locates the page in swap space and loads it into a free RAM frame.",
                tags: ["OS", "Virtual Memory", "Paging"],
                companyTags: ["Microsoft", "Google", "Amazon"],
                createdBy: adminUser._id,
            },
            {
                title: "Computer Networks: TCP Three-Way Handshake",
                description: "In the TCP 3-way connection establishment handshake, what sequence of control flags are exchanged between Client and Server?",
                category: "CS Fundamentals",
                topic: "Computer Networks",
                difficulty: "Easy",
                options: [
                    "SYN -> SYN-ACK -> ACK",
                    "ACK -> SYN -> ACK",
                    "SYN -> ACK -> FIN",
                    "CONNECT -> ACCEPT -> READY"
                ],
                correctAnswer: "SYN -> SYN-ACK -> ACK",
                explanation: "Client initiates with SYN (synchronize). Server responds with SYN-ACK (synchronize and acknowledge). Client confirms with ACK (acknowledge).",
                tags: ["Networks", "TCP/IP", "Protocols"],
                companyTags: ["Cisco", "Amazon", "Infosys", "TCS"],
                createdBy: adminUser._id,
            },
            {
                title: "OOPs: Runtime Polymorphism & Dynamic Method Dispatch",
                description: "In Object-Oriented Programming (such as Java or C++), runtime polymorphism is primarily achieved through which mechanism?",
                category: "CS Fundamentals",
                topic: "Object-Oriented Programming",
                difficulty: "Easy",
                options: [
                    "Method Overriding with dynamic virtual method tables (vtable)",
                    "Method Overloading with static compiler type checking",
                    "Private access specifiers on instance variables",
                    "Multiple interface declarations without inheritance"
                ],
                correctAnswer: "Method Overriding with dynamic virtual method tables (vtable)",
                explanation: "Runtime polymorphism occurs when a subclass overrides a method of its superclass. The call is resolved at runtime based on the actual object type using vtables.",
                tags: ["OOPs", "Polymorphism", "Java"],
                companyTags: ["Amazon", "TCS", "Infosys", "Wipro"],
                createdBy: adminUser._id,
            },
        ];

        // Upsert questions
        const insertedQuestions = [];
        for (const q of questionsData) {
            const existing = await Question.findOne({ title: q.title });
            if (existing) {
                await Question.updateOne({ _id: existing._id }, { $set: q });
                insertedQuestions.push(existing);
            } else {
                const created = await Question.create(q);
                insertedQuestions.push(created);
            }
        }
        console.log(`Seeded ${insertedQuestions.length} questions.`);

        // 3. Create Mock Tests
        console.log("Seeding mock tests...");
        const tcsQuestions = insertedQuestions
            .filter((q) => q.companyTags.includes("TCS") || q.category === "Aptitude" || q.category === "Verbal")
            .slice(0, 8);
        const amazonQuestions = insertedQuestions
            .filter((q) => q.category === "DSA" || q.category === "CS Fundamentals")
            .slice(0, 8);
        const campusSprintQuestions = insertedQuestions
            .filter((q) => q.category === "Aptitude" || q.category === "Verbal")
            .slice(0, 6);
        const csCoreQuestions = insertedQuestions
            .filter((q) => q.category === "CS Fundamentals")
            .slice(0, 6);

        const mockTestsData = [
            {
                title: "TCS NQT Full Placement Mock Test - 2025",
                description: "Simulate the actual TCS National Qualifier Test covering Quantitative Aptitude, Verbal Ability, and Core Programming fundamentals.",
                category: "Company Specific",
                companyTag: "TCS",
                durationMinutes: 30,
                totalMarks: 40,
                passingMarks: 24,
                difficulty: "Medium",
                questions: tcsQuestions.map((q) => ({ question: q._id, marks: 5 })),
                createdBy: adminUser._id,
                isPublished: true,
            },
            {
                title: "Amazon SDE Technical Readiness Mock",
                description: "Comprehensive technical assessment tailored for Amazon SDE-1 interviews: Algorithmic problem solving, Data Structures, and Core Operating Systems.",
                category: "Company Specific",
                companyTag: "Amazon",
                durationMinutes: 45,
                totalMarks: 40,
                passingMarks: 25,
                difficulty: "Hard",
                questions: amazonQuestions.map((q) => ({ question: q._id, marks: 5 })),
                createdBy: adminUser._id,
                isPublished: true,
            },
            {
                title: "Campus Placement Aptitude & Verbal Sprint",
                description: "Fast-paced timed sprint designed for on-campus mass recruiter drives. Sharpen your speed and accuracy in high-frequency test patterns.",
                category: "Aptitude Special",
                companyTag: "All Companies",
                durationMinutes: 20,
                totalMarks: 30,
                passingMarks: 18,
                difficulty: "Easy",
                questions: campusSprintQuestions.map((q) => ({ question: q._id, marks: 5 })),
                createdBy: adminUser._id,
                isPublished: true,
            },
            {
                title: "CS Core Fundamentals Mock (DBMS, OS, CN, OOP)",
                description: "Deep dive into DBMS normalization, transactions, deadlock management, virtual memory, TCP/IP, and object-oriented paradigms.",
                category: "CS Core Fundamentals",
                companyTag: "All Companies",
                durationMinutes: 25,
                totalMarks: 30,
                passingMarks: 18,
                difficulty: "Medium",
                questions: csCoreQuestions.map((q) => ({ question: q._id, marks: 5 })),
                createdBy: adminUser._id,
                isPublished: true,
            },
        ];

        const insertedTests = [];
        for (const test of mockTestsData) {
            const existing = await MockTest.findOne({ title: test.title });
            if (existing) {
                await MockTest.updateOne({ _id: existing._id }, { $set: test });
                insertedTests.push(existing);
            } else {
                const created = await MockTest.create(test);
                insertedTests.push(created);
            }
        }
        console.log(`Seeded ${insertedTests.length} mock tests.`);

        // 4. Create sample attempts for the demo student so analytics show rich data
        console.log("Seeding sample student performance...");
        const existingAttempts = await Attempt.countDocuments({ user: studentUser._id });
        if (existingAttempts < 5) {
            const sampleAttempts = [
                { user: studentUser._id, question: insertedQuestions[0]._id, selectedAnswer: insertedQuestions[0].correctAnswer, isCorrect: true, timeTaken: 45 },
                { user: studentUser._id, question: insertedQuestions[1]._id, selectedAnswer: insertedQuestions[1].correctAnswer, isCorrect: true, timeTaken: 38 },
                { user: studentUser._id, question: insertedQuestions[2]._id, selectedAnswer: insertedQuestions[2].correctAnswer, isCorrect: true, timeTaken: 62 },
                { user: studentUser._id, question: insertedQuestions[3]._id, selectedAnswer: "720", isCorrect: false, timeTaken: 80 }, // wrong attempt
                { user: studentUser._id, question: insertedQuestions[4]._id, selectedAnswer: "4/15", isCorrect: false, timeTaken: 55 }, // wrong attempt
                { user: studentUser._id, question: insertedQuestions[6]._id, selectedAnswer: insertedQuestions[6].correctAnswer, isCorrect: true, timeTaken: 25 },
                { user: studentUser._id, question: insertedQuestions[7]._id, selectedAnswer: insertedQuestions[7].correctAnswer, isCorrect: true, timeTaken: 18 },
                { user: studentUser._id, question: insertedQuestions[8]._id, selectedAnswer: insertedQuestions[8].correctAnswer, isCorrect: true, timeTaken: 42 },
                { user: studentUser._id, question: insertedQuestions[11]._id, selectedAnswer: insertedQuestions[11].correctAnswer, isCorrect: true, timeTaken: 75 },
                { user: studentUser._id, question: insertedQuestions[12]._id, selectedAnswer: insertedQuestions[12].correctAnswer, isCorrect: true, timeTaken: 90 },
                { user: studentUser._id, question: insertedQuestions[14]._id, selectedAnswer: "Time: O(2^N), Space: O(N)", isCorrect: false, timeTaken: 110 }, // wrong attempt (DP)
                { user: studentUser._id, question: insertedQuestions[17]._id, selectedAnswer: insertedQuestions[17].correctAnswer, isCorrect: true, timeTaken: 35 },
                { user: studentUser._id, question: insertedQuestions[18]._id, selectedAnswer: insertedQuestions[18].correctAnswer, isCorrect: true, timeTaken: 40 },
            ];
            await Attempt.insertMany(sampleAttempts);
            console.log("Seeded sample question attempts.");
        }

        // Seed a sample test attempt
        const existingTestAttempt = await TestAttempt.findOne({ user: studentUser._id });
        if (!existingTestAttempt && insertedTests.length > 0) {
            const firstTest = insertedTests[0];
            await TestAttempt.create({
                user: studentUser._id,
                mockTest: firstTest._id,
                totalScore: 30,
                totalMarks: 40,
                accuracy: 75,
                correctCount: 6,
                wrongCount: 2,
                unattemptedCount: 0,
                timeTakenSeconds: 780,
                passed: true,
                status: "completed",
                answers: [
                    { question: insertedQuestions[0]._id, selectedAnswer: insertedQuestions[0].correctAnswer, isCorrect: true, marksObtained: 5, timeSpentSeconds: 45 },
                    { question: insertedQuestions[1]._id, selectedAnswer: insertedQuestions[1].correctAnswer, isCorrect: true, marksObtained: 5, timeSpentSeconds: 50 },
                    { user: studentUser._id, question: insertedQuestions[2]._id, selectedAnswer: insertedQuestions[2].correctAnswer, isCorrect: true, marksObtained: 5, timeSpentSeconds: 65 },
                ],
            });
            console.log("Seeded sample test attempt.");
        }

        console.log("\n=======================================================");
        console.log("🎉 PREPTRACK DATABASE SEEDED SUCCESSFULLY!");
        console.log("=======================================================");
        console.log("Admin Account:   admin@preptrack.com   / admin123");
        console.log("Student Account: student@preptrack.com / student123");
        console.log("Questions:       " + insertedQuestions.length + " items (Aptitude, Verbal, DSA, CS Core)");
        console.log("Mock Tests:      " + insertedTests.length + " tests");
        console.log("=======================================================\n");

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedData();
