🚀 BFHL Full Stack Challenge
An end-to-end full-stack application built for the SRM Full Stack Engineering Challenge. This project features a robust REST API capable of processing complex hierarchical node relationships, detecting cycles, and calculating tree depths, paired with a sleek, dark-themed frontend for data visualization.
+1

✨ Features
🛠️ Backend API

Endpoint: Built to handle requests at POST /bfhl.


Graph Construction: Builds adjacency lists from an array of $X->Y$ edge strings.


Input Validation: Trims whitespace and strictly validates single uppercase letter formats.
+1


Cycle Detection: Implements Depth First Search (DFS) to accurately detect cyclic relationships within node groups.


Depth Calculation: Calculates the maximum depth (longest root-to-leaf path) for valid trees.


Edge Case Handling: Elegantly manages duplicate edges, multi-parent (diamond) structures, and tie-breakers (lexicographical sorting for roots).
+1


High Performance: Optimized to process inputs of up to 50 nodes in under 3 seconds.

🎨 Frontend UI
Modern Design: A highly polished, responsive dark-mode interface built with Tailwind CSS.


Interactive Input: Clean text-area for pasting JSON arrays with real-time error handling and validation.
+1


Data Visualization: Displays the API response in a readable, structured format.

🌲 Tree View: Recursive React components to visually display the generated node hierarchies.

🔄 Cycle Alerts: Distinct visual indicators for cyclic groups.

📊 Summary Dashboard: Metric cards displaying total trees, cycles, and the largest tree root.

🚫 Invalid/Duplicate Tags: Warning-colored pill badges for invalid entries and duplicate edges.

💻 Tech Stack

Framework: Next.js (App Router) / Node.js 

Frontend Library: React

Styling: Tailwind CSS

Icons: Lucide React


Deployment: Vercel (Recommended) 

📖 API Documentation
Endpoint

POST /bfhl 

Headers

Content-Type: application/json 

Request Body
JSON

{
  "data": ["A->B", "A->C", "B->D"] 
}

(Based on the expected payload format) 

Response Schema
JSON

{
  "user_id": "johndoe_17091999",
  "email_id": "john.doe@college.edu",
  "college_roll_number": "21CS1001",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": {} } },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": ["hello"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}

(Based on the expected response format) 
+3

🚀 Getting Started
Follow these steps to run the project locally.

1. Clone the Repository
Bash

git clone https://github.com/your-username/bfhl-hierarchy-processor.git
cd bfhl-hierarchy-processor
2. Install Dependencies
Bash

npm install
# or
yarn install
3. Configure Environment Variables
Create a .env.local file in the root directory and update your credential placeholders if necessary:

Code snippet

USER_ID="johndoe_17091999"
EMAIL_ID="john.doe@college.edu"
ROLL_NUMBER="21CS1001"
4. Run the Development Server
Bash

npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to interact with the frontend.

💾 Committing Your Changes
Once you have made modifications to the codebase, you can directly stage, commit, and push your changes to your public GitHub repository  using the following commands:

Bash

# 1. Stage all your changes
git add .

# 2. Commit the changes with a descriptive message
git commit -m "feat: update UI styling and fix cycle detection"

# 3. Push the changes to your main branch on GitHub
git push origin main
🧠 Core Algorithm Highlights
The processing logic is divided into strict phases:


Sanitization: The input array is mapped to trim whitespaces.


Routing: Regex checks validity for the X−>Y pattern. Failures go to invalid_entries.
+1


Graph Tracking: * Detects exact duplicates and pushes subsequent occurrences to duplicate_edges.

Ensures a child only has one parent (discarding subsequent parents to break diamonds).


Traversal: A DFS algorithm traverses the adjacency list, maintaining sets for global tracking and cycle detection to correctly populate the hierarchies array.

📄 License
This project is open-source and available under the MIT License.
