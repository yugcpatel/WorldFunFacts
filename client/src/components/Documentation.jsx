import { Link } from "react-router-dom";
import "./Documentation.css";

/**
 * Documentation Component
 * ---------------------------------------------------------------
 * Displays a full documentation page describing how the
 * World Fun Facts application works. Covers:
 * - Project overview
 * - Feature list
 * - Setup instructions
 * - REST API endpoints
 * - Data models
 * - Technologies used
 *
 * This page is accessible through the /docs route and
 * includes a button to return to the main application.
 */
export default function Documentation() {
    return (
        <div className="docs-container">

            {/* Top Close Button */}
            <Link to="/" className="docs-close-btn">✖ Close</Link>

            <h1>World Fun Facts - Documentation</h1>

            {/* OVERVIEW */}
            <section>
                <h2>Overview</h2>
                <p>
                    World Fun Facts is an interactive MERN application that lets users explore countries using a 3D globe interface.
                    When a country is selected, the app displays real-time information from the REST Countries API along with
                    community-submitted fun facts stored in MongoDB. Users can add, delete, and upvote facts through a custom
                    Express backend. The app also integrates Google's Gemini AI to instantly generate fun facts about any country.
                    With a responsive search system, smooth animations, and a clean UI, the project provides an engaging way to
                    learn about the world.
                </p>
            </section>

            {/* FEATURES */}
            <section>
                <h2>Features</h2>
                <ul>
                    <li>3D interactive globe with clickable country markers</li>
                    <li>Real-time country data from REST Countries API</li>
                    <li>Community Facts (CRUD: add, delete, upvote)</li>
                    <li>AI-generated fun facts using Gemini 2.5 Flash</li>
                    <li>Search bar to locate countries</li>
                    <li>Full Express REST backend with MongoDB persistence</li>
                </ul>
            </section>

            {/* HOW TO RUN */}
            <section>
                <h2>How to Run (Local)</h2>
                <pre>
                    <br /># CLIENT
                    <br />cd client
                    <br />npm install
                    <br />npm run dev
                    <br />
                    <br /># SERVER
                    <br />cd server
                    <br />npm install
                    <br />npm run dev
                </pre>
            </section>

            {/* API ENDPOINTS */}
            <section>
                <h2>REST API Endpoints</h2>

                <h3>Community Facts API</h3>
                <pre>
                    GET /api/facts/:countryCode <br />
                    POST /api/facts <br />
                    PUT /api/facts/:id/upvote <br />
                    DELETE /api/facts/:id <br />
                </pre>

                <h3>AI Facts API</h3>
                <pre>
                    POST /api/ai/facts <br />
                    Body: <br />
                    {"{"} <br />
                    {"    "} "country": "India" <br />
                    {"}"} <br />
                </pre>
            </section>

            {/* DATA MODEL */}
            <section>
                <h2>MongoDB Data Model</h2>
                <pre>
                    {"{"} <br />
                    {"    "} _id: ObjectId, <br />
                    {"    "} countryCode: String, <br />
                    {"    "} countryName: String, <br />
                    {"    "} factText: String, <br />
                    {"    "} upvotes: Number <br />
                    {"}"} <br />
                </pre>
            </section>

            {/* TECHNOLOGIES */}
            <section>
                <h2>Technologies Used</h2>
                <ul>
                    <li>React + Vite</li>
                    <li>React Three Fiber (3D Globe)</li>
                    <li>Express.js</li>
                    <li>MongoDB + Mongoose</li>
                    <li>Google Gemini GenAI API</li>
                    <li>REST Countries API</li>
                </ul>
            </section>

            {/* BOTTOM RETURN BUTTON */}
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Link to="/" className="docs-bottom-btn">Return to App</Link>
            </div>

        </div>
    );
}
